import React, { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import { getIn } from "formik";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RemoveOutlined } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useUpdateTrialBudgetDetailMutation } from "../../../store/slices/apiSlice";
import CustomButton from "../../../components/@extended/CustomButton";

const TrialBudgetSection = ({
  formik,
  otherCost,
  openMessageNotification,
  trialDetailsFormik,
}) => {
  const theme = useTheme();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [updateTrialBudgetDetail] = useUpdateTrialBudgetDetailMutation();

  const handleUpdate = () => {
    let fixedCost = formik.values.fixedCost;
    let variableCost = formik.values.variableCost;
    updateTrialBudgetDetail({
      sponsorId,
      trialId: fixedCost.trialId,
      budgetDetail: { fixedCost: fixedCost, variableCost: variableCost },
    });
    openMessageNotification({
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const visitSchedule = [
    {
      label: "FPFV",
      value: "FPFV",
    },
    {
      label: "FPLV",
      value: "FPLV",
    },
    {
      label: "LPLV",
      value: "LPLV",
    },
    {
      label: "LVFP",
      value: "LVFP",
    },
  ];

  const fixedCost = useMemo(() => {
    let totalSubjectNumber = trialDetailsFormik.values.totalSubjectNumber;
    let drugCostPerPatient =
      typeof formik.values?.fixedCost?.drugCostPerPatient === "number"
        ? formik.values.fixedCost.drugCostPerPatient
        : 0;
    let investigatorMeeting =
      typeof formik.values?.fixedCost?.investigatorMeeting === "number"
        ? formik.values.fixedCost.investigatorMeeting
        : 0;
    let indFees =
      typeof formik.values?.fixedCost?.indFees === "number"
        ? formik.values.fixedCost.indFees
        : 0;
    let regulatoryFees =
      typeof formik.values?.fixedCost?.regulatoryFees === "number"
        ? formik.values.fixedCost.regulatoryFees
        : 0;
    let croCost =
      typeof formik.values?.fixedCost?.croCost === "number"
        ? formik.values.fixedCost.croCost
        : 0;
    let equipmentLease =
      typeof formik.values?.fixedCost?.equipmentLease === "number"
        ? formik.values.fixedCost.equipmentLease
        : 0;
    let milestonePayment =
      typeof formik.values?.fixedCost?.milestonePayment === "number"
        ? formik.values.fixedCost.milestonePayment
        : 0;

    let otherCost = formik.values?.fixedCost?.otherCosts.reduce(
      (sum, otherCost) => {
        if (typeof otherCost.cost == "number") {
          return sum + parseFloat(otherCost.cost);
        }
        return sum;
      },
      0
    );

    return (
      parseFloat(regulatoryFees) +
      parseFloat(drugCostPerPatient) * totalSubjectNumber +
      parseFloat(investigatorMeeting) +
      parseFloat(indFees) +
      parseFloat(croCost) +
      parseFloat(equipmentLease) +
      parseFloat(milestonePayment) +
      parseFloat(otherCost)
    );
  }, [formik.values.fixedCost]);

  const variableCost = useMemo(() => {
    let totalSubjectNumber = trialDetailsFormik.values.totalSubjectNumber;
    let patientVisit =
      typeof formik.values?.variableCost?.patientVisit === "number"
        ? formik.values.variableCost.patientVisit
        : 0;
    let drugDeliveryCost =
      typeof formik.values?.variableCost?.drugDeliveryCost === "number"
        ? formik.values.variableCost.drugDeliveryCost
        : 0;
    let cro =
      typeof formik.values?.variableCost?.cro === "number"
        ? formik.values.variableCost.cro
        : 0;
    let milestonePayment =
      typeof formik.values?.variableCost?.milestonePayment === "number"
        ? formik.values.variableCost.milestonePayment
        : 0;
    let otherCost = formik.values?.variableCost?.otherCosts.reduce(
      (sum, otherCost) => {
        if (typeof otherCost.cost == "number") {
          return sum + parseFloat(otherCost.cost);
        }
        return sum;
      },
      0
    );

    return (
      parseFloat(patientVisit) * totalSubjectNumber +
      parseFloat(drugDeliveryCost) * totalSubjectNumber +
      parseFloat(cro) * totalSubjectNumber +
      parseFloat(milestonePayment) +
      parseFloat(otherCost)
    );
  }, [formik.values.variableCost]);

  return (
    <Card>
      <CardHeader
        title={"Trial Budget"}
        subheader={"(all costs are in USD)"}
        subheaderTypographyProps={{ variant: "subtitle1" }}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container>
          <Grid item sm={12}>
            <Typography fontSize={18} color={theme.palette.text.primary}>
              Fixed Cost
            </Typography>
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.drugCostPerPatient"}
              placeholder={"Enter cost"}
              label={"Total Drug Costs per Patient"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.investigatorMeeting"}
              placeholder={"Enter cost"}
              label={"Investigator Meetings"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.indFees"}
              placeholder={"Enter cost"}
              label={"IND Fees"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.regulatoryFees"}
              placeholder={"Enter cost"}
              label={"Regulatory Fees"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.croCost"}
              placeholder={"Enter cost"}
              label={"CRO Cost"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.equipmentLease"}
              placeholder={"Enter cost"}
              label={"Equipment Leases"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.milestonePayment"}
              placeholder={"Enter cost"}
              label={"Milestone Payments"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ pb: 0.5 }}
            >
              Visit Schedule
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              error={Boolean(getIn(formik.errors, "fixedCost.visitSchedule"))}
            >
              <Select
                name={"fixedCost.visitSchedule"}
                value={getIn(formik.values, "fixedCost.visitSchedule")}
                onChange={formik.handleChange}
                fullWidth={true}
                placeholder="Visit Schedule"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em> Visit Schedule</em>
                </MenuItem>
                {visitSchedule.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {getIn(formik.touched, "fixedCost.visitSchedule") &&
                  getIn(formik.errors, "fixedCost.visitSchedule")}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={12} md={4} />
          {formik.values.fixedCost.otherCosts.map((_, index) => {
            return (
              <Grid container key={index}>
                <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
                  <TextFieldContainer
                    name={`fixedCost.otherCosts.${index}.cost`}
                    placeholder={"Enter Cost"}
                    label={"Other Cost"}
                    formik={formik}
                    type={"number"}
                  />
                </Grid>

                <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
                  <TextFieldContainer
                    name={`fixedCost.otherCosts.${index}.comment`}
                    placeholder={"Enter comment"}
                    label={"Comment"}
                    formik={formik}
                  />
                </Grid>
                <Grid item md={4}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      pt: 3.5,
                    }}
                  >
                    {index <= 0 &&
                      formik.values.fixedCost.otherCosts.length !== 3 && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (formik.values.fixedCost.otherCosts.length < 3) {
                              formik.values.fixedCost.otherCosts.push(
                                otherCost
                              );
                              formik.setFieldValue(
                                "fixedCost.otherCosts",
                                formik.values.fixedCost.otherCosts
                              );
                            }
                          }}
                          sx={{ bgcolor: theme.palette.grey[200] }}
                        >
                          <AddOutlinedIcon
                            fontSize={"18"}
                            color={theme.palette.common.white}
                          />
                        </IconButton>
                      )}
                    {index > 0 && (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          formik.values.fixedCost.otherCosts.splice(index, 1);
                          formik.setFieldValue(
                            "fixedCost.otherCosts",
                            formik.values.fixedCost.otherCosts
                          );
                        }}
                        sx={{ bgcolor: theme.palette.grey[200] }}
                      >
                        <RemoveOutlined
                          fontSize="inherit"
                          color={theme.palette.common.white}
                        />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            );
          })}
          <Grid xs={12} item>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="h6" sx={{ py: 1.5 }} color="inherit">
                Fixed Cost :
              </Typography>

              <Typography
                variant="h6"
                sx={{ py: 1.5, pl: 2, pr: 5 }}
                color="inherit"
              >
                {" "}
                {fixedCost ? `$${fixedCost.toFixed(2)}` : "$0.0"}
              </Typography>
            </Box>
            <Divider />
          </Grid>
          <Grid item sm={12} pt={4}>
            <Typography fontSize={18} color={theme.palette.text.primary}>
              Variable Cost
            </Typography>
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.patientVisit"}
              placeholder={"Enter cost"}
              label={"Patients Visits (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.drugDeliveryCost"}
              placeholder={"Enter cost"}
              label={"Drug Delivery cost (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.cro"}
              placeholder={"Enter cost"}
              label={"CRO Variable (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.milestonePayment"}
              placeholder={"Enter cost"}
              label={"Milestone Payments"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ pb: 0.5 }}
            >
              Visit Schedule
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              error={Boolean(
                getIn(formik.errors, "variableCost.visitSchedule")
              )}
            >
              <Select
                name={"variableCost.visitSchedule"}
                value={getIn(formik.values, "variableCost.visitSchedule")}
                onChange={formik.handleChange}
                fullWidth={true}
                placeholder="Visit Schedule"
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em> Visit Schedule</em>
                </MenuItem>
                {visitSchedule.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>
                {getIn(formik.touched, "variableCost.visitSchedule") &&
                  getIn(formik.errors, "variableCost.visitSchedule")}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={12} md={4} />
          {formik.values.variableCost.otherCosts.map((_, index) => {
            return (
              <Grid container key={index}>
                <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
                  <TextFieldContainer
                    name={`variableCost.otherCosts.${index}.cost`}
                    placeholder={"Enter Cost"}
                    label={"Other Cost"}
                    formik={formik}
                    type={"number"}
                  />
                </Grid>

                <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
                  <TextFieldContainer
                    name={`variableCost.otherCosts.${index}.comment`}
                    placeholder={"Enter comment"}
                    label={"Comment"}
                    formik={formik}
                  />
                </Grid>
                <Grid item md={4}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      pt: 3.5,
                    }}
                  >
                    {index <= 0 &&
                      formik.values.variableCost.otherCosts.length !== 3 && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (
                              formik.values.variableCost.otherCosts.length < 3
                            ) {
                              formik.values.variableCost.otherCosts.push(
                                otherCost
                              );
                              formik.setFieldValue(
                                "variableCost.otherCosts",
                                formik.values.variableCost.otherCosts
                              );
                            }
                          }}
                          sx={{ bgcolor: theme.palette.grey[200] }}
                        >
                          <AddOutlinedIcon
                            fontSize={"18"}
                            color={theme.palette.common.white}
                          />
                        </IconButton>
                      )}
                    {index > 0 && (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                          formik.values.variableCost.otherCosts.splice(
                            index,
                            1
                          );
                          formik.setFieldValue(
                            "variableCost.otherCosts",
                            formik.values.variableCost.otherCosts
                          );
                        }}
                        sx={{ bgcolor: theme.palette.grey[200] }}
                      >
                        <RemoveOutlined
                          fontSize="inherit"
                          color={theme.palette.common.white}
                        />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              </Grid>
            );
          })}
          <Grid xs={12} item>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography variant="h6" sx={{ py: 1.5 }} color="inherit">
                Variable Cost :
              </Typography>

              <Typography
                variant="h6"
                sx={{ py: 1.5, pl: 2, pr: 5 }}
                color="inherit"
              >
                {variableCost ? `$${variableCost.toFixed(2)}` : "$0.0"}
              </Typography>
            </Box>
            <Divider />
          </Grid>

          {formik.values.fixedCost.id && formik.values.variableCost.id && (
            <Grid
              item
              sm={12}
              md={12}
              sx={{
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
                pr: 5,
              }}
            >
              <CustomButton
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUpdate}
                sx={{ color: "white" }}
              >
                Update
              </CustomButton>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrialBudgetSection;
