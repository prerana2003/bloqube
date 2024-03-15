import { Grid, Typography } from "@mui/material";
import CategoryDetails from "./CategoryDetails";
import FieldDetails from "./FieldDetails";
import SubSectionDetails from "./SubSectionDetails";
import { SKIPPED_FIELDS_KEY } from "../../../util/constants";
import FieldList from "./FieldList";
import MuiAccordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useState } from "react";

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
const SectionDetails = (props) => {
    const { details, fromSubject } = props;
    const {isSmallScreen} = useResponsive();
    const [expanded, setExpanded] = useState(false);
    return (<>
        {
            !fromSubject ?
                <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                    <AccordionSummary>
                        <Typography>{details.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Grid container spacing={3}>
                            {details && details.subTabs &&
                                details.subTabs.map((subTab, index) => (
                                    (
                                        !SKIPPED_FIELDS_KEY.includes(subTab.key) && (subTab.showInReadOnly == undefined || subTab.showInReadOnly) &&
                                        <Grid key={subTab.label + index} item md={12} sm={12}>
                                            <SubSectionDetails  {...props}
                                                details={subTab} sectionKey={details.key}
                                            />
                                        </Grid>
                                    )
                                ))}
                            {details && details.categories &&
                                details.categories.map((category, index) => (
                                    (
                                        !SKIPPED_FIELDS_KEY.includes(category.key) && (category.showInReadOnly == undefined || category.showInReadOnly) &&
                                        <Grid key={category.label + index} item md={12} sm={12}>
                                            <CategoryDetails  {...props}
                                                details={category} sectionKey={details.key}
                                            />
                                        </Grid>
                                    )
                                ))}
                            {details && details.fields &&
                                <FieldList {...props} fieldArr={details.fields} sectionKey={details.key} />}
                        </Grid>
                    </AccordionDetails></Accordion> :
                    <><Typography sx={{ paddingY: isSmallScreen?1:2, fontWeight: 600 }}>{details.label}</Typography>
                        <Grid container spacing={3}>
                            {details && details.subTabs &&
                                details.subTabs.map((subTab, index) => (
                                    (
                                        !SKIPPED_FIELDS_KEY.includes(subTab.key) && (subTab.showInReadOnly == undefined || subTab.showInReadOnly) &&
                                        <Grid key={subTab.label + index} item md={12} sm={12}>
                                            <SubSectionDetails  {...props}
                                                details={subTab} sectionKey={details.key}
                                            />
                                        </Grid>
                                    )
                                ))}
                            {details && details.categories &&
                                details.categories.map((category, index) => (
                                    (
                                        !SKIPPED_FIELDS_KEY.includes(category.key) && (category.showInReadOnly == undefined || category.showInReadOnly) &&
                                        <Grid key={category.label + index} item md={12} sm={12}>
                                            <CategoryDetails  {...props}
                                                details={category} sectionKey={details.key}
                                            />
                                        </Grid>
                                    )
                                ))}
                            {details && details.fields &&
                                <FieldList {...props} fieldArr={details.fields} sectionKey={details.key} />}
                        </Grid></>
        }

                </>)
}

        export default SectionDetails;