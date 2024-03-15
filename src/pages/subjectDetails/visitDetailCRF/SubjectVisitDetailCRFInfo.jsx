import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { bloqcibeApi, useExternalVerifyCRFMutation, useGetSubjectAnswersQuery, useGetSubjectDetailQuery, useGetTrialDetailsQuery, useGetTrialSiteInfoQuery, useGetVisitAnswersQuery } from "../../../store/slices/apiSlice";
import { findObjectByKey, getUserRole } from "../../util";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base64ToArrayBuffer } from "../../../components/common/DocumentUpload";
import _ from 'lodash';
import { useSpring, animated } from '@react-spring/web';
import SvgIcon from '@mui/material/SvgIcon';
import RightArrow from "../../../components/icons/RightArrow";
import Collapse from '@mui/material/Collapse';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { SKIPPED_FIELDS_KEY } from "../../../util/constants";
import FormDetails from "../subjectDetailCRF/FormDetails";
import { mergeCustomFields } from "../../../util/util";
import originalConfig from '../../subjectCRF/visitCRF (2).json'
import { openMessage } from "../../../store/slices/showMessageSlice";
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

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

const SubjectVisitDetailCRFInfo = (props) => {
  const { subjectStepStatusData } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme()
  const [originalFormConfig, setOriginalFormConfig] = useState(null);
  const { trialId, siteId, trialSiteId, subjectMasterId, crfMasterId, visitStepKey } = useParams();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const loggedInUser = useSelector((state) => state.auth.user);
  const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
  const [selectedForm, setSelectedForm] = useState();
  const [selectedSectionKey, setSelectedSectionKey] = useState();
  const [selectedSubSectionKey, setSelectedSubSectionKey] = useState();
  const [stepCRFStatus, setStepCRFStatus] = useState();
  const { data: trialDetails } = useGetTrialDetailsQuery({
    id: trialId,
    sponsorId: sponsorId,
  });
  const [externalVerifyCRF] = useExternalVerifyCRFMutation()
  const [downloadCRFFile] =
    bloqcibeApi.endpoints.downloadCRFFile.useLazyQuery();
  const [formConfig, setFormConfig] = useState(null);
  // const [formConfig, setFormConfig] = useState(originalConfig.steps.find((_obj) => _obj.key === visitStepKey));
  const [userSiteTrialRole, setUserSiteTrialRole] = useState();
  const [downloadVisitSignature] =
    bloqcibeApi.endpoints.downloadVisitSignature.useLazyQuery();
  const [getEConsentFormConfig, { data: formData }] =
    bloqcibeApi.endpoints.getEConsentFormConfig.useLazyQuery();
  const { data: subjectDetailWithSteps } = useGetSubjectDetailQuery(subjectMasterId);
  const [getVisitAnswers, { data: visitDetails }] = bloqcibeApi.endpoints.getVisitAnswers.useLazyQuery();
  const crfStepStatus = useMemo(() => {
    if (subjectDetailWithSteps) {
      const steps = _.sortBy(subjectDetailWithSteps?.crfDetail?.stepStatus, 'order');
      return steps;
    }
    return [];
  }, [subjectDetailWithSteps]);

  const { data: trialSiteData } = useGetTrialSiteInfoQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteTrialId: trialSiteId,
  });

  useEffect(() => {
    (async () => {
      let _config = null;
      const _formDetailsData = await getLibraryForm(
        `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/crf_configuration_forms`
      );
      if (_formDetailsData.data) {
        setOriginalFormConfig(_formDetailsData.data);
      } else if (_formDetailsData.error) {
        console.error("UNABLE TO GET FORM DETAILS");
      }
      if (trialSiteData) {
        const formDetailsData = await getEConsentFormConfig({
          sponsorId,
          trialId,
          siteId: trialSiteData.siteTrialData.siteId,
          documentKey: "crf_configuration_forms",
          payload: {
            subjectMasterId: subjectMasterId
          }
        });
        if (formDetailsData.data) {
          let _tempConfig = { ..._formDetailsData.data };
          const mergedConfig = mergeCustomFields(_tempConfig, formDetailsData.data);
          setFormConfig(
            mergedConfig.steps.find((_obj) => _obj.key === visitStepKey)
          );
        } else if (formDetailsData.error) {
          console.error("UNABLE TO GET FORM DETAILS");
        } else {
          setFormConfig(
            _formDetailsData.data.steps.find((_obj) => _obj.key === visitStepKey)
          );
        }
        const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
        setUserSiteTrialRole(userRole);
        await getVisitAnswers({
          sponsorId: sponsorId,
          trialId: trialId,
          siteId: trialSiteData?.siteTrialData?.site?.id,
          payload: {
            crfMasterId: crfMasterId,
            subjectMasterId: subjectMasterId,
            stepKey: visitStepKey,
            crfMasterId: crfMasterId,
          }
        })
      }
    })();
  }, [trialSiteData, visitStepKey]);
  // useEffect(() => {
  //     if (formConfig && formConfig.sections[0]?.subTabs && formConfig.sections[0]?.subTabs?.length !== 0) {
  //         setSelectedForm(formConfig.sections[0].subTabs[0])
  //         setSelectedSectionKey(formConfig.sections[0].key)
  //         setSelectedSubSectionKey(formConfig.sections[0]?.subTabs[0].key)
  //     } else if(formConfig) {
  //         setSelectedForm(formConfig?.sections[0])
  //         setSelectedSectionKey(formConfig?.sections[0].key)
  //     }
  // },[formConfig])
  const handleDownloadSignature = async (s3Key, setSign) => {
    const result = await downloadVisitSignature({
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
  }
  const openStepForm = (stepKey) => {
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/${visitStepKey}/${subjectMasterId}/crf/${crfMasterId}`)
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
    const _sectionKey = node.split('@')[0];
    const _subSectionKey = node.split('@')[1];
    const _sec = findObjectByValue(formConfig, _subSectionKey ? _subSectionKey : _sectionKey);
    if (_sec && !_sec.subTabs) {
      setSelectedSectionKey(_sectionKey);
      setSelectedSubSectionKey(_subSectionKey);
      setSelectedForm(_sec);
    }
  }
  const editAllowed = useMemo(() => {
    const userRole = getUserRole(loggedInUser, trialId, siteId);
    const stepStatusData = crfStepStatus.find((_obj) => _obj.stepKey === visitStepKey);
    if (stepStatusData && stepStatusData.status !== "Withdrawal" && stepStatusData.userAccess) {
      const userAccess = JSON.parse(stepStatusData.userAccess);
      const editAccess = userAccess.edit;
      const isAccess = typeof editAccess !== "string" ? _.find(editAccess, (access) => {
        return access == userRole;
      }) : editAccess === userRole
      if (isAccess) {
        return true;
      }
      return false;
    }
    return false;
  }, [subjectStepStatusData]);
  const stepSatus = useMemo(() => {
    if (subjectDetailWithSteps) {
      const stepStatusData = subjectDetailWithSteps?.crfDetail?.stepStatus.find((_obj) => _obj.stepKey === visitStepKey);
      return { status: stepStatusData.status, title: stepStatusData.stepLabel };
    }
    return { status: '', title: '' }
  }, [subjectDetailWithSteps, visitStepKey]);
  const handleDownloadFile = async (s3Key, fileName) => {
    const result = await downloadCRFFile({
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
      console.log("Failed to load file");
    }
  }

  const readOnlyActions = useMemo(() => {
    if (formConfig) {
      return formConfig?.readOnlyActions
    }
    return null
  }, [formConfig])

  const selectedFormStatus = useMemo(() => {
    if (subjectDetailWithSteps && selectedForm) {
      const steps = _.find(subjectDetailWithSteps?.crfDetail?.stepStatus, (_step) => _step.stepKey === visitStepKey);
      setStepCRFStatus(steps)
      let statusData = findObjectByValue(steps, selectedForm.key)
      return statusData?.status;
    }
    return null;
  }, [subjectDetailWithSteps, selectedForm]);

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
    const verify = await externalVerifyCRF({
      sponsorId,
      trialId,
      siteId,
      payload: {
        crfMasterId: crfMasterId,
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
  }
  if (stepSatus.status != "Completed" &&
    stepSatus.status != "External_Verification_Pending"
  ) {
    return (<Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 3, justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <PendingActionsRoundedIcon sx={{ height: 100, width: 100, color: '#FF9933' }} />
      <Typography variant="h6" color={'grey'}>{`${stepSatus.title} is pending`}</Typography>
    </Box>)
  }
  return (
    <Box>
      {selectedForm && <Button
        type="text"
        onClick={() => setSelectedForm(null)}
        startIcon={<RightArrow leftArrow />}
      >
        <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
          Back
        </Typography>
      </Button>}
      
      <Box sx={{ display: "flex", width: "100%" }}>
        {!selectedForm && <Box
          sx={{
            width: "100%",
            paddingTop: 2,
            paddingX: 2,
            border: "1px solid #E7E7E7",
            position: "sticky",
            position: "-webkit-sticky",
            top: "auto",
          }}
        >
          <TreeView
            defaultExpanded={["step-1"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            onNodeSelect={onFormSelect}
            //defaultEndIcon={<CloseSquare />}
            sx={{ overflowX: "hidden" }}
          >
            {formConfig &&
              formConfig.sections.map((section, subIndex) => {
                let sectionSatus = stepCRFStatus?.sectionStatuses.find(
                  (a) => a.sectionKey === section.key
                );
                return (
                  sectionSatus?.status !== "Pending" &&
                  (section.showInReadOnly == undefined ||
                    section.showInReadOnly) && (
                    <StyledTreeItem
                      key={`${section.key}`}
                      nodeId={`${section.key}`}
                      sx={{
                        "& .MuiTreeItem-content": {
                          paddingY: 1,
                        },
                      }}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 0.5,
                            pr: 0,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "inherit", flexGrow: 1 }}
                          >
                            {section.label}
                          </Typography>
                          {/* {sectionSatus?.status ===
                              "External_Verification_Pending" && (
                              <PendingActionsRoundedIcon
                                sx={{
                                  color: theme.palette.primary.light,
                                  fontSize: 23,
                                }}
                              />
                            )} */}
                        </Box>
                      }
                    >
                      {section &&
                        section.subTabs &&
                        section.subTabs.map((subTab, subIndex1) => {
                          let subSectionSatus =
                            sectionSatus?.subSectionStatuses.find(
                              (a) => a.subSectionKey === subTab.key
                            );
                          return (
                            !SKIPPED_FIELDS_KEY.includes(subTab.key) &&
                            subSectionSatus?.status !== "Pending" &&
                            (subTab.showInReadOnly == undefined ||
                              subTab.showInReadOnly) && (
                              <StyledTreeItem
                                key={`${section.key}@${subTab.key}`}
                                nodeId={`${section.key}@${subTab.key}`}
                                label={subTab.label}
                              ></StyledTreeItem>
                            )
                          );
                        })}
                    </StyledTreeItem>
                  )
                );
              })}
          </TreeView>
        </Box>}
        {selectedForm && <Box sx={{ width: "100%", paddingX: 1 }}>
          <FormDetails
            details={selectedForm}
            handleDownload={handleDownloadFile}
            sectionKey={selectedSectionKey}
            openStepForm={openStepForm}
            stepKey={visitStepKey}
            editAllowed={editAllowed}
            subSectionKey={selectedSubSectionKey}
            formStatus={selectedFormStatus}
            handleDownloadSignature={handleDownloadSignature}
            userSiteTrialRole={userSiteTrialRole}
            readOnlyActions={readOnlyActions}
            answers={visitDetails}
            verifyAction={handleSubjectVerification}
          />
        </Box>}
      </Box>
    </Box>
  );
}

export default SubjectVisitDetailCRFInfo;