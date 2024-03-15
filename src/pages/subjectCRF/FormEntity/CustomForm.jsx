
import React from 'react'
import { Box } from "@mui/material";
import { Formik, Form } from 'formik';
import * as yup from "yup";
import { useEffect,  useState } from "react";
import {
    bloqcibeApi, useSubmitSiteInitAnswersMutation, useGetTrialSiteInfoQuery,
    useUpdateSiteInitAnswersMutation, useVerifySiteInitAnswersMutation
} from "../../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import _ from 'lodash'
import { getUserRole } from "../../util";
import CustomSection from "../../dynamicFormEngine/FormEntity/DynamicCategory";
import CustomFields from "../../dynamicFormEngine/FormEntity/DynamicFields";
import FocusError from '../../../components/common/FocusError';
import moment from "moment";
import CustomButton from '../../../components/@extended/CustomButton';
import { openMessage } from '../../../store/slices/showMessageSlice';

const getFieldValidationSchema = (fieldValidationSchema, fe) => {
    if (fe.type != 'CHECK_BOX_GROUP' && fe.type != 'LABEL' && fe.type != 'DATA_LABEL' && fe.type != 'CHECK_BOX') {
        if (fe.required) {
            fieldValidationSchema[fe.key] = yup.string().required(`This field is required`);
        } else {
            fieldValidationSchema[fe.key] = yup.string()
        }
    } else if (fe.type == 'CHECK_BOX') {
        fieldValidationSchema[fe.key] = yup.boolean()
    }
    if (fe.fields && fe.fields.length > 0) {
        fe.fields.forEach((ch) => {
            getFieldValidationSchema(fieldValidationSchema, ch);
        })
    }
}
const getValidationSchema = (_config) => {
    const _schema = {};
    _config.categories && _config.categories.forEach((ct) => {
        const fieldValidationSchema = {};
        ct.fields && ct.fields.forEach((fe) => {
            getFieldValidationSchema(fieldValidationSchema, fe);
        });
        _schema[ct.key] = yup.object().shape(fieldValidationSchema);
    });
    _config.fields && _config.fields.forEach((fe) => {
        getFieldValidationSchema(_schema, fe);

    });
    return _schema;
};
const getFieldInitValue = (_initVal, fe, formAnswers) => {
    if (fe.type != 'LABEL' && fe.type != 'DATA_LABEL') {
        if (fe.type == 'CHECK_BOX_GROUP') {
            _initVal[fe.key] = [];
            fe.options.values.forEach((fe1) => {
                //_initVal[fe.key][fe1] = false;
                if (formAnswers && formAnswers[fe.key] && formAnswers[fe.key].includes(fe1)) {
                    _initVal[fe.key].push(fe1);
                }
            })
        } else if (fe.type == 'CHECK_BOX') {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] && formAnswers[fe.key] == "1" ? true : false;
        } else if (fe.type == 'INLINE_TEXT_FIELD' && fe.subtype == 'DATE') {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : null;
        } else if (fe.type == 'SLIDER') {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] ? Number(formAnswers[fe.key]) : Number(fe.defaultValue);;
        } else if (fe.type == 'SIGNATURE') {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : '';
            if(fe.currentDateKey) _initVal[fe.currentDateKey] = formAnswers && formAnswers[fe.currentDateKey] ? formAnswers[fe.currentDateKey] : moment().format("DD/MM/YYYY HH:mm:ss");

        } else {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : '';
        }
        if(fe.showDate) {
            _initVal[fe.currentDateKey] = formAnswers && formAnswers[fe.currentDateKey] ? formAnswers[fe.currentDateKey] : moment().format("DD/MM/YYYY HH:mm:ss");
        }
    }
    fe.fields && fe.fields.forEach((ch) => {
        getFieldInitValue(_initVal, ch, formAnswers)
    })
}

const getInitialVal = (_config, formAnswers) => {
    const _initVal = {};
    _config.categories && _config.categories.forEach((ct) => {
        _initVal[ct.key] = {};
        ct.fields && ct.fields.forEach((fe) => {
            getFieldInitValue(_initVal[ct.key], fe, formAnswers && formAnswers[ct.key]);
        });
    });
    _config.fields && _config.fields.forEach((fe) => {
        getFieldInitValue(_initVal, fe, formAnswers)
    });
    return _initVal;
}


