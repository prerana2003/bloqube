import { Typography } from "@mui/material";
import SectionDetails from "./SectionDetails";
import { useState } from "react";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));
const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const StepDetails = (props) => {
    const { details } = props;
    const [expanded, setExpanded] = useState(false);
    return (<>
        {/* <Typography variant="h5" sx={{marginTop:2}}>{details.label}</Typography>
        {details &&
                details.sections.map((section, index) => (
                   ((section.showInReadOnly == undefined || section.showInReadOnly) && <SectionDetails key={section.label} {...props} 
                        details={section} stepKey={details.key}
                    />)
                ))} */}
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary>
                <Typography>{details.label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {details &&
                    details.sections.map((section, index) => (
                        ((section.showInReadOnly == undefined || section.showInReadOnly) && <SectionDetails fromSubject={true} key={section.label} {...props}
                            details={section} stepKey={details.key}
                        />)
                    ))}
            </AccordionDetails>
        </Accordion>
    </>)
}

export default StepDetails;