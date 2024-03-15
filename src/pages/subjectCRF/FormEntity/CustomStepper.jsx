import { Box, Step, StepButton, Stepper } from "@mui/material";
import React, { useState } from "react";
import CustomForm from "./CustomForm";
import { useParams } from "react-router-dom";

function CustomStepper({ _config, sectionKey }) {
    let { siteInitStep } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const _renderStepContent = (activeStep) => {
        return _config[activeStep];
    }
    const handleStep = (step) => () => {
        setActiveStep(step);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
                    <Stepper nonLinear orientation="vertical" activeStep={activeStep}>
                        {_config && _config.map((_step, ind) => (
                            <Step key={_step.key}>
                                <StepButton color="inherit" onClick={handleStep(ind)}>
                                    {_step.label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{ width: '70%' }}>
                    <CustomForm _config={_renderStepContent(activeStep)} 
                    sectionKey={sectionKey}
                    subSectionKey={_config[activeStep].key}/>
                </Box>

            </Box>
        </React.Fragment>
    )
}

export default CustomStepper;