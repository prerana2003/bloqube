import { Box, Button, CardContent, Grid, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RightArrow from "../../components/icons/RightArrow";
import TrialSiteDetailsCard from "./TrialSiteDetailsCard";
import SiteClinicalTeamCard from "./SiteClinicalTeamCard";
import TrialSiteBudgetCard from "./TrialSiteBudgetCard";
import TrialSiteCurrentExpenditure from "./TrialSiteCurrentExpenditure";
import CustomCard from "../../components/@extended/CustomCard";
import SiteStatusStepper from "./SiteStatusStepper";
import { useGetTrialSiteInfoQuery } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import _ from 'lodash'
import CustomButton from "../../components/@extended/CustomButton";
import SubjectListCard from "./SubjectListCard"
import DocumentsList from "../../components/common/DocumentsList";
import SubjectWithdrawListCard from "./SubjectWithdrawListCard";
import DocumentUploadWithCategory from "../../components/common/DocumentUploadWithCategory";
import ReadonlyFormDetails from "./ReadonlyFormDetails";
import SubjectAEListCard from "./SubjectAEListCard";

const TrialSiteDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { trialId, trialSiteId } = useParams();
  const [openICForm, setOpenICForm] = useState(false);
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const loggedInUser = useSelector((state) => state.auth.user);
  const [uploadDocModal, setUploadDocModal] = useState(false)
  const { data: trialSiteData } = useGetTrialSiteInfoQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteTrialId: trialSiteId,
  });
  const siteId = trialSiteData?.siteTrialData?.siteId;
  const siteName = trialSiteData?.siteTrialData?.site?.orgname;
  const currentUserRoleOfTrailSite = useMemo(() => {
    if (trialSiteData) {
      const users = trialSiteData.users;
      const logginUserEmail = loggedInUser.email;
      const userObject = _.find(users, (user) => {
        return user.user.email?.toLowerCase() == logginUserEmail?.toLowerCase();
      })

      if (userObject) {
        return userObject.role;
      }
      return "sponsor";
    }

  }, [trialSiteData]);
  const viewICForm = () => {
    setOpenICForm(true)
  }

  const pageSize = useMemo(() => {
    if (currentUserRoleOfTrailSite == 'site_admin' ||
      currentUserRoleOfTrailSite == 'sponsor' || currentUserRoleOfTrailSite == 'site_monitor') {
      return 7;
    }
    return 12;
  }, [currentUserRoleOfTrailSite]);

  const handleOpenDocumentModal = () => {
    setUploadDocModal(true)
  }

  return (
    <>
      <Grid container p={3} rowGap={2}>
        <Grid item xs={12}>
          <Button
            type="text"
            onClick={() => navigate(-1)}
            startIcon={<RightArrow leftArrow />}
          >
            <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
              Back to Trial Details
            </Typography>
          </Button>
          <Typography variant="h2"></Typography>
        </Grid>
        <Grid container direction={"row"} columnSpacing={3}>
          <Grid item sm={12} md={pageSize}>
            <Box sx={{ pb: 3 }}>
              <TrialSiteDetailsCard
                siteDetails={trialSiteData?.siteTrialData}
              />
            </Box>
            <Box sx={{ pb: 3 }}>
              <SiteClinicalTeamCard
                teamMembers={trialSiteData?.users}
                currentUserRoleOfTrailSite={currentUserRoleOfTrailSite}
                trialId={trialId}
                siteId={siteId}
                siteName={siteName}
              />
            </Box>
            {(currentUserRoleOfTrailSite == "site_admin" ||
              currentUserRoleOfTrailSite == "sponsor" ||
              currentUserRoleOfTrailSite == "site_monitor") && (
                <Box sx={{ pb: 3 }}>
                  <CustomCard
                    title="eISF Documents"
                    action={
                      currentUserRoleOfTrailSite == "site_admin" && (
                        <CustomButton
                          size="small"
                          onClick={handleOpenDocumentModal}
                        >
                          Upload Documents
                        </CustomButton>
                      )
                    }
                  >
                    <CardContent>
                      <DocumentsList
                        trialId={trialId}
                        sponsorId={sponsorId}
                        siteId={siteId}
                      />
                    </CardContent>
                  </CustomCard>
                </Box>
              )}
            <Box sx={{ pb: 3 }}>
              <SiteStatusStepper />
            </Box>
          </Grid>
          {(currentUserRoleOfTrailSite == "site_admin" ||
            currentUserRoleOfTrailSite == "sponsor" ||
            currentUserRoleOfTrailSite == "site_monitor") && 
            (<Grid item md={5} sm={12}>
              <Box sx={{ pb: 3 }}>
                <TrialSiteBudgetCard
                  siteDetails={trialSiteData?.siteTrialData}
                />
              </Box>
              <Box sx={{ pb: 3 }}>
                <TrialSiteCurrentExpenditure
                  siteDetails={trialSiteData?.siteTrialData}
                />
              </Box>
            </Grid>
          )}
          {(currentUserRoleOfTrailSite == "PI" ||
            currentUserRoleOfTrailSite == "site_coordinator" ||
            currentUserRoleOfTrailSite == "site_monitor") &&
            trialSiteData?.siteTrialData?.status == "Completed" && (
              <Grid container rowSpacing={4.5}>
                <Grid
                  item
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    columnGap: 2,
                  }}
                >
                  {(currentUserRoleOfTrailSite == "PI" ||
                    currentUserRoleOfTrailSite == "site_monitor" ||
                    currentUserRoleOfTrailSite == "site_coordinator") && (
                    <CustomButton
                      variant="contained"
                      onClick={() => viewICForm()}
                    >
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.common.white}
                      >
                        View IC Form
                      </Typography>
                    </CustomButton>
                  )}
                  {(currentUserRoleOfTrailSite == "PI" ||
                    currentUserRoleOfTrailSite == "site_coordinator") && (
                    <CustomButton
                      variant="contained"
                      onClick={() => {
                        navigate(
                          `/eConcent/${trialId}/trial-site/${trialSiteId}/SubjectEnrollmentFormParent`
                        );
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.common.white}
                      >
                        + Enroll Subject
                      </Typography>
                    </CustomButton>
                  )}
                </Grid>
                <Grid item sm={12} sx={{ paddingTop: 8 }}>
                  {currentUserRoleOfTrailSite === "site_monitor" && (
                    <SubjectAEListCard
                      trialId={trialId}
                      siteId={siteId}
                      trialSiteId={trialSiteId}
                    />
                )}
                {currentUserRoleOfTrailSite !== "site_monitor" && (
                  <SubjectListCard
                    teamMembers={trialSiteData?.users}
                    trialId={trialId}
                    siteId={siteId}
                    trialSiteId={trialSiteId}
                  />)}
                </Grid>
                <Grid item sm={12} sx={{ paddingTop: 8 }}>
                  <SubjectWithdrawListCard
                    sponsorId={sponsorId}
                    trialId={trialId}
                    siteId={siteId}
                    trialSiteId={trialSiteId}
                  />
                </Grid>
              </Grid>
            )}
        </Grid>
        {
          <ReadonlyFormDetails
            title={"IC Form Details"}
            open={openICForm}
            trialId={trialId}
            sponsorId={sponsorId}
            trialSiteId={trialSiteId}
            step={"IC"}
            handleClose={() => setOpenICForm(false)}
          />
        }
      </Grid>
      <DocumentUploadWithCategory
        dialogTitle={"Upload eISF Documents"}
        open={uploadDocModal}
        handleClose={() => setUploadDocModal(false)}
        trialId={trialId}
        siteId={siteId}
      />
    </>
  );
};

export default TrialSiteDetails;
