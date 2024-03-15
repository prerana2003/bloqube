import {
    Grid,
    Typography,
    useTheme,
    Divider,
  } from "@mui/material";
  import React, { useEffect } from "react";
  import CustomButton from "../../components/@extended/CustomButton";
  import { useNavigate } from "react-router-dom";
  import { useGetTrialsMutation } from "../../store/slices/apiSlice";
  import DraftTrialsTable from "./DraftTrialsTable";
  import OnGoingTrialsTable from "./OnGoingTrials"
import { useSelector } from "react-redux";
import { getUserRole } from "../util";
  
  
  const SiteAdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.auth.user);
    const [getTrials, { data }] = useGetTrialsMutation();

    const userRole = getUserRole(loggedInUser);
  
    return (
      <Grid container rowSpacing={4.5}>
        <Grid item sm={12} sx={{ paddingTop: 8 }}>
         <OnGoingTrialsTable />
        </Grid>
        {
          ( userRole == 'PI' || userRole == 'site_admin' ) && 
          <Grid item sm={12} sx={{ paddingTop: 8 }}>
         <Divider sx={{ borderBottom: `2px solid ${theme.palette.grey[400]}`, borderRadius:5 }} />
          <DraftTrialsTable />
        </Grid>
        }
      </Grid>
    );
  };
  
  export default SiteAdminDashboard;
  