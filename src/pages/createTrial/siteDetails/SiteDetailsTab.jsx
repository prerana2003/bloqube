import {  Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bloqcibeApi } from "../../../store/slices/apiSlice";
import SiteList from "./SiteList";
import { useDispatch, useSelector } from "react-redux";
import SiteForm from "./SiteForm";
import ManageMembers from "./ManageMembers";
import CustomButton from "../../../components/@extended/CustomButton";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import { openMessage } from "../../../store/slices/showMessageSlice";

const SiteDetailsTab = ({ handleTabChange, isValidTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getTrialSiteDetails, { data: trialSiteData }] =
    bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
  const { trialId } = useParams();
  useEffect(() => {
    (async () => {
      await getTrialSiteDetails({ trialId, sponsorId });
    })();
  }, [dispatch]);

  useEffect(() => {
    trialSiteData && trialSiteData.length !== 0 && isValidTab(true);
  }, [trialSiteData]);

  const openMessageNotification = (message) => {
    dispatch(openMessage({message:message.message,messageSeverity:message.type}))
  };

  const openSiteForm = (siteDetails) => {
    setSelectedSite(siteDetails);
    setShowSiteForm(true);
  };
  const openMemberDetails = (siteDetails) => {
    setSelectedSite(siteDetails);
    setShowMemberForm(true);
  };
  const onBackClick = () => {
    setSelectedSite(null);
    setShowMemberForm(false);
    setShowSiteForm(false);
  };

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    message: "are you sure you want to cancel ?",
    buttonLabel: "OK",
  });

  const handleCancelDialogClose = () => {
    setCancelDialog({ ...cancelDialog, open: false })
  }

  const handleCancel = () => {
    setCancelDialog({ ...cancelDialog, open: false })
    navigate('/')
  }

  return (
    <>
      <Grid container sx={{ p: 3 }} rowGap={2}>
        {!showSiteForm && !showMemberForm && (
          <Grid item xs={12}>
            <SiteList
              trialSiteData={trialSiteData}
              openSiteForm={openSiteForm}
              openMemberDetails={openMemberDetails}
              openMessageNotification={openMessageNotification}
            />
          </Grid>
        )}

        {showMemberForm && (
          <Grid item xs={12}>
            <ManageMembers
              siteId={selectedSite?.siteId}
              siteName={selectedSite?.site?.orgname}
              trialId={trialId}
              onBackClick={onBackClick}
            />
          </Grid>
        )}
        {showSiteForm && (
          <Grid item xs={12}>
            <SiteForm
              openMessageNotification={openMessageNotification}
              handleTabChange={handleTabChange}
              trialSiteData={trialSiteData}
              siteDetails={selectedSite}
              onBackClick={onBackClick}
              selectedSite={selectedSite}
            />
          </Grid>
        )}
        {!showMemberForm && !showSiteForm && (
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="outlined"
              onClick={() => setCancelDialog({...cancelDialog, open : true})}
              color="primary"
              size="large"
              sx={{ padding: "8px 30px", textTransform: "none" }}
            >
              Cancel
            </Button>
            {trialSiteData && trialSiteData.length >= 1 && (
              <CustomButton
                variant="contained"
                onClick={(e) => handleTabChange(e, 2)}
                color="primary"
                size="large"
                sx={{
                  padding: "8px 30px",
                  textTransform: "none",
                  color: "white",
                }}
              >
                Continue
              </CustomButton>
            )}
          </Grid>
        )}
      </Grid>
      <ConfirmationDialog
          open={cancelDialog.open}
          buttonLabel={cancelDialog.buttonLabel}
          message={cancelDialog.message}
          handleClose={handleCancelDialogClose}
          handleConfirm={handleCancel}
        />
    </>
  );
};

export default SiteDetailsTab;
