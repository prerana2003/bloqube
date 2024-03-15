import React from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Box,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import Label from "../../components/common/Label";

const TrialDetailCard = () => {
  const theme = useTheme();
  const trialDetail = useSelector((state) => state.trial.currentTrial);
  const trialSites = useSelector((state) => state.trial.currentTrialSites);
  return (
    <CustomCard title="Trial Details">
      <CardContent>
        <Grid container>
        <Grid item md={12} sm={12}>
            <Box
              sx={{
                display: "flex",
                pb: 1.5,
                paddingRight: 2,
                width:"100%"
              }}
            >
              <Label sx={{width:"13%",paddingRight: 0}}>Trial Title :</Label>
              <Typography
                variant="subtitle2"
                color="initial"
                sx={{
                  width: "82%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {trialDetail?.trialTitle}
              </Typography>
            </Box>
            <Divider />
          </Grid>
          <Grid item md={6} sm={12}>
            <Box sx={{ display: "flex", py: 1.5 }}>
              <Label>Protocol Number :</Label>
              <Typography variant="subtitle2" color="initial">
                {trialDetail?.protocolNumber}
              </Typography>
            </Box>
            <Divider />
          </Grid>
          <Grid item md={6} sm={12}>
            <Box
              sx={{
                display: "flex",
                py: 1.5,
                [theme.breakpoints.down("md")]: {
                  pt: 1.5,
                },
              }}
            >
              <Label>Total Number of subjects :</Label>
              <Typography variant="subtitle2" color="initial">
                {trialDetail?.totalSubjectNumber}
              </Typography>
            </Box>
            <Divider />
          </Grid>
          <Grid item md={6} sm={12}>
            <Box sx={{ display: "flex", py: 1.5 }}>
              <Label>Number of Sites :</Label>
              <Typography variant="subtitle2" color="initial">
                {trialSites?.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6} sm={12}>
            <Box sx={{ display: "flex", pt: 1.5, alignItems: "center" }}>
              <Label>Trial Payment Account Status :</Label>
              <Typography
                variant="subtitle2"
                color="initial"
              >
                --
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </CustomCard>
  );
};

export default TrialDetailCard;