const CustomForm = ({ _config, sectionKey, subSectionKey, handleSaveSignature, handleDownloadSignature }) => {
    let { trialId, trialSiteId, siteInitStep } = useParams();
    const [validationSchema, setvalidationSchema] = useState(null);
    const dispatch = useDispatch()
    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const [initialValuess, setInitialValuess] = useState(null);
    const [submitSiteInittAnswers] = useSubmitSiteInitAnswersMutation();
    const [updateSiteInittAnswers] = useUpdateSiteInitAnswersMutation();
    const [verifySiteInittAnswers] = useVerifySiteInitAnswersMutation();
    const [readOnly, setReadOnly] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('');
    const loggedInUser = useSelector((state) => state.auth.user);
    const siteTrialData = useSelector((state) => state.trial.trialSiteDetail);
    const [getTrialSiteAnswers] = bloqcibeApi.endpoints.getTrialSiteAnswers.useLazyQuery();
    const { data: trialSiteData } = useGetTrialSiteInfoQuery({
        sponsorId: sponsorId,
        trialId: trialId,
        siteTrialId: trialSiteId,
    });

    const setStepProperty = (trialSiteData) => {
        const orderedSteps = _.sortBy(trialSiteData?.siteTrialData?.siteInitiationMaster?.stepStatus, 'order');
        const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
        let buttonLabel = '';
        const siteInitStatus = trialSiteData?.siteTrialData?.status;
        if (siteInitStatus == 'Completed') {
            setReadOnly(true);
            return;
        }
        const stepStatusData = orderedSteps.find((_obj) => _obj.stepKey === siteInitStep);
        if (stepStatusData) {
            const userAccess = JSON.parse(stepStatusData.userAccess);
            let sectionStatus = _.filter(stepStatusData.sectionStatuses, (statusData) => {
                return statusData.sectionKey == sectionKey
            })[0]?.status;
            //If step doesn't have any tab
            if(!sectionStatus) {
                sectionStatus = stepStatusData.status;
            }
            if (sectionStatus == 'Pending') {
                const editAccess = userAccess.edit;
                const isAccess = _.find(editAccess, (access) => {
                    return access == userRole;
                })
                if (isAccess) {
                    buttonLabel = 'Submit';
                } else {
                    setReadOnly(true);
                }
            } else if (sectionStatus == 'Verification_Pending') {
                const verifyAccess = userAccess.verify;
                const editAccess = userAccess.edit;
                let isAccess = _.find(verifyAccess, (access) => {
                    return access == userRole;
                })
                const isEditAccess = _.find(editAccess, (access) => {
                    return access == userRole;
                })
                if (isAccess) {
                    buttonLabel = `Verify`;
                } else if (isEditAccess) {
                    buttonLabel = `Update`;
                } else {
                    setReadOnly(true);
                }
            } else if (sectionStatus == 'Completed') {
                const editAccess = userAccess.edit;
                const isAccess = _.find(editAccess, (access) => {
                    return access == userRole;
                })
                if (isAccess) {
                    buttonLabel = 'Update';
                } else {
                    setReadOnly(true);
                }
            } 
            setButtonLabel(buttonLabel);
        }
    }

    useEffect(() => {
        (async () => {
            if (trialSiteData) {
                const _answers = await getTrialSiteAnswers({
                    sponsorId: sponsorId,
                    trialId: trialId,
                    trialSiteId: trialSiteId,
                    payload: {
                        siteInitiationMasterId: trialSiteData?.siteTrialData?.siteInitiationMaster?.id,
                        stepKey: siteInitStep,
                        sectionKey,
                        subSectionKey
                    }
                })
                console.log("_answers", _answers);
                setInitialValuess(getInitialVal(_config, _answers.data));
                setStepProperty(trialSiteData)
            }
        })();
    }, [trialSiteData])

    useEffect(() => {
        if (_config) {
            setInitialValuess(getInitialVal(_config));
            const yepSchema = getValidationSchema(_config);
            setvalidationSchema(yup.object().shape(yepSchema));
        }
        return () => {
            setInitialValuess(null)
        };
    }, [_config]);

    const _handleSubmit = async (values) => {
        const payload = {
            siteInitiationMasterId: trialSiteData?.siteTrialData?.siteInitiationMaster?.id,
            stepKey: siteInitStep,
            sectionKey,
            subSectionKey,
            answers: values
        }
        console.log("values", values);
        if (buttonLabel == 'Update') {
            await updateSiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
        } else if (buttonLabel == 'Verify') {
            await verifySiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
        } else {
            await submitSiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
        }
        dispatch(openMessage({message:"Submitted Successfully!",messageSeverity:"success"}))
        setSuccessMsg(true)
    }
    return (<>
        {_config && initialValuess && <Formik
            validateOnChange={false}
            initialValues={initialValuess}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={_handleSubmit}
        >
            {({ isSubmitting, setFieldValue, values, touched, errors }) => (
                <Form>
                    {trialSiteData?.siteTrialData?.siteInitiationMaster?.id &&
                        _config.categories && <CustomSection _config={_config.categories} handleSaveSignature={handleSaveSignature} handleDownloadSignature={handleDownloadSignature} setFieldValue={setFieldValue} values={values} touched={touched} errors={errors} readOnly={readOnly} sectionKey={sectionKey} subSectionKey={subSectionKey} siteInitiationMasterId={trialSiteData?.siteTrialData?.siteInitiationMaster?.id} />}
                    {trialSiteData?.siteTrialData?.siteInitiationMaster?.id &&
                        _config.fields && <CustomFields _config={_config.fields} handleSaveSignature={handleSaveSignature} handleDownloadSignature={handleDownloadSignature} setFieldValue={setFieldValue} values={values} touched={touched} errors={errors} readOnly={readOnly} sectionKey={sectionKey} subSectionKey={subSectionKey} siteInitiationMasterId={trialSiteData?.siteTrialData?.siteInitiationMaster?.id} />
                    }
                    {buttonLabel && <Box m={2} sx={{ display: 'flex', justifyContent: 'end' }}>
                        <CustomButton type="submit" variant="contained" color="primary" disabled={readOnly}>
                            {buttonLabel}
                        </CustomButton>
                    </Box>}
                    <FocusError />
                </Form>
            )}
        </Formik>}
    </>)
}

export default React.memo(CustomForm);