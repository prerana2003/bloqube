import React, { useMemo } from "react";
import {
  Box,
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
import { getIn } from "formik";
import { RemoveOutlined } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";

const SiteBudgetSection = ({ formik, variableOtherCost, fixedOtherCost }) => {
  const theme = useTheme();

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
    let irbFees =
      typeof formik.values.fixedCost.irbFees === "string"
        ? 0
        : formik.values.fixedCost.irbFees;
    let regulatoryFees =
      typeof formik.values.fixedCost.regulatoryFees === "string"
        ? 0
        : formik.values.fixedCost.regulatoryFees;
    let courierFees =
      typeof formik.values.fixedCost.courierFees === "string"
        ? 0
        : formik.values.fixedCost.courierFees;
    let personalCost =
      typeof formik.values.fixedCost.personalCost === "string"
        ? 0
        : formik.values.fixedCost.personalCost;
    let milesStonePayment =
      typeof formik.values.fixedCost.milesStonePayment === "string"
        ? 0
        : formik.values.fixedCost.milesStonePayment;

    let otherCost = formik.values.fixedCost.otherCosts.reduce(
      (sum, otherCost) => {
        if (typeof otherCost.cost == "number") {
          return sum + parseFloat(otherCost.cost);
        }
        return sum;
      },
      0
    );

    return (
      parseFloat(irbFees) +
      parseFloat(regulatoryFees) +
      parseFloat(courierFees) +
      parseFloat(personalCost) +
      parseFloat(milesStonePayment) +
      parseFloat(otherCost)
    );
  }, [formik.values.fixedCost]);

  const variableCost = useMemo(() => {
    let subjectNumber = formik.values?.totalSubjects;
    let perPatientCost =
      typeof formik.values.variableCost.perPatientCost === "string"
        ? 0
        : formik.values.variableCost.perPatientCost;
    let asSaeUpCost =
      typeof formik.values.variableCost.asSaeUpCost === "string"
        ? 0
        : formik.values.variableCost.asSaeUpCost;
    let travelCost =
      typeof formik.values.variableCost.travelCost === "string"
        ? 0
        : formik.values.variableCost.travelCost;
    let diagnositcsCost =
      typeof formik.values.variableCost.diagnositcsCost === "string"
        ? 0
        : formik.values.variableCost.diagnositcsCost;
    let imaging =
      typeof formik.values.variableCost.imaging === "string"
        ? 0
        : formik.values.variableCost.imaging;
    let courierCost =
      typeof formik.values.variableCost.courierCost === "string"
        ? 0
        : formik.values.variableCost.courierCost;
    let milestonePayment =
      typeof formik.values.variableCost.milestonePayment === "string"
        ? 0
        : formik.values.variableCost.milestonePayment;
    let otherCost = formik.values.variableCost.otherCosts.reduce(
      (sum, otherCost) => {
        if (typeof otherCost.cost == "number") {
          return sum + parseFloat(otherCost.cost);
        }
        return sum;
      },
      0
    );
    return (
      parseFloat(perPatientCost)*subjectNumber +
      parseFloat(asSaeUpCost)*subjectNumber +
      parseFloat(travelCost)*subjectNumber +
      parseFloat(diagnositcsCost)*subjectNumber +
      parseFloat(imaging)*subjectNumber +
      parseFloat(courierCost)*subjectNumber+
      parseFloat(milestonePayment) +
      parseFloat(otherCost)
    );
  }, [formik.values.variableCost]);
  return (
    <Card>
      <CardHeader
        title={"Site Budget"}
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
              name={"fixedCost.irbFees"}
              placeholder={"Enter cost"}
              label={"IRB Fees"}
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
              name={"fixedCost.courierFees"}
              placeholder={"Enter cost"}
              label={"Courier Cost"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.personalCost"}
              placeholder={"Enter cost"}
              label={"Personnel Cost"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"fixedCost.milesStonePayment"}
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
          <Grid item sm={0} md={4} />
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
                            if (
                              formik.values.fixedCost.otherCosts.length < 3
                            ) {
                              formik.values.fixedCost.otherCosts.push(
                                fixedOtherCost
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
              name={"variableCost.perPatientCost"}
              placeholder={"Enter cost"}
              label={"Patients Visits (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.asSaeUpCost"}
              placeholder={"Enter cost"}
              label={"AE/SAE/UP Cost (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.travelCost"}
              placeholder={"Enter cost"}
              label={"Travel Costs Patients (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.diagnositcsCost"}
              placeholder={"Enter cost"}
              label={"Diagnostics (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.imaging"}
              placeholder={"Enter cost"}
              label={"Imaging (per patient)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ py: 2, pr: 5 }}>
            <TextFieldContainer
              name={"variableCost.courierCost"}
              placeholder={"Enter cost"}
              label={"Courier Cost (per patient)"}
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
                  <em>Visit Schedule</em>
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
          <Grid item sm={0} md={4} />
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
                                variableOtherCost
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SiteBudgetSection;
