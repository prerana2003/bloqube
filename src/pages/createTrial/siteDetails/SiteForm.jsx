import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Grid } from "@mui/material";
import { useCreateTrialSitePatchMutation } from "../../../store/slices/apiSlice";
import SiteBudgetSection from "./SiteBudgetSection";
import CustomButton from "../../../components/@extended/CustomButton";
import SiteDetailsSection from "./SiteDetailsSection";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SiteAccountSection from "./SiteAccountSection";
import SiteDocumentsSection from "./SiteDocumentsSection";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SiteForm = ({
  trialSiteData,
  siteDetails,
  onBackClick,
  selectedSite,
  openMessageNotification,
}) => {
  const [createTrialSitePatch] = useCreateTrialSitePatchMutation();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const currentTrial = useSelector((state) => state.trial.currentTrial);
  const currentTrialSites = useSelector((state) => state.trial.currentTrialSites);
  const { trialId } = useParams();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    buttonLabel: "Save",
  });
  const [resetDialog, setResetDialog] = useState(false);
  let fixedOtherCost = {
    cost: "",
    comment: "",
    id: "",
    siteFixedCostId: "",
  };
  let variableOtherCost = {
    siteVariableCostId: "",
    cost: "",
    comment: "",
    id: "",
  };


  const noOfSubjects = useMemo(() => {
    let TrialtotalSubjects = currentTrial?.totalSubjectNumber
    let siteTotalSubjects = 0
    currentTrialSites?.forEach((site) => {
      if(selectedSite?.siteId!==site.siteId) siteTotalSubjects+=site?.totalSubjects
    })
    return {TrialtotalSubjects,siteTotalSubjects}
  },[currentTrial,currentTrialSites,selectedSite])


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
    onBackClick()
  }

  let initialValues = useMemo(() => {
    return {
      documents:"",
      id: siteDetails?.id ? siteDetails.id : "",
      siteId: siteDetails?.siteId ? siteDetails.siteId : "",
      trialId: trialId,
      siteTrialId: siteDetails?.id ? siteDetails.id : "",
      totalSubjects: siteDetails ? siteDetails.totalSubjects : "",
      fixedCost: {
        id: siteDetails?.fixedCost?.id ? siteDetails?.fixedCost?.id : "",
        siteTrialId: siteDetails?.fixedCost?.siteTrialId
          ? siteDetails?.fixedCost?.siteTrialId
          : "",
        irbFees: siteDetails?.fixedCost?.irbFees
          ? parseFloat(siteDetails?.fixedCost?.irbFees)
          : "",
        regulatoryFees: siteDetails?.fixedCost?.regulatoryFees
          ? parseFloat(siteDetails?.fixedCost?.regulatoryFees)
          : "",
        courierFees: siteDetails?.fixedCost?.courierFees
          ? parseFloat(siteDetails?.fixedCost?.courierFees)
          : "",
        personalCost: siteDetails?.fixedCost?.personalCost
          ? parseFloat(siteDetails?.fixedCost?.personalCost)
          : "",
        milesStonePayment: siteDetails?.fixedCost?.milesStonePayment
          ? parseFloat(siteDetails?.fixedCost?.milesStonePayment)
          : "",
        visitSchedule: siteDetails?.fixedCost?.visitSchedule
          ? siteDetails?.fixedCost?.visitSchedule
          : "",
        otherCosts: siteDetails?.fixedCost?.otherCosts
          ? siteDetails?.fixedCost?.otherCosts.map((otherCost) => {
              return {
                cost: parseFloat(otherCost.cost),
                comment: otherCost.comment,
                id: otherCost.id,
                siteFixedCostId: otherCost.siteFixedCostId,
              };
            })
          : [fixedOtherCost],
      },
      variableCost: {
        siteTrialId: siteDetails?.variableCost?.siteTrialId
          ? siteDetails?.variableCost?.siteTrialId
          : "",
        id: siteDetails?.variableCost?.id ? siteDetails?.variableCost?.id : "",
        perPatientCost: siteDetails?.variableCost?.perPatientCost
          ? parseFloat(siteDetails?.variableCost?.perPatientCost)
          : "",
        asSaeUpCost: siteDetails?.variableCost?.asSaeUpCost
          ? parseFloat(siteDetails?.variableCost?.asSaeUpCost)
          : "",
        travelCost: siteDetails?.variableCost?.travelCost
          ?parseFloat( siteDetails?.variableCost?.travelCost)
          : "",
        diagnositcsCost: siteDetails?.variableCost?.diagnositcsCost
          ? parseFloat(siteDetails?.variableCost?.diagnositcsCost)
          : "",
        imaging: siteDetails?.variableCost?.imaging
          ? parseFloat(siteDetails?.variableCost?.imaging)
          : "",
        courierCost: siteDetails?.variableCost?.courierCost
          ? parseFloat(siteDetails?.variableCost?.courierCost)
          : "",
        milestonePayment: siteDetails?.variableCost?.milestonePayment
          ? parseFloat(siteDetails?.variableCost?.milestonePayment)
          : "",
        visitSchedule: siteDetails?.variableCost?.visitSchedule
          ? siteDetails?.variableCost?.visitSchedule
          : "",
        otherCosts: siteDetails?.variableCost?.otherCosts
          ? siteDetails?.variableCost?.otherCosts.map((otherCost) => {
              return {
                siteVariableCostId: otherCost.siteVariableCostId,
                cost: parseFloat(otherCost.cost),
                comment: otherCost.comment,
                id: otherCost.id,
              };
            })
          : [variableOtherCost],
      },
      siteTrialAccountDetail: {
        id: siteDetails?.siteTrialAccountDetail?.id
          ? siteDetails?.siteTrialAccountDetail?.id
          : "",
        accountNumber: siteDetails?.siteTrialAccountDetail?.accountNumber
          ? siteDetails?.siteTrialAccountDetail?.accountNumber
          : "",
        accountNumber2: siteDetails?.siteTrialAccountDetail?.accountNumber
          ? siteDetails?.siteTrialAccountDetail?.accountNumber
          : "",
        routingNumber: siteDetails?.siteTrialAccountDetail?.routingNumber
          ? siteDetails?.siteTrialAccountDetail?.routingNumber
          : "",
        abaNumber: siteDetails?.siteTrialAccountDetail?.abaNumber
          ? siteDetails?.siteTrialAccountDetail?.abaNumber
          : "",
        swiftNumber: siteDetails?.siteTrialAccountDetail?.swiftNumber
          ? siteDetails?.siteTrialAccountDetail?.swiftNumber
          : "",
        siteTrialId: siteDetails?.siteTrialAccountDetail?.siteTrialId
          ? siteDetails?.siteTrialAccountDetail?.siteTrialId
          : "",
      },
    };
  }, [siteDetails]);

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema: Yup.object().shape({
      documents: Yup.boolean()
      .required("Documents are required")
      .test(
        "is-mandatory",
        "Documents are required",
        (value) => value === false
      ),
      siteId: Yup.number().required("Site ID is required"),
      totalSubjects: Yup.number()
        .required("Total Subjects is required")
        .min(0, "Number of subject cannot be negative")
        .test(
          "is-mandatory",
          "Site number of subjects should not exceed limit of trial number of subjecst",
          function (value) { 
            if (noOfSubjects.siteTotalSubjects + value > noOfSubjects.TrialtotalSubjects) {
              let available = noOfSubjects.TrialtotalSubjects-noOfSubjects.siteTotalSubjects
              return this.createError({
                path: `totalSubjects`,
                message: `Available number of subjects are ${available} for trial.`,
              });
            }
            return true;
          }
        ),
      siteTrialAccountDetail: Yup.object().shape({
        accountNumber: Yup.number("Account number must be a number")
          .positive("Account number must be a positive number")
          .integer("Account number cannot contain special characters")
          .max(99999999999999999999, "Account number must be at most 20 digits")
          .required("Account number is required"),
        accountNumber2: Yup.number("Account number must be a number")
          .positive("Account number must be a positive number")
          .integer("Account number cannot contain special characters")
          .max(99999999999999999999, "Account number must be at most 20 digits")
          .required("Account number is required")
          .test(
            "accountNumbersMatch",
            "Account Numbers must match",
            function (value) {
              return value === this.parent.accountNumber;
            }
          ),
        routingNumber: Yup.string().required("Routing Number is Required"),
        abaNumber: Yup.string().required("ABA Number is Required"),
        swiftNumber: Yup.string().required("Swift Number is Required"),
      }),
      fixedCost: Yup.object().shape({
        irbFees: Yup.number()
          .required("IRB Fees is required")
          .min(0, "IRB Fees cannot be negative"),
        regulatoryFees: Yup.number()
          .required("Regulatory Fees is required")
          .min(0, "Regulatory Fees cannot be negative"),
        courierFees: Yup.number()
          .required("Courier Fees is required")
          .min(0, "Courier Fees cannot be negative"),
        personalCost: Yup.number()
          .required("Personal Costs is required")
          .min(0, "Personal Costs cannot be negative"),
        milesStonePayment: Yup.number()
          .required("Milestone Payment is required")
          .min(0, "Milestone Payment cannot be negative"),
        visitSchedule: Yup.string().required("Visit Schedule is required"),
        otherCosts: Yup.array().of(
          Yup.object().shape({
            cost: Yup.number()
              .required("Cost is required")
              .min(0, "Cost cannot be negative"),
            comment: Yup.string().required("Comment is required"),
          })
        ),
      }),
      variableCost: Yup.object().shape({
        perPatientCost: Yup.number()
          .required("Patient visit cost is required")
          .min(0, "Cost cannot be negative"),
        asSaeUpCost: Yup.number()
          .required("AS/SAE/UP Cost is required")
          .min(0, "Cost cannot be negative"),
        travelCost: Yup.number()
          .required("Travel Cost is required")
          .min(0, "Cost cannot be negative"),
        diagnositcsCost: Yup.number()
          .required("Diagnostics Cost is required")
          .min(0, "Cost cannot be negative"),
        imaging: Yup.number()
          .required("Imaging cost is required")
          .min(0, "Cost cannot be negative"),
        courierCost: Yup.number()
          .required("Courier Cost is required")
          .min(0, "Cost cannot be negative"),
        milestonePayment: Yup.number()
          .required("Milestone Payments is required")
          .min(0, "Cost cannot be negative"),
        visitSchedule: Yup.string().required("Visit Schedule is required"),
        otherCosts: Yup.array().of(
          Yup.object().shape({
            cost: Yup.number()
              .required("Cost is required")
              .min(0, "Cost cannot be negative"),
            comment: Yup.string().required("Comment is required"),
          })
        ),
      }),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleConfirmDialogClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
      message: "",
      buttonLabel: "Save",
    });
  };

  const handleResetDialogClose = () => {
    setResetDialog(false);
  };

  const handleReset = () => {
    setResetDialog(false);
    formik.handleReset();
  };

  const handleSave = async (e) => {
    setConfirmDialog((prevState) => ({
      ...prevState,
      open: false,
      message: "",
      buttonLabel: "Save",
    }));
    formik.handleSubmit();
    if (formik.isValid) {
      const body = formik.values;
      const result = await createTrialSitePatch({
        id: trialId,
        siteDetailsPayload: body,
        sponsorId: sponsorId,
      });
      if (result.data) {
        openMessageNotification({
          message: "Site Added Sucessfully",
          type: "success",
        });
        onBackClick();
      } else if (result.error) {
        const error = result.error;
        if (error.status == 400) {
          if (
            error?.data?.message?.indexOf("accountNumber") != -1 ||
            error?.data?.message?.indexOf("account_number") != -1
          ) {
            formik.setFieldError(
              "siteTrialAccountDetail.accountNumber",
              "Account Number shuold be unique"
            );
            openMessageNotification({
              message: "Unable to Submit, Please Check Error.",
              type: "error",
            });
          }
        }
        console.log("Error", result);
      }
    } else {
      openMessageNotification({
        message: "Check if all fields are valid!",
        type: "error",
      });
    }
  };

  const handleSubmit = () => {
    if (formik.isValid) {
      setConfirmDialog({
        ...confirmDialog,
        open: true,
        message: "Do you want to save this form?",
        buttonLabel: "Save",
      });
    } else {
      setConfirmDialog({
        ...confirmDialog,
        open: true,
        message: "Validate all fields before submission",
        buttonLabel: "Ok",
      });
    }
  };
  const handleDocumentValidation = (value) => {
    formik.setFieldValue("documents", value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Grid container rowGap={2}>
        <Button
          component="label"
          variant="outlined"
          onClick={(e) => onBackClick()}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Grid item xs={12}>
          <SiteDetailsSection
            formik={formik}
            trialSiteData={trialSiteData}
            selectedSite={selectedSite}
            openMessageNotification={openMessageNotification}
          />
        </Grid>
        <Grid item xs={12}>
          <SiteDocumentsSection
            siteId={formik.values.siteId}
            trialId={trialId}
            formik={formik}
            touchedState={formik.touched.documents}
            errorState={formik.errors.documents}
            handleDocumentValidation={(value) => handleDocumentValidation(value)}
            BoxName={"documents"}
          />
        </Grid>
        <Grid item xs={12}>
          <SiteAccountSection formik={formik} />
        </Grid>
        <Grid item xs={12}>
          <SiteBudgetSection
            formik={formik}
            // otherCosts={otherCosts}
            variableOtherCost={variableOtherCost}
            fixedOtherCost={fixedOtherCost}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            component="label"
            variant="outlined"
            onClick={() => setCancelDialog({...cancelDialog, open : true})}
          >
            Cancel
          </Button>
          <Box>
            <Button
              variant="outlined"
               onClick={() => setResetDialog(true)}
              color="primary"
              sx={{ padding: "8px 30px", textTransform: "none" }}
            >
              Reset
            </Button>
            <CustomButton onClick={handleSubmit} style={{ marginLeft: 15 }}>
              Save & Continue
            </CustomButton>
          </Box>
        </Grid>
      </Grid>
      <ConfirmationDialog
        open={confirmDialog.open}
        buttonLabel={confirmDialog.buttonLabel}
        message={confirmDialog.message}
        handleClose={handleConfirmDialogClose}
        handleConfirm={handleSave}
      />
      <ConfirmationDialog
        open={resetDialog}
        buttonLabel={"Reset"}
        message={"Do you want to reset this form?"}
        handleClose={handleResetDialogClose}
        handleConfirm={handleReset}
      />

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

export default SiteForm;
