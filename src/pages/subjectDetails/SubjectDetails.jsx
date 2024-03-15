import {
  Box,
  Button,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import RightArrow from "../../components/icons/RightArrow";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetLibraryFormQuery,
  useGetSubjectDetailQuery
} from "../../store/slices/apiSlice";
import { getUserRole } from "../util";
import SubjectDetailCRFInfo from "./SubjectDetailCRFInfo";
import CustomButton from "../../components/@extended/CustomButton";
import VisitList from "./visitDetailCRF/VisitList";
import { openMessage } from "../../store/slices/showMessageSlice";


const SubjectDetails = ({ }) => {
  const navigate = useNavigate();
  const { trialId, siteId, trialSiteId, subjectMasterId } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [view, setView] = useState(false);
  const [userRole, setUserRole] = useState(null)
  const dispatch = useDispatch()
  const { data: crfFormData } = useGetLibraryFormQuery(`${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/crf_configuration_forms`)
  const { data: subjectDetailWithSteps } = useGetSubjectDetailQuery(subjectMasterId);
  const orderedSteps = React.useMemo(() => {
    if (subjectDetailWithSteps) {
      const steps = _.sortBy(subjectDetailWithSteps.stepStatus, 'order');
      return steps;
    }
    return [];
  }, [subjectDetailWithSteps]);

  const crfStepStatus = React.useMemo(() => {
    if (subjectDetailWithSteps) {

      const steps = _.sortBy(subjectDetailWithSteps?.crfDetail?.stepStatus, 'order');
      return steps;
    }
    return [];
  }, [subjectDetailWithSteps]);

  const enrollmentStepStatus = React.useMemo(() => {
    if (subjectDetailWithSteps) {
      const steps = _.sortBy(subjectDetailWithSteps?.stepStatus, 'order');
      return steps;
    }
    return [];
  }, [subjectDetailWithSteps]);

  const openStepForm = (stepKey) => {
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/${stepKey}/${subjectMasterId}`)
  };

  const openCRFForm = (crfMasterId, stepKey) => {
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/${stepKey}/${subjectMasterId}/crf/${crfMasterId}`)
  };

  const buttonProperty = useMemo(() => {
    if (!subjectDetailWithSteps) {
      return null
    }
    const steps = orderedSteps;
    const userRole = getUserRole(loggedInUser, trialId, siteId);
    setUserRole(userRole)
    let buttonLabel = '';
    let actionClick = null;
    let disabled = false;
    let actionButtons = [];
    let enrollStepFound = false;
    for (let i = 0; i < steps?.length; i++) {
      const stepStatusData = steps[i];
      const userAccess = JSON.parse(stepStatusData.userAccess);
      const actions = userAccess.actions;
      if (stepStatusData.status === 'Pending') {
        enrollStepFound = true;
        const editAccess = userAccess.edit;
        const isAccess = typeof editAccess !== "string" ? _.find(editAccess, (access) => {
          return access == userRole;
        }) : editAccess === userRole
        if (isAccess) {
          buttonLabel = `Start ${stepStatusData.stepLabel}`;
          actionClick = () => {
            openStepForm(stepStatusData.stepKey)
          }
        }
        break;
      } else if (stepStatusData.status == 'Verification_Pending') {
        if (userRole === "PI") enrollStepFound = true;
        const verifyAccess = userAccess.verify;
        const isAccess = _.find(verifyAccess, (access) => {
          return access == userRole;
        })
        if (isAccess && !buttonLabel && !actionClick && !actions) {
          buttonLabel = `Verify ${stepStatusData.stepLabel}`;
          actionClick = () => {
            openStepForm(stepStatusData.stepKey)
          }
        }
        const buttons = [];
        if(actions && actions[userRole] && actions[userRole][stepStatusData.status]) {
          buttons.push({
                buttonLabel: actions[userRole][stepStatusData.status]['label'],
                actionClick: () => {
                  openStepForm(stepStatusData.stepKey)
                }
              })
        }
        // const pendingActions = _.filter(actions, (action) => {
        //   return _.includes(action.applicableStatus, stepStatusData.status);
        // });
        // const roleWisePendingActions = _.filter(pendingActions, (action) => {
        //   return _.includes(action.actionData?.role, userRole);
        // });
        // const buttons = _.map(roleWisePendingActions, (action) => {
        //   return {
        //     buttonLabel: action.label,
        //     actionClick: () => {
        //       openStepForm(stepStatusData.stepKey)
        //     }
        //   }
        // })
        actionButtons = [...actionButtons, ...buttons]
        if (isAccess) break;
      } else if (stepStatusData.status == 'Completed' || stepStatusData.status == 'External_Verification_Pending') {
        i === steps.length - 1
          ? (enrollStepFound = false)
          : (enrollStepFound = true);
        const buttons = [];
        if (actions && actions[userRole] && actions[userRole][stepStatusData.status]) {
          buttons.push({
            buttonLabel: actions[userRole][stepStatusData.status]['label'],
            actionClick: () => {
              openStepForm(stepStatusData.stepKey)
            }
          })
        }
        // const pendingActions = _.filter(actions, (action) => {
        //   return _.includes(action.applicableStatus, stepStatusData.status);
        // });
        // const roleWisePendingActions = _.filter(pendingActions, (action) => {
        //   return _.includes(action.actionData?.role, userRole);
        // });
        // const buttons = _.map(roleWisePendingActions, (action) => {
        //   return {
        //     buttonLabel: action.label,
        //     actionClick: () => {
        //       openStepForm(stepStatusData.stepKey)
        //     }
        //   }
        // })
        actionButtons = [...actionButtons, ...buttons]
      }
    }
    //if no step find
    if (!enrollStepFound) {
      for (let i = 0; i < crfStepStatus?.length; i++) {
        const stepStatusData = crfStepStatus[i];
        const userAccess = JSON.parse(stepStatusData.userAccess);
        const actions = userAccess.actions;
        if (stepStatusData.status === 'Pending') {
          const editAccess = userAccess.edit;
          const isAccess = typeof editAccess !== "string" ? _.find(editAccess, (access) => {
            return access == userRole;
          }) : editAccess === userRole
          if (isAccess) {
            buttonLabel = `Start ${stepStatusData.stepLabel}`;
            actionClick = () => {
              openCRFForm(subjectDetailWithSteps?.crfDetail?.id, stepStatusData.stepKey)
            }
          }
          break;
        } else if (stepStatusData.status == 'Verification_Pending') {
          const verifyAccess = userAccess.verify;
          const isAccess = _.find(verifyAccess, (access) => {
            return access == userRole;
          })
          if (isAccess) {
            buttonLabel = `Verify ${stepStatusData.stepLabel}`;
            actionClick = () => {
              openCRFForm(subjectDetailWithSteps?.crfDetail?.id, stepStatusData.stepKey)
            }
          } else {
            buttonLabel = `Waiting for Verification: ${stepStatusData.stepLabel}`;
            // disabled = true;
            actionClick = () => {
              openCRFForm(subjectDetailWithSteps?.crfDetail?.id, stepStatusData.stepKey)
            }
          }
          break;
        }
      }
    }
    return {
      buttonLabel,
      actionClick,
      disabled,
      actionButtons,
    }
  }, [orderedSteps]);

  const tableData = useMemo(() => {
    if (crfStepStatus && crfFormData) {
      let columns = [
        {
          key: "col1",
          label: "Visits",
          minWidth: 150,
          align: "left",
        },
      ];
      let rows = []
      if (view) {
        for (let i = 0; i < crfStepStatus.length; i++) {
          const stepData = _.find(crfFormData.steps, (step) => step.key === crfStepStatus[i].stepKey)
          crfStepStatus[i].sectionStatuses.forEach((section) => {
            let rowIndex = rows.findIndex((row) => row.key === section.sectionKey)
            const sectionData = _.find(stepData?.sections, (_section) => _section.key === section.sectionKey)
            let obj = {
              key: section.sectionKey,
              col1: section.sectionLabel,
              stepKey: crfStepStatus[i].stepKey,
              stepStatus: crfStepStatus[i].status,
              sectionLabel: section.sectionLabel,
              crfMasterId: crfStepStatus[i].crfMasterId,
              lableAbrivation: sectionData?.lableAbrivation
            }
            let status
            if (
              section.status === "Pending" &&
              section.subSectionStatuses.length !== 0
            ) {
              let incomplete = section?.subSectionStatuses.filter(
                (subSection) => subSection.status === "Pending"
              );
              status = `${section?.subSectionStatuses.length - incomplete.length
                }/${section?.subSectionStatuses.length}`;
            } else {
              status = section?.status;
            }

            if (rowIndex !== -1) {
              rows[rowIndex][crfStepStatus[i].stepKey] = status;
            } else {
              obj[crfStepStatus[i].stepKey] = status;
              rows.push(obj)
            }
          });
          columns.push({
            key: crfStepStatus[i].stepKey,
            label: crfStepStatus[i].stepLabel,
            minWidth: 100,
            align: "center",
          });
        }
        return { columns, rows };
      } else {
        for (let i = 0; i < crfStepStatus.length; i++) {
          const stepData = _.find(crfFormData.steps, (step) => step.key === crfStepStatus[i].stepKey)
          let row = {
            stepKey: crfStepStatus[i].stepKey,
            stepLabel: crfStepStatus[i].stepLabel,
            stepStatus: crfStepStatus[i].status,
            verificationRequired: crfStepStatus[i].verificationRequired,
            userAccess: crfStepStatus[i].userAccess,
            order: crfStepStatus[i].order,
            col1: crfStepStatus[i].stepLabel,
            crfMasterId: crfStepStatus[i].crfMasterId
          };
          crfStepStatus[i].sectionStatuses.forEach((section) => {
            if (!columns.some((col) => col.key === section.sectionKey)) {
              const sectionData = _.find(stepData?.sections, (_section) => _section.key === section.sectionKey)
              columns.push({
                key: section.sectionKey,
                parentKey: crfStepStatus[i].stepKey,
                label: sectionData?.lableAbrivation ? sectionData.lableAbrivation : section.sectionLabel,
                maxWidth: 100,
                align: "center",
              })
            }
            if (
              section.status === "Pending" &&
              section.subSectionStatuses.length !== 0
            ) {
              let incomplete = section?.subSectionStatuses.filter(
                (subSection) => subSection.status === "Pending"
              );
              row[section.sectionKey] = `${section?.subSectionStatuses.length - incomplete.length
                }/${section?.subSectionStatuses.length}`;
            } else {
              row[section.sectionKey] = section?.status;
            }
          });
          rows.push(row);
        }
        return { columns, rows };
      }
    }
  }, [crfStepStatus, view, crfFormData]);

  const handleVisitNavigate = (visitKey, crfMasterId, status) => {
    const userRole = getUserRole(loggedInUser, trialId, siteId);
    let enrollment = enrollmentStepStatus.find((step) => {
      return step.status === "Pending"
    })
    if (enrollment && enrollment?.length !== 0) {
      return dispatch(
        openMessage({
          message: "Complete subject enrollment process to proceed.",
          messageSeverity: "warning",
        })
      );
    }
    if (userRole === "site_monitor") {
      if (
        status === "External_Verification_Pending" ||
        status === "Completed"
      ) {
        navigate(
          `/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/crf/${crfMasterId}/${visitKey}`
        );
      } else {
        dispatch(
          openMessage({
            message: "Visit is pending.",
            messageSeverity: "warning",
          })
        );
      }
      return;
    } else if (status === "Pending") {
      let currentStep = crfStepStatus.find((step) => step.stepKey === visitKey);
      let orderedSteps = _.sortBy(crfStepStatus, "order");
      let previousStepStatus = false;
      _.forEach(orderedSteps, (step) => {
        if (currentStep.order > step.order && step.status === "Pending")
          previousStepStatus = true;
      });
      if (previousStepStatus) {
        dispatch(
          openMessage({
            message: "Complete previous visit.",
            messageSeverity: "warning",
          })
        );
      } else {
        navigate(
          `/eConcent/${trialId}/trial-site/${trialSiteId}/${visitKey}/${subjectMasterId}/crf/${crfMasterId}`
        );
      }
    } else if (
      status === "Completed" ||
      status === "External_Verification_Pending"
    ) {
      navigate(
        `/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/crf/${crfMasterId}/${visitKey}`,
        {}
      );
    } else if (status === "Withdrawal") {
      const _crfStepStatus = _.find(crfStepStatus, (step) => step.stepKey === visitKey)
      const isNotPending = (section) => {
        return section.status !== 'Pending' || (!_.isEmpty(section.subSectionStatuses) && _.some(section.subSectionStatuses, (subSection) => subSection.status !== 'Pending'));
      };
      const isAnyNotPending = _.some(_crfStepStatus.sectionStatuses, isNotPending);
      if (isAnyNotPending) {
        navigate(
          `/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/crf/${crfMasterId}/${visitKey}`,
          {}
        );
        dispatch(
          openMessage({
            message: "Subject Discontinued. Cannot Complete Visit.",
            messageSeverity: "warning",
          })
        );
      } else {
        dispatch(
          openMessage({
            message: "Subject Discontinued. Cannot Complete Visit.",
            messageSeverity: "warning",
          })
        );
      }
    } else {
      navigate(
        `/eConcent/${trialId}/trial-site/${trialSiteId}/${visitKey}/${subjectMasterId}/crf/${crfMasterId}`
      );
    }
  }

  const handleWithdrawNavigation = () => {
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/Subject_Withdrawal_Form/${subjectMasterId}/withdraw`)
  }
  return (
    <Grid container p={3} rowGap={2}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="text"
            onClick={() => navigate(-1)}
            startIcon={<RightArrow leftArrow />}
          >
            <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
              Back
            </Typography>
          </Button>
          <Box>
            {(userRole === "PI" || userRole === "site_coordinator") &&
              (!_.find(
                enrollmentStepStatus,
                (step) => step.status === "Pending"
              ) &&
                _.find(crfStepStatus, (step) => step.status === "Pending")) && (
                <CustomButton
                  variant="outlined"
                  style={{ marginRight: 15 }}
                  onClick={handleWithdrawNavigation}
                >
                  Withdraw
                </CustomButton>
              )}
            {_.map(buttonProperty?.actionButtons, (buttonData) => {
              return (
                <CustomButton
                  key={buttonData.buttonLabel}
                  variant="contained"
                  onClick={buttonData?.actionClick}
                  style={{ marginRight: 15 }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: "none" }}
                  >
                    {buttonData.buttonLabel}
                  </Typography>
                </CustomButton>
              );
            })}
            {buttonProperty?.buttonLabel && (
              <CustomButton
                variant="contained"
                onClick={buttonProperty?.actionClick}
                disabled={buttonProperty?.disabled}
              >
                <Typography variant="subtitle2" sx={{ textTransform: "none" }}>
                  {buttonProperty?.buttonLabel}
                </Typography>
              </CustomButton>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <SubjectDetailCRFInfo
          subjectStepStatusData={orderedSteps}
          stepStatusData={enrollmentStepStatus}
          visitStatusData={buttonProperty?.visitStatusData}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ marginTop: 5 }}>
          <VisitList
            columns={tableData?.columns}
            rows={tableData?.rows}
            view={view}
            setView={setView}
            handleVisitNavigate={handleVisitNavigate}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SubjectDetails;
