import { Box, Grid, IconButton, Typography } from "@mui/material";
import CategoryDetails from "./CategoryDetails";
import FieldDetails from "./FieldDetails";
import FieldList from "./FieldList";
import { SKIPPED_FIELDS_KEY } from "../../../util/constants";
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from "react-redux";
import CustomButton from "../../../components/@extended/CustomButton";
import { useResponsive } from "../../../hooks/ResponsiveProvider";

const FormDetails = (props) => {
    const {isSmallScreen} = useResponsive();
    const { details, answers, sectionKey, subSectionKey, stepKey, openStepForm, editAllowed, formStatus,userSiteTrialRole ,readOnlyActions,verifyAction} = props;
    return (<>
        {details && <><Box sx={{ backgroundColor: '#FFF5E6', paddingX: isSmallScreen?1:2,display:'flex',justifyContent:'space-between' }}>
            <Typography variant="h6" sx={{ paddingY: isSmallScreen?1:2 }}>{details.label}</Typography>
            {editAllowed && <IconButton onClick={() => openStepForm(details.key)}><EditIcon/></IconButton>}
        </Box>

            <Box sx={{ padding: isSmallScreen?1:2 }}>
                {details && details.categories &&
                    details.categories.map((category, index) => (
                        (
                            !SKIPPED_FIELDS_KEY.includes(category.key) && (category.showInReadOnly == undefined || category.showInReadOnly) &&
                            <CategoryDetails key={category.key}  {...props}
                                details={category} sectionKey={sectionKey} subSectionKey={subSectionKey} stepKey={stepKey}
                            />
                        )
                    ))}
                {details && details.fields &&
                    <FieldList {...props} fieldArr={details.fields} subSectionKey={details.key} />}
            </Box>
            <Box sx={{display:'flex', justifyContent:'flex-end',padding: isSmallScreen?1:2, pr:0}}>
                {
                    readOnlyActions && readOnlyActions.map((actions) => (
                        actions?.applicableStatus.includes(formStatus) && actions?.actionData?.role.includes(userSiteTrialRole) && <CustomButton sx={{mr:2}} onClick={()=>{verifyAction({stepKey,sectionKey,subSectionKey,answers})}}>{actions?.label}</CustomButton>
                ))
                }
            </Box>
        </>}
    </>)
}

// 


export default FormDetails;