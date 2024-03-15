import React from "react";
import { Box } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import DynamicCategory from "./DynamicCategory";
import DynamicFields from "./DynamicFields";
import moment from "moment";
import CustomButton from "../../../components/@extended/CustomButton";
import FocusError from "../../../components/common/FocusError";
import { useDispatch, useSelector } from "react-redux";
import { openMessage } from "../../../store/slices/showMessageSlice";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import { setUserLocation } from "../../../store/slices/userDetailsSlice";
import OTPPanel from "../../../components/common/OTPPanel";
import { useGenerateOTPValueMutation, useVerifyOTPValueMutation } from "../../../store/slices/apiSlice";
import { useResponsive } from "../../../hooks/ResponsiveProvider";

const getFieldValidationSchema = (fieldValidationSchema, fe) => {
    const skipValidationFields = ['MULTISELECT_DROP_DOWN', 'CHECK_BOX_GROUP', 'LABEL', 'DATA_LABEL', 'CHECK_BOX', 'DATA_HTML', 'FILE_UPLOAD', 'BUTTON', "SEARCH_DROP_DOWN"];
    if (!skipValidationFields.includes(fe.type)) {
        let validator = fe.subtype === "number" ? yup.number() : yup.string().trim();
        if (fe.required) {
            let req = "required";
            let msg = "This field is required";
            validator = validator[req](msg);
        }
        if (fe.requiredDepends) {
            let when = "when";
            let dependsKey = fe.requiredDepends.includes(".") ? fe.requiredDepends.split(".") : fe.requiredDepends;
            validator = validator[when](dependsKey, {
                is: (schema, value) => {
                    return value === fe.requiredValidationValue
                },
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema.notRequired(),
            });
        }
        if (fe.validations) {
            fe.validations.forEach((validation) => {
                const { params, type } = validation;
                if (!validator[type]) {
                    return;
                }
                validator = validator[type](...params);
            });
        }

        fieldValidationSchema[fe.key] = validator;

    } else if (fe.type === "CHECK_BOX") {
        if(fe.valueRequired) {
            fieldValidationSchema[fe.key] = yup.boolean().oneOf([true], 'This field is required');
        } else {
            fieldValidationSchema[fe.key] = yup.boolean();
        }
    } else if (fe.type === "FILE_UPLOAD") {
        if (fe.required) {
            fieldValidationSchema[fe.key] = yup
                .string()
                .required("A file is required");
        }
        fieldValidationSchema[fe.key + "_inputFile"] = yup.mixed();
    } else if (fe.type === "MULTISELECT_DROP_DOWN") {
        if (fe.required) {
          fieldValidationSchema[fe.key] = yup.array().of(yup.string()).min(1, 'At least one value is required');
        } else {
          fieldValidationSchema[fe.key] = yup.array().of(yup.string());
        }
    } else if (fe.type === "SEARCH_DROP_DOWN") {
        if (fe.required) {
          fieldValidationSchema[fe.key] = yup.array().of(yup.string()).min(1, "At least one value is required");
        } else {
          fieldValidationSchema[fe.key] = yup.array().of(yup.string());
        }
    }
    if (fe.fields && fe.fields.length > 0) {
        fe.fields.forEach((ch) => {
            getFieldValidationSchema(fieldValidationSchema, ch);
        });
    }
};

