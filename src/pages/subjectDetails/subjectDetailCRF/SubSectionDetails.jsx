import { Grid, Typography } from "@mui/material";
import CategoryDetails from "./CategoryDetails";
import FieldDetails from "./FieldDetails";
import FieldList from "./FieldList";
import { SKIPPED_FIELDS_KEY } from "../../../util/constants";

const SubSectionDetails = (props) => {
    const { details, answers } = props;
    return (<>
        <Typography variant="h6" sx={{ paddingY: 2 }}>{details.label}</Typography>
        <Grid container spacing={3}>
            {details && details.categories &&
                details.categories.map((category, index) => (
                    (
                        !SKIPPED_FIELDS_KEY.includes(category.key) && (category.showInReadOnly == undefined || category.showInReadOnly) && 
                        <Grid key={category.label+index} item md={12} sm={12}>
                            <CategoryDetails  {...props}
                                details={category} subSectionKey={details.key}
                            /></Grid>
                    )
                ))}
            {details && details.fields &&
                <FieldList {...props} fieldArr={details.fields} subSectionKey={details.key}/>}
        </Grid>
    </>)
}

export default SubSectionDetails;