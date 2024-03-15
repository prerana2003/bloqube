import { Grid, Typography, useTheme } from "@mui/material";
import FieldDetails from "./FieldDetails";
import CustomCard from "../../../components/@extended/CustomCard";
import { SKIPPED_FIELDS_KEY } from "../../../util/constants";

const FieldList = (props) => {
    const { fieldArr, parentKey, answers, userSiteTrialRole } = props;
    const theme = useTheme();
    const INVALID_FIELDS = [ 'DATA_HTML', 'FILE_UPLOAD', 'BUTTON'];
    const VALID_FIELDS = ['INLINE_TEXT_FIELD', 'DROP_DOWN', 'RADIO_BUTTONS', 'CHECK_BOX', 'SLIDER', 'PHONE_INPUT', 'LABEL', 'FILE_UPLOAD',"SIGNATURE",'DATA_LABEL']
    return (<>
        {answers && fieldArr &&
            fieldArr.map((field, index) => (
                VALID_FIELDS.includes(field.type) && !SKIPPED_FIELDS_KEY.includes(field.key) && (!field.access || (field.access && field.access == userSiteTrialRole)) &&
                (<Grid item md={(field.textFontWeight || field.tableRow) ? field.md : 6} lg={(field.textFontWeight || field.tableRow) ? field.lg : 6} sm={6} xs={12} key={`field${index}`} sx={{ borderBottom: '1px solid #E7E7E7', paddingY: '16px !important' }}>
                    <FieldDetails {...props} key={field.label} 
                        allAnswers={answers[parentKey] ? answers[parentKey] : answers}  
                        signDate={answers[parentKey] ? answers[parentKey][field.currentDateKey] : answers[field.currentDateKey]}
                        details={field} 
                        answer={answers[parentKey] ? answers[parentKey][field.key] : answers[field.key]}
                    />
                    {field.fields && <Grid container spacing={2} sx={{ marginTop: 1 }}>
                        {
                            field.fields.map((childField, childIndex) => (
                                VALID_FIELDS.includes(field.type) && !SKIPPED_FIELDS_KEY.includes(field.key) &&
                                (!childField.access || (childField.access && childField.access == userSiteTrialRole))
                                && <Grid key={parentKey ? `${parentKey}.${childIndex}.${index}` : `aa${childIndex}${index}`}
                                    item md={12} sm={12} xs={12}>
                                    <FieldDetails {...props} key={childField.label} 
                                        allAnswers={answers[parentKey] ? answers[parentKey] : answers} 
                                        signDate={answers[parentKey] ? answers[parentKey][childField.currentDateKey] : answers[childField.currentDateKey]}
                                        details={childField} 
                                        answer={answers[parentKey] ? answers[parentKey][childField.key] : answers[childField.key]}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>}
                </Grid>)
            ))}
    </>)
}
export default FieldList;