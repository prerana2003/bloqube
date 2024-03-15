import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { bloqcibeApi, useGetTrialSiteInfoQuery } from "../../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { getIn } from "formik";

const DataLabelField = (props) => {
    let { trialId, trialSiteId, siteInitStep } = useParams();
    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const userDetails = useSelector((state) => state.userDetails);
    const [valueToRender, setValueToRender] = useState();
    const [getTrialSiteAnswers] = bloqcibeApi.endpoints.getTrialSiteAnswers.useLazyQuery();
    const { _config,
        parentKey,
        setFieldValue,
        values,
        siteInitiationMasterId,
        touched,
        sectionKey,
        subSectionKey,
        dependCategoryKey,
        dependFieldKey,
        dependStepKey,
        dependSectionKey,
        dependSubSectionKey,
        showSkeleton,
        readOnly,
        errors,
        field } = props;
    const { data: trialSiteData } = useGetTrialSiteInfoQuery({
        sponsorId: sponsorId,
        trialId: trialId,
        siteTrialId: trialSiteId,
    });
    const subject = useSelector((state) => state.subject?.details)
    useEffect(() => {
        (async () => {
            if (trialSiteData) {
                const _investigators = trialSiteData.users.filter((_obj) => _obj.role == 'PI').map((_obj1) => `${_obj1.user.firstName} ${_obj1.user.lastName}`).join(',');
                const _contactInfo = trialSiteData.users.filter((_obj) => _obj.role == 'PI').map((_obj1) => `${_obj1.user.contactNumber}`).join(',');
                switch (field.key) {
                    case 'sponsorNameKey':
                        setValueToRender(<Typography variant="subtitle1">{userDetails?.user?.orgnizationName}</Typography>)
                        break;
                    case 'protocolNoKey':
                        setValueToRender(<Typography variant="subtitle1">{trialSiteData?.siteTrialData?.trial?.protocolNumber}</Typography>)
                        break;
                    case 'siteIdKey':
                        setValueToRender(<Typography variant="subtitle1">{trialSiteData?.siteTrialData.siteId}</Typography>)
                        break;
                    case 'siteNameKey':
                        setValueToRender(<Typography variant="subtitle1">{trialSiteData?.siteTrialData?.site?.orgname}</Typography>)
                        break;
                    case 'crfversionNumberKey':
                        setValueToRender(<Typography variant="subtitle1">1</Typography>)
                        break;
                    case 'siteAddressKey':
                        setValueToRender(<Typography variant="subtitle1">{trialSiteData?.siteTrialData?.site?.address}</Typography>)
                        break;
                    case 'investigatorNameKey':
                        setValueToRender(<Typography variant="subtitle1">{_investigators}</Typography>)
                        break;
                    case 'studyTitleKey':
                        setValueToRender(<Typography variant="subtitle1">{trialSiteData?.siteTrialData?.trial?.trialTitle}</Typography>)
                        break;
                    case 'contactkey':
                        setValueToRender(<Typography variant="subtitle1">{_contactInfo}</Typography>)
                        break;
                    case 'dateOfSiteVisitKey':
                        const _answers = await getTrialSiteAnswers({
                            sponsorId: sponsorId,
                            trialId: trialId,
                            trialSiteId: trialSiteId,
                            payload: {
                                siteInitiationMasterId: trialSiteData?.siteTrialData?.siteInitiationMaster?.id,
                                stepKey: dependStepKey,
                                sectionKey: dependSectionKey,
                                subSectionKey: dependSubSectionKey,
                                categoryKey: dependCategoryKey,
                                fieldKey: dependFieldKey
                            }
                        })
                        setValueToRender(<Typography variant="subtitle1">{dependCategoryKey ? _answers['data'][dependCategoryKey][dependFieldKey] : _answers[dependFieldKey]}</Typography>)
                        break;
                    case 'investigationalProduct1Key':
                        setValueToRender(<Typography variant="subtitle1">{''}</Typography>)
                        break;
                    case 'investigationalProduct2Key':
                        setValueToRender(<Typography variant="subtitle1">{''}</Typography>)
                        break;
                    case 'monitorNameKey':
                        let _siteMonitor = trialSiteData?.users?.filter((user)=>user.role==="site_monitor")
                        setValueToRender(<Typography variant="subtitle1">{_siteMonitor&&`${_siteMonitor[0]?.user?.firstName} ${_siteMonitor[0]?.user?.lastName}`}</Typography>)
                        break;
                    case 'subjectNameKey':
                    case "subjectName":
                        setValueToRender(<Typography variant="subtitle1">{subject?.subjectName }</Typography>)
                        break;
                    case 'trialCreationDateKey':
                        setValueToRender(<Typography variant="subtitle1">{moment(trialSiteData?.siteTrialData?.trial?.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ", true).format('MM/DD/YYYY')}</Typography>)
                        break;
                    case "subjectNumberKey":
                        setValueToRender(<Typography variant="subtitle1">{subject?.subjectNumber}</Typography>)
                        break;
                    case "dateOfAssessment":
                        const currentTime = new Date();
                        setValueToRender(<Typography variant="subtitle1">{values?.currentTime?moment(values?.createdTime).format("DD/MM/YYYY"): moment(currentTime).format("DD/MM/YYYY")}</Typography>)
                        break;
                    default:
                        setValueToRender(<></>);
                }
            }
        })();
    }, [trialSiteData, userDetails,values]);

    return (<Box sx={{ display: 'flex', columnGap: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">{field.label}:</Typography>
        {!showSkeleton && valueToRender}
    </Box>)
}

export default React.memo(DataLabelField);

