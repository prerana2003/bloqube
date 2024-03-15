import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import originalConfig from "./../enrollSubject/subjectEnrolForms.json";
import { bloqcibeApi, useExternalVerifySubjectMutation, useGetSubjectAnswersQuery, useGetTrialDetailsQuery, useGetTrialSiteInfoQuery } from "../../store/slices/apiSlice";
import { findObjectByKey, getUserRole } from "../util";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from 'lodash'
import { base64ToArrayBuffer } from "../../components/common/DocumentUpload";
import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { alpha, styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import FormDetails from "./subjectDetailCRF/FormDetails";
import { mergeCustomFields } from "../../util/util";
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import { openMessage } from "../../store/slices/showMessageSlice";

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, color: '#FF6602' }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}
function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14, color: '#FF6602' }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 14, height: 14 }}
            {...props}
        >
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
        },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const CustomTreeItem = forwardRef((props, ref) => (
    <TreeItem {...props} TransitionComponent={TransitionComponent} ref={ref} />
));

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

const SubjectDetailCRFInfo = (props) => {
    const { subjectStepStatusData, stepStatusData } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme()
    const { trialId, siteId, trialSiteId, subjectMasterId } = useParams();
    const [originalFormConfig, setOriginalFormConfig] = useState(null);
    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const [selectedForm, setSelectedForm] = useState();
    const [selectedStepKey, setSelectedStepKey] = useState();
    const [selectedSectionKey, setSelectedSectionKey] = useState();
    const [selectedSubSectionKey, setSelectedSubSectionKey] = useState();
    const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
    const { data: trialDetails } = useGetTrialDetailsQuery({
        id: trialId,
        sponsorId: sponsorId,
    });
    const [externalVerifySubject] = useExternalVerifySubjectMutation()
    const [downloadSubjectFile] =
        bloqcibeApi.endpoints.downloadSubjectFile.useLazyQuery();
    const loggedInUser = useSelector((state) => state.auth.user);
    const [formConfig, setFormConfig] = useState(null);
    const [userSiteTrialRole, setUserSiteTrialRole] = useState();
    // const [formConfig, setFormConfig] = useState(originalConfig);
    const [getEConsentFormConfig, { data: formData }] =
        bloqcibeApi.endpoints.getEConsentFormConfig.useLazyQuery();
    const [downloadSubjectSignature] =
        bloqcibeApi.endpoints.downloadSubjectSignature.useLazyQuery();
    const [getSubjectAnswers, { data: subjectDetails }] =
        bloqcibeApi.endpoints.getSubjectAnswers.useLazyQuery();
    const { data: trialSiteData } = useGetTrialSiteInfoQuery({
        sponsorId: sponsorId,
        trialId: trialId,
        siteTrialId: trialSiteId,
    });
    useEffect(() => {
        (async () => {
            const _formDetailsData = await getLibraryForm(
                `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/subject_enrollment_forms`
            );
            if (_formDetailsData.data) {
                setOriginalFormConfig(_formDetailsData.data);
            } else if (_formDetailsData.error) {
                console.error("UNABLE TO GET FORM DETAILS");
            }
            const formDetailsData = await getEConsentFormConfig({
                sponsorId,
                trialId,
                siteId,
                documentKey: "subject_enrollment_forms",
                payload: {
                    subjectMasterId: subjectMasterId
                }
            });
            if (formDetailsData.data) {
                let _tempConfig = { ..._formDetailsData.data };
                const mergedConfig = mergeCustomFields(_tempConfig, formDetailsData.data);
                setFormConfig(mergedConfig);
            } else if (formDetailsData.error) {
                console.error("UNABLE TO GET FORM DETAILS");
            } else {
                setFormConfig(_formDetailsData.data);
            }
        })();
    }, [dispatch]);

    useEffect(() => {
      (async () => {
        await getSubjectAnswers({
          sponsorId,
          trialId,
          siteId,
          payload: {
            subjectMasterId: subjectMasterId,
          },
        });
      })();
    }, [stepStatusData]);

    useEffect(() => {
        (async () => {
            if (trialSiteData) {
                const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
                setUserSiteTrialRole(userRole);
            }
        })();
    }, [trialSiteData]);

    useEffect(() => {
        setSelectedForm(formConfig?.steps[0]?.sections[0])
        setSelectedStepKey(formConfig?.steps[0]?.key)
    },[formConfig])
    

    const editAllowed = useMemo(() => {
        const userRole = getUserRole(loggedInUser, trialId, siteId);
        const stepStatusData = subjectStepStatusData.find((_obj) => _obj.stepKey === selectedStepKey);
        if (stepStatusData && stepStatusData.status !== "Withdrawal" && stepStatusData.userAccess) {
            const userAccess = JSON.parse(stepStatusData.userAccess);
            const editAccess = userAccess.edit;
            const isAccess = typeof editAccess !== "string" ? _.find(editAccess, (access) => {
                return access === userRole;
            }) : editAccess === userRole
            if (isAccess) {
                return true;
            }
            return false;
        }
        return false;
    }, [selectedStepKey]);

    const openStepForm = (stepKey) => {
        navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/${selectedStepKey}/${subjectMasterId}`)
    };

    const handleDownloadSignature = async (s3Key, setSign) => {
        const result = await downloadSubjectSignature({
            s3Key: s3Key,
        });
        if (result.data) {
            const byteArray = base64ToArrayBuffer(result.data);
            const rr = new Blob([byteArray], { type: "application/octet-stream" });
            const reader = new FileReader();
            reader.readAsDataURL(rr);
            reader.onloadend = function () {
                const base64data = reader.result;
                setSign(base64data);
            };
        } else {
            console.log("Failed to load signature");
        }
    };
    function findObjectByValue(
        obj,
        targetValue,
        path = [],
    ) {
        for (const key in obj) {
            if (obj[key] === targetValue) {
                return obj;
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                // Continue searching in the nested object
                const result = findObjectByValue(
                    obj[key],
                    targetValue,
                    [...path, key],
                );
                if (result) {
                    return result;
                }
            }
        }
        // Value not found in the current object
        return null;
    }
    const onFormSelect = (e, node) => {
        const _sec = findObjectByValue(formConfig, node.split('@')[0]);
        if (_sec && !_sec.subTabs && !_sec.sections) {
            setSelectedStepKey(node.split('@')[1])
            setSelectedForm(_sec);
        }
    }
    const handleDownloadFile = async (s3Key, fileName) => {
        const result = await downloadSubjectFile({
            s3Key: s3Key,
        });
        if (result.data) {
            let byteArray = base64ToArrayBuffer(result.data);
            let a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(
                new Blob([byteArray], { type: "application/octet-stream" })
            );
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
        } else {
            console.log("Failed to load signature");
        }
    }

    const selectedFormStatus = useMemo(() => {
        if (selectedStepKey && stepStatusData) {
            let statusData = findObjectByValue(stepStatusData, selectedStepKey)
            return statusData?.status
        }
        return null
    }, [stepStatusData, selectedStepKey])
    
    const readOnlyActions = useMemo(() => {
        if (formConfig) {
            let step = formConfig.steps.find((step) => step.key === selectedStepKey)
            return step?.readOnlyActions
        }
    }, [selectedStepKey, formConfig])

    const handleSubjectVerification = async (payload) => {
        let _ans = {}
        if (selectedForm) {
            selectedForm?.categories && selectedForm?.categories.forEach((category) => {
                const _answers = findObjectByKey(payload?.answers, category.key)
                if (_answers) _ans[category.key] = _answers
            });
            selectedForm?.fields && selectedForm?.fields.forEach((field) => {
                const _answer = findObjectByKey(payload?.answers, field.key)
                if (_answer) _ans[field.key] = _answer
            });
        }
      const verify = await externalVerifySubject({
        sponsorId,
        trialId,
        siteId,
        payload: {
          subjectMasterId: subjectMasterId,
          documentKey: "subject_enrollment_forms",
          documentVersion: "1.0",
          crfDocumentKey: "crf_configuration_forms",
          crfDocumentVersion: "1.0",
          stepKey: payload.stepKey,
          sectionKey: payload.sectionKey,
          subSectionKey: payload.subSectionKey,
          answers: _ans,
        },
      });
      if (verify.data) {
        dispatch(
          openMessage({
            message: "Verified Sucessfully!",
            messageSeverity: "success",
          })
        );
      } else {
        dispatch(
          openMessage({
            message: "Verification request failed!",
            messageSeverity: "error",
          })
        );
      }
    };
    
    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Box sx={{ display: 'flex', width: '100%', columnGap: 2 }}>
                    <Box sx={{ width: '30%' }}>
                        <Box sx={{ paddingY: 2, paddingX: 2, border: '1px solid #E7E7E7' }}>
                            <TreeView
                                // defaultExpanded={defaultTreeChild}
                                // defaultSelected={defaultTreeChild }
                                defaultCollapseIcon={<MinusSquare />}
                                defaultExpandIcon={<PlusSquare />}
                                //defaultEndIcon={<CloseSquare />}
                                onNodeSelect={onFormSelect}
                                sx={{ overflowX: 'hidden' }}
                            >
                                {formConfig &&
                                    formConfig.steps.map((step) => {
                                        let stepSatus = stepStatusData.find((a)=>a.stepKey===step.key)
                                        return ((stepSatus?.status!=="Pending") && step.showInReadOnly == undefined || step.showInReadOnly) &&
                                        <StyledTreeItem key={`${step.key}`}
                                            sx={{
                                                '& .MuiTreeItem-content': {
                                                    paddingY: 1
                                                },
                                            }}
                                                nodeId={`${step.key}`}
                                                label={<Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            p: 0.5,
                                                            pr: 0,
                                                        }}
                                                        >
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                                                                {step.label}
                                                            </Typography>
                                                           {stepSatus?.status==="External_Verification_Pending"&&  <PendingActionsRoundedIcon
                                                                sx={{
                                                                color: theme.palette.primary.light,
                                                                fontSize: 23,
                                                                }}
                                                            />}
                                                    </Box>
                                                    }>
                                            {
                                                step &&
                                                step.sections.map((section, subIndex) => (
                                                    ((section.showInReadOnly == undefined || section.showInReadOnly) &&
                                                        <StyledTreeItem key={`${section.key}`} nodeId={`${section.key}@${step.key}`} label={section.label}>
                                                            {/* {section && section.subTabs &&
                                                            section.subTabs.map((subTab, subIndex1) => (
                                                                (
                                                                    !SKIPPED_FIELDS_KEY.includes(subTab.key) && (subTab.showInReadOnly == undefined || subTab.showInReadOnly) &&
                                                                    <StyledTreeItem key={`${subTab.key}`} nodeId={`${subTab.key}`} label={subTab.label}>
                                                                    </StyledTreeItem>
                                                                )
                                                            ))} */}
                                                        </StyledTreeItem>
                                                    )
                                                ))
                                            }
                                        </StyledTreeItem>
                                    })}
                            </TreeView>
                        </Box>
                    </Box>
                    <Box sx={{ width: '70%', paddingX: 1 }}>
                        {selectedForm && <FormDetails
                            openStepForm={openStepForm}
                            details={selectedForm}
                            sectionKey={selectedForm.key}
                            handleDownload={handleDownloadFile}
                            stepKey={selectedStepKey}
                            formStatus={selectedFormStatus}
                            editAllowed={editAllowed}
                            handleDownloadSignature={handleDownloadSignature}
                            userSiteTrialRole={userSiteTrialRole}
                            answers={subjectDetails}
                            readOnlyActions={readOnlyActions}
                            verifyAction={handleSubjectVerification}
                        />}
                        {!selectedForm && <Box sx={{ textAlign: 'center' }}><Typography sx={{ color: 'grey' }}>Please select the form..</Typography></Box>}
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default SubjectDetailCRFInfo;