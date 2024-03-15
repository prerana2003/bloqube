import { Box, Divider, Typography } from "@mui/material";
import DynamicFields from "./DynamicFields";
import CustomButton from "../../../components/@extended/CustomButton";
import { useResponsive } from "../../../hooks/ResponsiveProvider";

const DynamicCategory = (props) => {
  const {isSmallScreen} = useResponsive();
  const { _config, handleAddNewField } = props;
  
  return (
    <>
      {_config.map((category, index) =>
        category.key === "divider" ? (
          <Box key={`asd${index}`}>
            <Divider />
          </Box>
        ) : (
          (!category.access || (category.access && (category.access == props.userSiteTrialRole || category.access.includes(props.userSiteTrialRole)))) && <Box key={`asd${index}`}>
            {category.label && <Box sx={{ padding: isSmallScreen?1:3, paddingBottom: 1 }}>
              <Typography variant="h5">{category.label}</Typography>
              </Box>}
              {category.helperLabel && <Box sx={{ padding: 3, paddingBottom: 2, paddingTop:0 }}>
              <Typography variant="subtitle2">{category.helperLabel}</Typography>
            </Box>}
            <DynamicFields
              {...props}
              _config={category.fields}
              parentKey={category.key}
            />
            {category.addNew && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", pb: 2 }}>
                <CustomButton
                  variant="outlined"
                  onClick={() => {
                    handleAddNewField(category.key,{subSectionKey:props.subSectionKey,sectionKey:props.sectionKey,categoryKey:category.key}, props.values);
                  }}
                >
                  Add New
                </CustomButton>
              </Box>
              )}
               <Divider />
            </Box>
        )
      )}
    </>
  );
};

export default DynamicCategory;
