import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import { Tooltip, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetLibraryFormQuery } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import CustomButton from "../../components/@extended/CustomButton";
import { convertArrayToTitleCase, convertToTitleCase, getUserRole } from "../util";
import _ from 'lodash'

const SiteStatusStepper = () => {
  const theme = useTheme();
  let { trialId, trialSiteId, siteInitStep } = useParams();
  const trialSiteDetail = useSelector((state) => state.trial.trialSiteDetail);
  const loggedInUser = useSelector((state) => state.auth.user);
  // const { data: dynamicForm } = useGetLibraryFormQuery(
  //   "bloqcube/metastatic-melanoma-site-init"
  // );
  // if (dynamicForm) console.log(dynamicForm);
  const navigate = useNavigate();
  const openStepForm = (stepKey) => {
    navigate(`/trial/${trialId}/trial-site/${trialSiteId}/${stepKey}`);
  };

  const orderedSteps = React.useMemo(() => {
    if (trialSiteDetail) {
      const steps = _.sortBy(trialSiteDetail?.siteTrialData?.siteInitiationMaster?.stepStatus, 'order');
      return steps;
    }
    return [];
  }, [trialSiteDetail]);

  const getStepTooltip = (stepKey) => {
    const step = _.find(orderedSteps, (_step) => _step.stepKey === stepKey);
    const userAccess = JSON.parse(step?.userAccess);
    let tooltipMessage = "";
    for (const [action, users] of Object.entries(userAccess)) {
      const usersTitleCase = convertArrayToTitleCase(users);
      if (users.length > 0) {
        tooltipMessage += `${usersTitleCase.join(", ")} can ${convertToTitleCase(action)}.\n`;
      }
    }
    tooltipMessage = tooltipMessage.trim();
    return tooltipMessage
  }

  const buttonProperty = React.useMemo(() => {
    if(!trialSiteDetail){
      return {}
    }
    const steps = orderedSteps;
    const userRole = getUserRole(loggedInUser,trialId,trialSiteDetail.siteTrialData.site.id);
    let buttonLabel = '';
    let actionClick = null;
    for (let i = 0; i < steps?.length; i++) {
      const stepStatusData = steps[i];
      const userAccess = JSON.parse(stepStatusData.userAccess);
      if (stepStatusData.status == 'Pending') {
        const editAccess = userAccess.edit;
       const isAccess =  _.find(editAccess,(access) => {
          return access == userRole;
        })
        if(isAccess){
          buttonLabel = `Start ${stepStatusData.stepLabel}`;
          actionClick = () => {
            openStepForm(stepStatusData.stepKey)
          }
        }
       
        break;
      } else if (stepStatusData.status == 'Verification_Pending') {
        const verifyAccess = userAccess.verify;
        const isAccess =  _.find(verifyAccess,(access) => {
          return access == userRole;
        })
        if(isAccess){
          buttonLabel = `Verify ${stepStatusData.stepLabel}`;
          actionClick = () => {
            openStepForm(stepStatusData.stepKey)
          }
        }
       
        break;
      }

    }

    return {
      buttonLabel,
      actionClick
    }
  }, [orderedSteps]);

  return (
    <Box sx={{ width: "100%", paddingTop: 5 }}>
      <Stepper
        activeStep={1}
        alternativeLabel
        sx={{
          "& .MuiStepConnector-root": {
            top: "9px",
            left: "calc(-50% + 12px)",
            right: "calc(50% + 12px)",
          },
          "& .MuiStepConnector-line": {
            borderRadius: 1,
            borderWidth: 6,
          },
          "& .MuiStepLabel-iconContainer": {
            height: "0.7rem",
            width: "0.7rem",
            border: `7px solid ${theme.palette.grey[500]}`,
            borderRadius: "50%",
          },
          "& .Mui-completed": {
            "& .MuiStepConnector-line": {
              borderRadius: 1,
              borderColor: theme.palette.primary.light,
              borderWidth: 6,
            },
            "& .MuiStepLabel-iconContainer": {
              backgroundColor: theme.palette.common.white,
              border: "7px solid green",
            },
          },
        }}
      >
        <Step completed={true}>
          <StepButton color="inherit" icon={<Box></Box>}>
            Clinical Trial Setup
          </StepButton>
        </Step>
        {orderedSteps?.map((step, index) => (
          <Step key={step.stepKey} completed={step.status !== "Pending"}>
            <Tooltip title={getStepTooltip(step.stepKey)} placement="top" arrow>
              <Box>
                <StepButton
                  color="inherit"
                  disabled={step.status == "Pending"}
                  onClick={() => {
                    openStepForm(step.stepKey);
                  }}
                  icon={<Box></Box>}
                >
                  {step.stepLabel}
                </StepButton>
              </Box>
            </Tooltip>
          </Step>
        ))}
      </Stepper>
      {
        buttonProperty?.actionClick &&<Box sx={{width:'100%', pt:4, display:'flex', justifyContent:'flex-end'}}> <CustomButton onClick={buttonProperty?.actionClick}>
          {buttonProperty.buttonLabel}
        </CustomButton></Box>
      }
    </Box>
  );
};

export default SiteStatusStepper;