const getValidationSchema = (_config, userRole) => {
    const _schema = {};
    _config.categories &&
        _config.categories.forEach((ct) => {
            if (!ct.access || (ct.access && (ct.access == userRole || ct.access.includes(userRole)))) {
                const fieldValidationSchema = {};
                ct.fields &&
                    ct.fields.forEach((fe) => {
                        if (!fe.access || (fe.access && (fe.access == userRole || fe.access.includes(userRole)))) {
                            getFieldValidationSchema(fieldValidationSchema, fe);
                        }
                    });
                _schema[ct.key] = yup.object().shape(fieldValidationSchema);
            }
        });
    _config.fields &&
        _config.fields.forEach((fe) => {
            if (!fe.access || (fe.access && (fe.access == userRole || fe.access.includes(userRole)))) {
                getFieldValidationSchema(_schema, fe);
            }
        });
    return _schema;
};
const getFieldInitValue = (_initVal, fe, formAnswers) => {
    const skipFields = [ 'LABEL', 'DATA_LABEL', "BUTTON", 'DATA_HTML'];
    if (fe.key!=="divider" && !_.includes(skipFields,fe.type)) {
        if (fe.type == "CHECK_BOX_GROUP") {
            _initVal[fe.key] = [];
            fe.options.values.forEach((fe1) => {
                if (
                    formAnswers &&
                    formAnswers[fe.key] &&
                    formAnswers[fe.key].includes(fe1)
                ) {
                    _initVal[fe.key].push(fe1);
                }
            });
        } else if (fe.type == "CHECK_BOX") {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] && formAnswers[fe.key] == "1" ? true : false;
        } else if (fe.type == "INLINE_TEXT_FIELD" && fe.subtype == "DATE") {
            _initVal[fe.key] =
                formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : null;
        } else if (fe.type == "SLIDER") {
            _initVal[fe.key] =
                formAnswers && formAnswers[fe.key]
                    ? Number(formAnswers[fe.key])
                    : Number(fe.defaultValue);
        } else if (fe.type == "SIGNATURE") {
            _initVal[fe.key] =
                formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : "";
            if (fe.currentDateKey) {
                _initVal[fe.currentDateKey] = formAnswers && formAnswers[fe.currentDateKey] ? formAnswers[fe.currentDateKey] : moment().format("DD/MM/YYYY HH:mm:ss");
            } else {
                _initVal[`${fe.key}_sign_date`] = moment().format("DD/MM/YYYY HH:mm:ss");
            }
        } else if (fe.type == "AUDIO") {
            _initVal[fe.key] =
                formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : false;
        } else if (fe.type == "MULTISELECT_DROP_DOWN" || fe.type === "SEARCH_DROP_DOWN") {
            _initVal[fe.key] = formAnswers && formAnswers[fe.key] ? Array.isArray(formAnswers[fe.key]) ? formAnswers[fe.key] : [formAnswers[fe.key]] : [];
        } else {
            _initVal[fe.key] =
                formAnswers && formAnswers[fe.key] ? formAnswers[fe.key] : "";
        }
        if (fe.showDate) {
            _initVal[fe.currentDateKey] = formAnswers && formAnswers[fe.currentDateKey] ? formAnswers[fe.currentDateKey] : moment().format("DD/MM/YYYY HH:mm:ss");
        }
    }
    fe.fields &&
        fe.fields.forEach((ch) => {
            getFieldInitValue(_initVal, ch, formAnswers);
        });
};

const getInitialVal = (_config, formAnswers, userRole) => {
    const _initVal = {};
    _config.categories &&
        _config.categories.forEach((ct) => {
            if (ct.key!=="divider" && !ct.access || (ct.access && (ct.access == userRole || ct.access.includes(userRole)))) {
                _initVal[ct.key] = {};
                ct.fields &&
                    ct.fields.forEach((fe) => {
                        if (!fe.access || (fe.access && (fe.access == userRole || fe.access.includes(userRole)))) {
                            getFieldInitValue(
                                _initVal[ct.key],
                                fe,
                                formAnswers && formAnswers[ct.key]
                            );
                        }
                    });
            }
        });
    _config.fields &&
        _config.fields.forEach((fe) => {
            if (!fe.access || (fe.access && (fe.access == userRole || fe.access.includes(userRole)))) {
                getFieldInitValue(_initVal, fe, formAnswers);
            }
        });
    return _initVal;
};

