import React, { useEffect, useMemo } from "react";
import { Button, Grid, Typography,  Box } from "@mui/material";
import {  useNavigate, useParams } from "react-router-dom";
import CustomCard from "../../components/@extended/CustomCard";
import TrialDetailCard from "./TrialDetailCard";
import StudyDetailsCard from "./StudyDetailsCard";
import SiteDetailsCard from "./SiteDetailsCard";
import TrialBudgetCard from "./TrialBudgetCard";
import TrialCurrentExpenditureCard from "./TrialCurrentExpenditure";
import { useDispatch, useSelector } from "react-redux";
import RightArrow from "../../components/icons/RightArrow";
import { bloqcibeApi } from "../../store/slices/apiSlice";
import _ from 'lodash'
import DocumentsList from "../../components/common/DocumentsList";
import { calculateSiteCostWithVariableAndFixed, calculateTrialCost } from "../util";

const TrialDetails = () => {
  const navigate = useNavigate();
  let { trialId } = useParams();
  const dispatch = useDispatch();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const loggedInUser = useSelector((state) => state.auth.user);
  const [getTrialDetails, { data: trialDetails }] =
    bloqcibeApi.endpoints.getTrialDetails.useLazyQuery();
  const [getTrialSiteDetails, { data: trialSiteData }] =
    bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
  // const { data: trialDetails } = useGetTrialDetailsQuery({
  //   id: trialId,
  //   sponsorId: sponsorId,
  // });
  useEffect(() => {
    (async () => {
      if (trialId) {
        await getTrialDetails({
          id: trialId,
          sponsorId: sponsorId,
        });
        await getTrialSiteDetails({ trialId, sponsorId });
      }
    })();
  }, [dispatch]);

  const currentUserRoleOfTrailSite = useMemo(() => {
    if (trialDetails) {
      const users = trialDetails.trialUsers;
      const logginUserEmail = loggedInUser.email;
      const userObject = _.find(users, (user) => {
        return user.user.email?.toLowerCase() == logginUserEmail?.toLowerCase();
      })

      if (userObject) {
        return userObject.role;
      }

      return "sponsor";

    }

  }, [trialDetails]);

  const pageSize = useMemo(() => {
    if (currentUserRoleOfTrailSite == 'site_admin' ||
      currentUserRoleOfTrailSite == 'sponsor' || 
      currentUserRoleOfTrailSite == 'site_monitor') {
      return 7;
    }
    return 12;
  }, [currentUserRoleOfTrailSite]);


  return (
    <Grid container p={3} rowGap={2}>
      <Grid item xs={12}>
        <Button
          type="text"
          onClick={() => navigate(-1)}
          startIcon={<RightArrow leftArrow />}
        >
          <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
            Back to Dashboard
          </Typography>
        </Button>
        <Typography variant="h2"></Typography>
      </Grid>
      <Grid container direction={"row"} columnSpacing={3}>
        <Grid item sm={12} md={pageSize}>
          <Box sx={{ pb: 3 }}>
            <TrialDetailCard />
          </Box>
          <Box sx={{ pb: 3 }}>
            <StudyDetailsCard />
          </Box>
          <Box sx={{ pb: 3 }}>
            <SiteDetailsCard trialId={trialId} sponsorId={sponsorId} />
          </Box>
          {(currentUserRoleOfTrailSite == "sponsor" ||
            currentUserRoleOfTrailSite == "site_monitor") && (
            <Box sx={{ pb: 3 }}>
              <CustomCard title="eTMF Documents">
                <DocumentsList trialId={trialId} sponsorId={sponsorId} />
              </CustomCard>
            </Box>
          )}
        </Grid>
        {(currentUserRoleOfTrailSite == "site_admin" ||
          currentUserRoleOfTrailSite == "sponsor" ||
          currentUserRoleOfTrailSite == "site_monitor") && (
          <Grid item xs={12} sm={12} md={5}>
            <Box sx={{ pb: 3 }}>
              {currentUserRoleOfTrailSite === "site_admin" && (
                <TrialBudgetCard
                  details={trialSiteData}
                  calculateFunction={calculateSiteCostWithVariableAndFixed}
                  title={"Site's Budget"}
                />
              )}
              {(currentUserRoleOfTrailSite == "site_monitor" ||
                currentUserRoleOfTrailSite == "sponsor") && (
                <TrialBudgetCard
                  details={trialDetails.trialData}
                  calculateFunction={calculateTrialCost}
                  title={"Trial Budget"}
                />
              )}
            </Box>
            <Box sx={{ pb: 3 }}>
              {currentUserRoleOfTrailSite === "site_admin" && (
                <TrialCurrentExpenditureCard
                  details={trialSiteData}
                  calculateFunction={calculateSiteCostWithVariableAndFixed}
                  title={"Site's"}
                />
              )}
              {(currentUserRoleOfTrailSite == "sponsor" ||
                currentUserRoleOfTrailSite == "site_monitor") && (
                <TrialCurrentExpenditureCard
                  details={trialDetails.trialData}
                  calculateFunction={calculateTrialCost}
                  title={"Trial"}
                />
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default TrialDetails;
