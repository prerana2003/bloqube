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

const SponsorDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [getTrials, { data }] = useGetTrialsMutation();

  return (
    <Grid container rowSpacing={1.5}>
      <Grid item sm={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CustomButton
          variant="contained"
          onClick={() => navigate("/createTrial")}
        >
          <Typography variant="subtitle1" color={theme.palette.common.white}>
            + Create New Trial
          </Typography>
        </CustomButton>
      </Grid>
      <Grid item sm={12} sx={{ paddingTop: 8 }}>
        <OnGoingTrialsTable />
      </Grid>
      <Grid item sm={12} sx={{ paddingTop: 8 }}>
         <Divider sx={{ borderBottom: `2px solid ${theme.palette.grey[400]}`, borderRadius:5 }} />
        <DraftTrialsTable />
      </Grid>
    </Grid>
  );
};

export default SponsorDashboard;
