import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import DynamicStepper from "./FormEntity/DynamicStepper";
import DynamicForm from "./FormEntity/DynamicForm";
import StyledTabs from "../../components/@extended/StyledTabs";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { getUserRole } from "../util";

const SectionStatus = ({ sectionKey, sectionStatus }) => {
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);
  const { trialId } = useParams()
  const userRole = getUserRole(user, trialId);
  const status = useMemo(() => {
    if (sectionStatus) {
      let section = sectionStatus?.find((section) => section.sectionKey === sectionKey);
      if (section?.status === "Pending" || section?.status === "Verification_Pending") {
        if (section?.subSectionStatuses.length !== 0) {
          let incomplete = section?.subSectionStatuses.filter((subSection) => subSection.status === "Pending")
          return <Typography variant="body2" pl={1} color={theme.palette.grey[600]}>{`${section?.subSectionStatuses.length-incomplete.length}/${section?.subSectionStatuses.length}`}</Typography>
        } 
        if ((userRole === "site_admin" || userRole === "site_coordinator") && section?.status === "Verification_Pending") {
          return (
            <CheckCircleOutlineRoundedIcon
              sx={{ color: theme.palette.success.light, fontSize: 20, ml: 1 }}
            />
          );
        }
      } else {
        return (
          <CheckCircleOutlineRoundedIcon 
            sx={{ color: theme.palette.success.light,fontSize:20, ml:1 }}
          />
        );
      }
    }
  }, [sectionStatus]);
  return <>{status}</>;
}

const DynamicFormEngine = (props) => {
  const {
    formConfig,
    AddNewField,
    handleSave,
    hideTab,
    handleSaveSignature,
    handleDownloadSignature,
    formAnswers,
    stepStatusData
  } = props;
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const navigateToNextTab = () => {
    const nextTabInd = activeTab + 1;
    if(formConfig.sections && formConfig.sections.length > nextTabInd) {
        setActiveTab(nextTabInd)
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    } else if(formConfig.sections && formConfig.sections.length == nextTabInd) {
        navigate(-1)
    }
  }
  return (
    <>
      {formConfig === null && (
        <Box
          sx={{
            height: 400,
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="error">
            Unable to get Dynamic form
          </Typography>
        </Box>
      )}
      {formConfig && formConfig.sections && (
        <>
          <StyledTabs
            style={{ display: hideTab && "none" }}
            value={activeTab}
            onChange={(_, newTab) => setActiveTab(newTab)}
            indicatorColor="primary"
            textColor="primary"
            variant={formConfig.sections.length >= 2 ? "fullWidth":"standard"}
          >
            {formConfig &&
              formConfig.sections.map((tab, index) => (
                <Tab key={tab.key} label={tab.label} icon={<SectionStatus sectionStatus={ stepStatusData?.sectionStatuses} sectionKey={tab.key} />} iconPosition="end"/>
              ))}
          </StyledTabs>
          {formConfig &&
            formConfig.sections &&
            formConfig.sections.map((tab, index) => {
              let subTabStatus = stepStatusData?.sectionStatuses?.find((section) => section.sectionKey === tab.key)
             return <Box
                key={`${tab.key}child`}
                role="tabpanel"
                hidden={activeTab !== index}
              >
                {activeTab === index && tab.subTabs && (
                  <DynamicStepper
                    _config={tab.subTabs}
                    sectionKey={tab.key}
                    AddNewField={AddNewField}
                    handleSave={handleSave}
                    navigateToNextTab={navigateToNextTab}
                    handleSaveSignature={handleSaveSignature}
                    handleDownloadSignature={handleDownloadSignature}
                    formAnswers={formAnswers}
                    sectionsLength={formConfig?.sections?.length}
                    sectionIndex={index + 1}
                    subTabStatus={subTabStatus?.subSectionStatuses}
                    {...props}
                  />
                )}
                {activeTab === index && (tab.categories || tab.fields) && (
                  <DynamicForm
                    _config={tab}
                    sectionKey={tab.key}
                    subSectionKey={""}
                    AddNewField={AddNewField}
                    handleSave={handleSave}
                    navigateToNextTab={navigateToNextTab}
                    handleSaveSignature={handleSaveSignature}
                    handleDownloadSignature={handleDownloadSignature}
                    formAnswers={formAnswers}
                    sectionsLength={formConfig?.sections?.length}
                    sectionIndex={index + 1}
                    {...props}
                  />
                )}
              </Box>
})}
        </>
      )}
      {formConfig && (formConfig.categories || formConfig.fields) && (
        <DynamicForm
          _config={formConfig}
          sectionKey={""}
          subSectionKey={""}
          handleSave={handleSave}
          handleSaveSignature={handleSaveSignature}
          handleDownloadSignature={handleDownloadSignature}
          {...props}
        />
      )}
    </>
  );
};

export default DynamicFormEngine;
