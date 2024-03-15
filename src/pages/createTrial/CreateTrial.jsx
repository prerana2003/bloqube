import { Box, Tab, Tabs, Typography, useTheme,Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BasicDetailsTab from "./basicDetails/BasicDetailsTab";
import SiteDetailsTab from "./siteDetails/SiteDetailsTab";
import SummaryTab from "./summary/SummaryTab";
import RightArrow from "../../components/icons/RightArrow";
import StyledTabs from "../../components/@extended/StyledTabs";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const CreateTrial = () => {
  const navigate = useNavigate();
  let { tabId } = useParams();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [validTab1, setValidTab1] = useState(false);
  const [validTab2, setValidTab2] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          flex: "grow",
          display: "flex",
          height: 70,
        }}
      >
        <Button
          style={{ position: "absolute", top: 12 }}
          onClick={() => navigate(-1)}
          startIcon={<RightArrow leftArrow />}
        >
          <Typography
            variant="subtitle1"
            sx={{ textTransform: "none" }}
            color={theme.palette.primary.light}
          >
            Dashboard
          </Typography>
        </Button>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="initial" ml={"auto"} mr={"auto"}>
            Clinical Trial Set-up
          </Typography>
        </Box>
      </Box>
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          top: 2,
        }}
      >
        <Tab label="1. Basic Details" {...a11yProps(0)} />
        <Tab label="2. Site Details" {...a11yProps(1)} />
        <Tab
          label="3. Summary"
          {...a11yProps(2)}
          disabled={validTab1 && validTab2 ? false : true}
        />
      </StyledTabs>
      <TabPanel value={tabValue} index={0}>
        <BasicDetailsTab
          handleTabChange={handleTabChange}
          isValidTab={setValidTab1}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SiteDetailsTab
          handleTabChange={handleTabChange}
          isValidTab={setValidTab2}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <SummaryTab handleTabChange={handleTabChange} />
      </TabPanel>
    </>
  );
};

export default CreateTrial;
