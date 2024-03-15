import React, { useEffect, useMemo, useState } from "react";
import TrialDetailsSection from "./TrialDetailsSection";
import StudyDetailsSection from "./StudyDetailsSection";
import CustomButton from "../../../components/@extended/CustomButton";
import TrialAccountDetailsSection from "./TrialAccountDetailsSection";
import TrialBudgetSection from "./TrialBudgetSection";
import { Box, Button, Grid } from "@mui/material";
import { useFormik, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import DocumentsSection from "../DocumentsSection";
import * as Yup from "yup";
import {
  bloqcibeApi,
  useCreateTrialMutation,
  useCreateTrialPatchMutation,
  useUpdateTrialPatchMutation,
} from "../../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import FormikErrorFocus from "formik-error-focus";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";
import { openMessage } from "../../../store/slices/showMessageSlice";

const testArticles = {
  id: "",
  drugName: "",
  drugClass: "",
  dosage: "",
  routesOfAdministration: "",
  duration: "",
  frequencyOfAdministration: "",
};

const otherCost = {
  id: "",
  cost: "",
  comment: "",
};

const BasicDetailsTab = ({ handleTabChange, isValidTab }) => {
  const navigate = useNavigate();
  const [fieldsVisible, setFieldsVisible] = useState(false);
  const [message, setMessage] = React.useState("");
  const [createTrial] = useCreateTrialMutation();
  const [createTrialPatch] = useCreateTrialPatchMutation();
  const [updateTrialPatch] = useUpdateTrialPatchMutation();
  const theraeupticAgents = { id: "", agentName: "", agentClass: "" };
  let { trialId } = useParams();
  const dispatch = useDispatch();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getTrialDetails, { data: trialDetails }] =
    bloqcibeApi.endpoints.getTrialDetails.useLazyQuery();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    buttonLabel: "Save",
  });

  const [cancelDialog, setCancelDialog] = useState({
    open: false,
    message: "Are you sure you want to cancel ?",
    buttonLabel: "OK",
  });

  const [resetDialog, setResetDialog] = useState(false);
  useEffect(() => {
    (async () => {
      if (trialId) {
        await getTrialDetails({
          id: trialId,
          sponsorId: sponsorId,
        });
      }
    })();
  }, [dispatch]);

  const openMessageNotification = (message) => {
    dispatch(openMessage({message:message.message,messageSeverity:message.type}))
  };


  const handleConfirmDialogClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
      message: "",
      buttonLabel: "Save",
    });
  };

  const handleCancelDialogClose = () => {
    setCancelDialog({ ...cancelDialog, open: false })
  }

  const handleResetDialogClose = () => {
    setResetDialog(false);
  };

  const handleReset = () => {
    setResetDialog(false);
    formik.handleReset();
    trialDetailsFormik.handleReset();
  };

  const trialDetailsValidation = Yup.object().shape({
    protocolNumber: Yup.string()
      .required("Protocol Number is required")
      .trim("The Protocol Number cannot include leading and trailing spaces")
      .strict(true)
      .min(2, "Minimum 2 characters are required")
      .max(50, "Maximum 50 characters are allowed"),
    protocolVersion: Yup.string()
      .required("Protocol Version is required")
      .trim("The Protocol Version cannot include leading and trailing spaces")
      .strict(true)
      .min(2, "Minimum 2 characters are required")
      .max(50, "Maximum 50 characters are allowed"),
    trialTitle: Yup.string()
      .required("Trial Title is Required")
      .min(2, "Minimum 2 characters are required"),
    totalSubjectNumber: Yup.number()
      .required("Subject number is Required")
      .min(0, "Number of subject cannot be negative")
      .max(1000000, "Total subjects cannot be more than 1000000"),
    siteInitiationForm: Yup.string().required(
      "Site Initiation Configuration is required"
    ),
    eConsentForm: Yup.string().required(
      "eConsent Configuration is required"
    ),
    crfForm: Yup.string().required(
      "crfForm Configuration is required"
    ),

    theraeupticAgents: Yup.array().of(
      Yup.object().shape({
        agentName: Yup.string().required("Name is Required"),
        agentClass: Yup.string().required("Class is Required"),
      })
    ),
  });

  const validation = Yup.object().shape({
    documents: Yup.boolean()
      .required("Documents are required")
      .test(
        "is-mandatory",
        "Documents are required",
        (value) => value === false
      ),
    studyDetail: Yup.object().shape({
      studyType: Yup.string()
        .required("Study Type is required")
        .min(2, "Minimum 2 characters are required")
        .max(50, "Maximum 50 characters are allowed"),
      treatmentNumber: Yup.number()
        .required("Number of Treatment is required")
        .min(0, "Number of Treatment cannot be negative")
        .max(1000, "Please enter a number of treatment less than 1000"),
      totalTreatmentDuration: Yup.number()
        .required("Total Treatment Duration is required")
        .min(0, "Number of Treatment Duration cannot be negative")
        .max(
          240,
          "Total treatment duration can not be greater than 20 years months."
        ),
      testArticles: Yup.array()
        .of(
          Yup.object().shape({
            drugName: Yup.string()
              .required("Name of Drug is Required")
              .trim(
                "The Protocol Number cannot include leading and trailing spaces"
              )
              .strict(true)
              .max(50, "Maximum 50 characters are allowed"),
            drugClass: Yup.string()
              .required("Class of Drug is Required")
              .min(2, "Minimum 2 characters are required")
              .max(50, "Maximum 50 characters are allowed"),
            dosage: Yup.number()
              .required("Dosage is Required")
              .min(0, "Dosage cannot be negative"),
            routesOfAdministration: Yup.string()
              .required("Route of Administration is Required")
              .min(2, "Minimum 2 characters are required")
              .max(25, "Maximum 25 characters are allowed"),
            duration: Yup.number()
              .required("Duration is Required")
              .min(0, "Duration cannot be negative"),
            frequencyOfAdministration: Yup.string().required(
              "Frequency of Administration is Required"
            ),
          })
        )
        .test("is-unique", "Drug name must be unique", function (value) {
          let seenNames = [];
          for (let i = 0; i < value.length; i++) {
            const drugName = value[i].drugName;
            if (seenNames.includes(drugName)) {
              return this.createError({
                path: `studyDetail.testArticles[${i}].drugName`,
                message: "Drug names must be unique",
              });
            }
            seenNames.push(drugName);
          }
          return true;
        }),
    }),
    bankDetail: Yup.object().shape({
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
      drugCostPerPatient: Yup.number("Drug Cost per Patient should be number")
        .required("Drug Cost per Patient is required")
        .min(0, "Drug Cost per Patient cannot be negative"),
      investigatorMeeting: Yup.number("Investigator Meeting should be number")
        .required("Investigator Meetings cost is required")
        .min(0, "Investigator Meeting cannot be negative"),
      indFees: Yup.number("IND Fees should be number")
        .required("IND Fees is required")
        .min(0, "IND Fees cannot be negative"),
      regulatoryFees: Yup.number("Regulatory Fees should be number")
        .required("Regulatory Fees is required")
        .min(0, "Regulatory Fees cannot be negative"),
      croCost: Yup.number("CRO Cost should be number")
        .required("CRO Cost is required")
        .min(0, "CRO Cost per Patient cannot be negative"),
      equipmentLease: Yup.number("Equipment Leases should be number")
        .required("Equipment Leases is required")
        .min(0, "Equipment Leases cannot be negative"),
      milestonePayment: Yup.number("Milestone Payments should be number")
        .required("Milestone Payments is required")
        .min(0, "Milestone payments cannot be negative"),
      visitSchedule: Yup.string().required("Visit Schedule is required"),
      otherCosts: Yup.array().of(
        Yup.object().shape({
          cost: Yup.number("Cost should be number")
            .required("Cost is required")
            .min(0, "Cost cannot be negative"),
          comment: Yup.string().required("Comment is required"),
        })
      ),
    }),
    variableCost: Yup.object().shape({
      patientVisit: Yup.number("Patient Visit cost should be number")
        .required("Patient Visit cost is required")
        .min(0, "Patient Visit cost cannot be negative"),
      drugDeliveryCost: Yup.number("Drug Delivery Cost should be number")
        .required("Drug Delivery Cost is required")
        .min(0, "Drug Delivery Cost cannot be negative"),
      cro: Yup.number("CRO Cost should be number")
        .required("CRO is required")
        .min(0, "CRO Cost per Patient cannot be negative"),
      milestonePayment: Yup.number("Milestone Payments should be number")
        .required("Milestone Payments is required")
        .min(0, "Milestone payments cannot be negative"),
      visitSchedule: Yup.string().required("Visit Schedule is required"),
      otherCosts: Yup.array().of(
        Yup.object().shape({
          cost: Yup.number("Cost should be number")
            .required("Cost is required")
            .min(0, "Cost cannot be negative"),
          comment: Yup.string().required("Comment is required"),
        })
      ),
    }),
  });

  let initialValues = useMemo(() => {
    const trialData = trialDetails?.trialData;
    return {
      documents: "",
      studyDetail: {
        id: trialData?.studyDetail?.id ? trialData.studyDetail.id : "",
        trialId: trialData?.studyDetail?.trialId
          ? trialData.studyDetail.trialId
          : "",
        studyType: trialData?.studyDetail?.studyType
          ? trialData.studyDetail.studyType
          : "",
        treatmentNumber: trialData?.studyDetail?.treatmentNumber
          ? trialData.studyDetail.treatmentNumber
          : "",
        totalTreatmentDuration: trialData?.studyDetail
          ?.totalTreatmentDuration
          ? trialData.studyDetail.totalTreatmentDuration
          : "",
        testArticles: trialData?.studyDetail?.testArticles
          ? trialData.studyDetail.testArticles.map((article) => {
            return {
              id: article.id,
              study_detail_id: article.study_detail_id,
              drugName: article.drugName,
              drugClass: article.drugClass,
              dosage: article.dosage,
              routesOfAdministration: article.routesOfAdministration,
              duration: article.duration,
              frequencyOfAdministration: article.frequencyOfAdministration,
            };
          })
          : [testArticles],
      },
      bankDetail: {
        id: trialData?.bankDetail?.id ? trialData.bankDetail.id : "",
        accountNumber: trialData?.bankDetail?.accountNumber
          ? trialData.bankDetail.accountNumber
          : "",
        accountNumber2: trialData?.bankDetail?.accountNumber
          ? trialData.bankDetail.accountNumber
          : "",
        routingNumber: trialData?.bankDetail?.routingNumber
          ? trialData.bankDetail.routingNumber
          : "",
        abaNumber: trialData?.bankDetail?.abaNumber
          ? trialData.bankDetail.abaNumber
          : "",
        swiftNumber: trialData?.bankDetail?.swiftNumber
          ? trialData.bankDetail.swiftNumber
          : "",
      },
      fixedCost: {
        id: trialData?.fixedCost?.id ? trialData.fixedCost.id : "",
        trialId: trialData?.fixedCost?.trialId
          ? trialData.fixedCost.trialId
          : "",
        drugCostPerPatient: trialData?.fixedCost?.drugCostPerPatient
          ? trialData.fixedCost.drugCostPerPatient
          : "",
        investigatorMeeting: trialData?.fixedCost?.investigatorMeeting
          ? parseFloat(trialData.fixedCost.investigatorMeeting)
          : "",
        indFees: trialData?.fixedCost?.indFees
          ? trialData.fixedCost.indFees
          : "",
        regulatoryFees: trialData?.fixedCost?.regulatoryFees
          ? trialData.fixedCost.regulatoryFees
          : "",
        croCost: trialData?.fixedCost?.croCost
          ? trialData.fixedCost.croCost
          : "",
        equipmentLease: trialData?.fixedCost?.equipmentLease
          ? trialData.fixedCost.equipmentLease
          : "",
        milestonePayment: trialData?.fixedCost?.milestonePayment
          ? parseFloat(trialData.fixedCost.milestonePayment)
          : "",
        visitSchedule: trialData?.fixedCost?.visitSchedule
          ? trialData.fixedCost.visitSchedule
          : "",
        otherCosts: trialData?.fixedCost?.otherCosts
          ? trialData.fixedCost.otherCosts.map((otherCost) => {
            return {
              id: otherCost.id,
              cost: otherCost.cost,
              comment: otherCost.comment,
              fixedCostId: otherCost.fixedCostId,
            };
          })
          : [otherCost],
      },
      variableCost: {
        id: trialData?.variableCost?.id ? trialData.variableCost.id : "",
        trialId: trialData?.variableCost?.trialId
          ? trialData.variableCost.trialId
          : "",
        patientVisit: trialData?.variableCost?.patientVisit
          ? parseFloat(trialData.variableCost.patientVisit)
          : "",
        drugDeliveryCost: trialData?.variableCost?.drugDeliveryCost
          ? trialData.variableCost.drugDeliveryCost
          : "",
        cro: trialData?.variableCost?.cro
          ? trialData.variableCost.cro
          : "",
        milestonePayment: trialData?.variableCost?.milestonePayment
          ? parseFloat(trialData.variableCost.milestonePayment)
          : "",
        visitSchedule: trialData?.variableCost?.visitSchedule
          ? trialData.variableCost.visitSchedule
          : "",
        otherCosts: trialData?.variableCost?.otherCosts
          ? trialData.variableCost.otherCosts.map((otherCost) => {
            return {
              id: otherCost.id,
              cost: otherCost.cost,
              comment: otherCost.comment,
              id: otherCost.id,
            };
          })
          : [otherCost],
      },
    };
  }, [trialDetails]);

  let trialDetailsInitialValues = useMemo(() => {
    const trialData = trialDetails?.trialData;
    return {
      protocolNumber: trialData?.protocolNumber
        ? trialData.protocolNumber
        : "",
      protocolVersion:trialData?.protocolVersion
        ? trialData.protocolVersion
        : "",
      siteInitiationForm: trialData?.siteInitiationForm
        ? trialData.siteInitiationForm
        : "",
      eConsentForm: trialData?.eConsentForm
        ? trialData.eConsentForm
        : "",
      crfForm: trialData?.crfForm
        ? trialData.crfForm
        : "",

      trialTitle: trialData?.trialTitle ? trialData.trialTitle : "",
      totalSubjectNumber: trialData?.totalSubjectNumber
        ? trialData.totalSubjectNumber
        : "",
      theraeupticAgents: trialData?.theraeupticAgents
        ? trialData.theraeupticAgents.map((agent) => {
          return {
            id: agent.id,
            agentName: agent.agentName,
            agentClass: agent.agentClass,
          };
        })
        : [theraeupticAgents],
    };
  }, [trialDetails]);

  const formik = useFormik({
    validateOnMount: true,
    initialValues,
    validationSchema: validation,
    enableReinitialize: true,
    onSubmit: (values) => {
      return values;
    },
  });

  const trialDetailsFormik = useFormik({
    validateOnMount: true,
    initialValues: trialDetailsInitialValues,
    validationSchema: trialDetailsValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      return values;
    },
  });

  useEffect(() => {
    trialDetails &&
      trialDetails?.trialData?.bankDetail &&
      trialDetails?.trialData?.studyDetail &&
      trialDetails?.trialData?.fixedCost &&
      trialDetails?.trialData?.variableCost &&
      isValidTab(true);
  }, [trialDetails]);

  useEffect(() => {
    if (trialDetails) {
      setFieldsVisible(true);
    }
  }, [trialDetails]);

  const handleSave = async (e) => {
    e.preventDefault();
    setConfirmDialog((prevState) => ({
      ...prevState,
      open: false,
      message: "",
      buttonLabel: "Save",
    }));
    if (fieldsVisible === false) {
      trialDetailsFormik.handleSubmit();
      if (trialDetailsFormik.isValid) {
        const result = await createTrial({
          trialPayload: trialDetailsFormik.values,
          sponsorId: sponsorId,
        });
        if (result.data) {
          navigate(`/createTrial/${result.data.id}`);
          await getTrialDetails({
            id: result.data.id,
            sponsorId: sponsorId,
          });
        } else if (result.error) {
          const error =
            result.error.data.message.includes("protocolNumber") ||
            result.error.data.message.includes("protocol_number");
          return error
            ? trialDetailsFormik.setFieldError(
              "protocolNumber",
              "Protocol Number shuold be unique"
            )
            : null;
        }
      } else {
        openMessageNotification({
          message: "Check if all fields are valid!",
          type: "warning",
        });
      }
    } else {
      trialDetailsFormik.handleSubmit();
      formik.handleSubmit();
      if (
        (trialDetailsFormik.dirty || formik.dirty) &&
        trialDetailsFormik.isValid &&
        formik.isValid
      ) {
        const body = { ...trialDetailsFormik.values, ...formik.values };
        if (!body.studyDetail?.id) {
          const result = await createTrialPatch({
            id: trialId,
            sponsorId: sponsorId,
            trialPayload: body,
          });
          if (result.data) {
            openMessageNotification({
              message: "Submitted Successfully",
              type: "success",
            });
            isValidTab(true);
            handleTabChange(e, 1);
          } else if (result.error) {
            if (
              result.error.data.message.includes("account_number") &&
              result.error.data.message.includes("duplicate values")
            ) {
              openMessageNotification({
                message: "Account Number shuold be unique",
                type: "error",
              });
              formik.setFieldError(
                "bankDetail.accountNumber",
                "Account Number shuold be unique"
              );
            } else {
              openMessageNotification({
                message: "Unable to Submit",
                type: "error",
              });
            }
          }
        } else if (trialDetailsFormik.dirty && !formik.dirty) {
          //Update Trial Detail
          const result = await updateTrialPatch({
            id: trialId,
            sponsorId: sponsorId,
            trialPayload: body,
          });
          if (result.data) {
            openMessageNotification({
              message: "Submitted Successfully",
              type: "success",
            });
            handleTabChange(e, 1);
          } else if (result.error) {
            trialDetailsFormik.setFieldError(
              "protocol_number",
              "Duplicate Value"
            );
            openMessageNotification({
              message: "Duplicate Protocol Number",
              type: "error",
            });
          }
        } else if (!trialDetailsFormik.dirty && !formik.dirty) {
          openMessageNotification({
            message: "Submitted Successfully",
            type: "success",
          });
          handleTabChange(e, 1);
        } else {
          //Show Message to save individually
          openMessageNotification({
            message: "Please Update the Section Individually",
            type: "warning",
          });
        }
      } else {
        openMessageNotification({
          message: "Check if all fields are valid!",
          type: "warning",
        });
      }
    }
  };

  const handleCancel = () => {
    setCancelDialog({ ...cancelDialog, open: false })
    navigate('/')
  }

  const handleSubmit = () => {
    if (!fieldsVisible) {
      if (trialDetailsFormik.isValid) {
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
    } else {
      if (trialDetailsFormik.isValid && formik.isValid) {
        setConfirmDialog({
          ...confirmDialog,
          open: true,
          message: "Do you want to save this form?",
          buttonLabel: "Save",
        });
      } else if (trialDetailsFormik.isValid && !formik.isValid) {
        setConfirmDialog({
          ...confirmDialog,
          open: true,
          message: "Validate all fields before submission",
          buttonLabel: "Ok",
        });
      } else {
        setConfirmDialog({
          ...confirmDialog,
          open: true,
          message: "Validate all fields before submission",
          buttonLabel: "Ok",
        });
      }
    }
  };

  const handleDocumentValidation = (value) => {
    formik.setFieldValue("documents", value);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <Formik>
      <>
        <Grid container p={3} rowGap={2}>
          <Grid item xs={12}>
            <TrialDetailsSection
              formik={trialDetailsFormik}
              theraeupticAgents={theraeupticAgents}
              openMessageNotification={openMessageNotification}
            />
          </Grid>
          {fieldsVisible && (
            <>
              <Grid item xs={12}>
                <DocumentsSection
                  trialId={trialId}
                  touchedState={formik.touched.documents}
                  errorState={formik.errors.documents}
                  handleDocumentValidation={(value) => handleDocumentValidation(value)}
                  BoxName={"documents"}
                />
              </Grid>
              <Grid item xs={12}>
                <StudyDetailsSection
                  testArticles={testArticles}
                  formik={formik}
                  openMessageNotification={openMessageNotification}
                />
              </Grid>
              <Grid item xs={12}>
                <TrialAccountDetailsSection
                  formik={formik}
                  trialId={trialId}
                  openMessageNotification={openMessageNotification}
                />
              </Grid>
              <Grid item xs={12}>
                <TrialBudgetSection
                  formik={formik}
                  otherCost={otherCost}
                  openMessageNotification={openMessageNotification}
                  trialDetailsFormik={trialDetailsFormik}
                />
              </Grid>
            </>
          )}
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="outlined"
              onClick={() => setCancelDialog({ ...cancelDialog, open: true })}
              color="primary"
              size="large"
              sx={{ padding: "8px 30px", textTransform: "none" }}
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
        <FormikErrorFocus
          // See scroll-to-element for configuration options: https://www.npmjs.com/package/scroll-to-element
          offset={0}
          align={"top"}
          focusDelay={200}
          ease={"linear"}
          duration={1000}
        />
      </>
    </Formik>
  );
};

export default BasicDetailsTab;
