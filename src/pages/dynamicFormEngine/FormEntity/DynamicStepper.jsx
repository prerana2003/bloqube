import { Box, Step, StepButton, StepLabel, Stepper, makeStyles, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DynamicForm from "./DynamicForm";

function DynamicStepper(props) {
    const { _config, sectionKey, AddNewField, navigateToNextTab,subTabStatus } = props;
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const handleStep = (step) => () => {
        setActiveStep(step);
    };
    const navigateToNextSubTab = () => {
        const nextTabInd = activeStep + 1;
        if (_config && _config.length > nextTabInd) {
            setActiveStep(nextTabInd)
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        } else if (_config && _config.length == nextTabInd) {
            navigateToNextTab()
        }
    }
    return (
        <React.Fragment>
            <Box sx={{ display: "flex", width: "100%", justifyContent: "left" }}>
                <Box
                    sx={{
                        width: "30%",
                        padding: 3,
                        pl: 2
                    }}
                >
                    <Stepper nonLinear orientation="vertical" activeStep={activeStep}
                        sx={{
                            "& .MuiStepConnector-root": {
                                left: "calc(-50% + 12px)",
                                right: "calc(50% + 12px)",
                            },
                            "& .MuiStepConnector-line": {
                                borderWidth: 6,
                                minHeight: 40
                            },
                            "& .MuiStepLabel-vertical": {
                                py: 0
                            },
                            "& .MuiStepLabel-iconContainer": {
                                ml: 0.30,
                                height: "0.7rem",
                                width: "0.2rem",
                                border: `7px solid ${theme.palette.grey[500]}`,
                                borderRadius: "50%",
                            },
                            "& .MuiStepLabel-labelContainer": {
                                paddingLeft: 1,
                                "& .MuiStepLabel-label": {
                                    fontSize: 16,
                                    fontWeight: 600
                                }
                            },
                            "& .Mui-completed": {
                                "& .MuiStepConnector-line": {
                                    borderColor: theme.palette.primary.light,
                                    borderWidth: 6,
                                },
                                "& .MuiStepLabel-iconContainer": {
                                    backgroundColor: theme.palette.common.white,
                                    border: "7px solid green",
                                },
                            },
                        }}>
                        {_config &&
                            _config.map((_step, ind) => {
                                let status = subTabStatus?.find((subSection) => subSection.subSectionKey === _step.key)
                               return <Step key={_step.key} completed={status?.status==="Completed"||status.status == 'External_Verification_Pending'}>
                                    <StepButton
                                        color="inherit"
                                        // disabled={_step.status == "Pending"}
                                        onClick={handleStep(ind)}
                                        icon={<Box></Box>}
                                    >
                                        <StepLabel sx={{ paddingx: 3 }}>{_step.label}</StepLabel>
                                    </StepButton>
                                    {/* <StepLabel>{_step.label}</StepLabel> */}
                                </Step>
                            })}
                    </Stepper>
                </Box>
                <Box sx={{ width: "70%" }}>
                    {_config &&
                        _config.map((tab, index) => (
                            activeStep === index && (tab.categories || tab.fields) && (
                                <Box key={`step${index}`}><DynamicForm
                                    {...props}
                                    _config={tab}
                                    sectionKey={sectionKey}
                                    subSectionKey={tab.key}
                                    navigateToNextTab={navigateToNextSubTab}
                                /></Box>
                            )
                        ))}
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default React.memo(DynamicStepper);
;