const DynamicForm = (props) => {
    const {
        _config,
        sectionKey,
        subSectionKey,
        AddNewField,
        handleSave,
        readOnly,
        showSkeleton = false,
        buttonLabel,
        showButton,
        navigateToNextTab,
        userSiteTrialRole,
        onFormChanged,
        handleSaveSignature,
        handleUploadFile,
        handleDownloadFile,
        handleDownloadSignature,
        formAnswers,
        sectionsLength,
        sectionIndex
    } = props;
    let { siteInitStep } = useParams();
    const [validationSchema, setvalidationSchema] = useState(null);
    const [initialValuess, setInitialValuess] = useState(null);
    const [backupValues, setBackupValues] = useState(null);
    const [openOTP, setOpenOTP] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [generateOTPValue] = useGenerateOTPValueMutation();
    const [verifyOTPValue] = useVerifyOTPValueMutation();
    const {isSmallScreen} = useResponsive();
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        buttonLabel: "",
        message: "",
    });
    const userDetails = useSelector((state) => state.userDetails);
    const dispatch = useDispatch()
    const submittedAnswers = useMemo(async () => {
        if (userSiteTrialRole) {
            setInitialValuess(getInitialVal(_config, formAnswers, userSiteTrialRole));
        }
    }, [userSiteTrialRole, formAnswers]);
    useEffect(() => {
        if (userDetails && (!userDetails.locationLat || !userDetails.locationLng)) {
            getGeoLocation();
        }
    }, [userDetails])

    useEffect(() => {
        if (_config) {
            onFormChanged && onFormChanged(sectionKey, subSectionKey);
            const yepSchema = getValidationSchema(_config, userSiteTrialRole);
            setvalidationSchema(yup.object().shape(yepSchema));
            if (backupValues) {
                setInitialValuess(getInitialVal(_config, backupValues, userSiteTrialRole));
                setBackupValues(null)
            }
        }
    }, [_config]);

    const handleAddNewField = (parentKey, keys, values) => {
        setBackupValues(values)
        AddNewField(parentKey, keys)
    }

    const getGeoLocation = async (processSubmit, values) => {
        if ('geolocation' in navigator) {
            await navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    // Do something with the latitude and longitude
                    if (latitude && longitude) {
                        dispatch(setUserLocation({ locationLatitude: latitude, locationLongitude: longitude }))
                    }
                    processSubmit && processSubmit(values, { locationLat: latitude, locationLng: longitude });
                },
                (error) => {
                    dispatch(openMessage({ message: "Please enable location access to submit your response.", messageSeverity: "error" }))
                    console.error(`Error getting geolocation: ${error.message}`);
                }
            );
        } else {
            // Geolocation is not supported
            dispatch(openMessage({ message: "Geolocation is not supported!", messageSeverity: "error" }))
            console.log('Geolocation is not supported');
        }
    }

    const _handleSubmit = async (values) => {
        let _locationObj = { ...userDetails };
        if (!_locationObj.locationLat || !_locationObj.locationLng) {
            _locationObj = await getGeoLocation(processSubmit, values);
        } else {
            await processSubmit(values, _locationObj);
        }
    };
    const processSubmit = async (values, _locationObj) => {
        const currentTime = new Date();
        const payload = {
            stepKey: siteInitStep,
            sectionKey,
            subSectionKey,
            answers: {
                ...values,
                locationLatitude: _locationObj.locationLat,
                locationLongitude: _locationObj.locationLng,
                createdTime:currentTime
            },
        };
        await handleSave(payload);
        setOpenOTP(false);
        setOtpVerified(false);
        setBackupValues(null);
        setConfirmDialog({ open: false, message: "", buttonLabel: "" });
        dispatch(
            openMessage({
                message: "Submitted Successfully!",
                messageSeverity: "success",
            })
        );
        navigateToNextTab && navigateToNextTab();
    };

    const checkSectionIndex = (values) => {
        if (sectionsLength === sectionIndex) {
            setBackupValues(values);
            setConfirmDialog({
                open: true,
                message: "Are you sure you want to submit the details?",
                buttonLabel: "Submit",
            });
        } else {
            _handleSubmit(values);
        }
    };
    const verifyOTP = async (otpVal) => {
        const verifyOtpRes = await verifyOTPValue({ payload: {otp: otpVal} });
        if (verifyOtpRes.data) {
            dispatch(openMessage({ message: "OTP verified sucessfully!", messageSeverity: "success" }));
            setOpenOTP(false);
            setOtpVerified(true);
        } else if (verifyOtpRes.error) {
            dispatch(openMessage({ message: verifyOtpRes.error?.data?.message, messageSeverity: "error" }));
        }
    }
    const generateOTP = async () => {
        setOpenOTP(true);
        await generateOTPValue();
        dispatch(openMessage({ message: "OTP sent to your registered mobile number.", messageSeverity: "success" }))
    }

    const handleConfirmDialogClose = () => {
        setBackupValues(null)
        setConfirmDialog({ open: false, message: "", buttonLabel: "" });
    };

    return (
        <>
            {_config && initialValuess && (
                <Formik
                    validateOnChange={false}
                    initialValues={initialValuess}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={checkSectionIndex}
                >
                    {({ isSubmitting, setFieldValue, values, touched, errors }) => (
                        <Form>
                            {_config.categories && (
                                <DynamicCategory
                                    _config={_config.categories}
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    touched={touched}
                                    handleAddNewField={handleAddNewField}
                                    errors={errors}
                                    userSiteTrialRole={userSiteTrialRole}
                                    otpRequired={_config.otpRequired}
                                    otpVerified={otpVerified}
                                    readOnly={showSkeleton}
                                    showSkeleton={showSkeleton}
                                    handleSaveSignature={handleSaveSignature}
                                    handleUploadFile={handleUploadFile}
                                    handleDownloadFile={handleDownloadFile}
                                    handleDownloadSignature={handleDownloadSignature}
                                    sectionKey={sectionKey}
                                    subSectionKey={subSectionKey}
                                />
                            )}
                            {_config.fields && (
                                <DynamicFields
                                    _config={_config.fields}
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    touched={touched}
                                    userSiteTrialRole={userSiteTrialRole}
                                    errors={errors}
                                    otpRequired={_config.otpRequired}
                                    otpVerified={otpVerified}
                                    readOnly={showSkeleton}
                                    showSkeleton={showSkeleton}
                                    handleSaveSignature={handleSaveSignature}
                                    handleUploadFile={handleUploadFile}
                                    handleDownloadFile={handleDownloadFile}
                                    handleDownloadSignature={handleDownloadSignature}
                                    sectionKey={sectionKey}
                                    subSectionKey={subSectionKey}
                                />
                            )}
                            {(!_config.otpRequired || (_config.otpRequired && otpVerified)) && buttonLabel && showButton && (
                                <Box m={2} sx={{ display: "flex", justifyContent: "end" }}>
                                    <CustomButton
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={false}
                                    >
                                        {buttonLabel}
                                    </CustomButton>
                                </Box>
                            )}
                            {
                                _config.otpRequired && !otpVerified && ((buttonLabel && showButton) || !showButton) && !showSkeleton &&
                                <Box sx={{ display: "flex", justifyContent: isSmallScreen?'center':"end", marginX: isSmallScreen?0:2 }}>
                                    {openOTP ? <OTPPanel otpVerified={verifyOTP} /> : <CustomButton
                                        variant="contained"
                                        color="primary"
                                        onClick={generateOTP}
                                    >
                                        OTP Required
                                    </CustomButton>}

                                </Box>
                            }
                            <FocusError />
                        </Form>
                    )}
                </Formik>
            )}
            <ConfirmationDialog
                open={confirmDialog.open}
                buttonLabel={confirmDialog.buttonLabel}
                message={confirmDialog.message}
                handleClose={handleConfirmDialogClose}
                handleConfirm={() => _handleSubmit(backupValues)}
            />
        </>
    );
}
export default React.memo(DynamicForm);
