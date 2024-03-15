import React from "react";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  useTheme,
  Typography,
  FormControl,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { getIn } from "formik";
import { RemoveOutlined } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const TrialDetailsSection = ({ formik, theraeupticAgents }) => {
  const theme = useTheme();
  return (
    <Card>
      <CardHeader
        title={"Trial Details"}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container>
          <Grid item sm={12} md={5} sx={{ pb: 2 }}>
            <TextFieldContainer
              name={"protocolNumber"}
              placeholder={"Enter Protocol Number"}
              label={"Protocol Number"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          <Grid item sm={12} md={5} sx={{ pb: 2 }}>
            <TextFieldContainer
              name={"protocolVersion"}
              placeholder={"Enter Protocol Version"}
              label={"Protocol Version"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          <Grid item sm={12} md={5} sx={{ py: 2 }}>
            <TextFieldContainer
              name={"trialTitle"}
              placeholder={"Enter Trial Title"}
              label={"Trial Title"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          <Grid item sm={12} md={5} sx={{ py: 1 }}>
            <TextFieldContainer
              name={"totalSubjectNumber"}
              placeholder={"Enter Number of subjects"}
              label={"Total Number of subjects"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} sx={{ pb: 2, py: 2 }}>
            <Divider />
          </Grid>
          <Grid item sm={12} md={5} sx={{ pb: 2 }}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ pb: 0.5 }}
            >
              Site Initiation Configiration
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              error={Boolean(getIn(formik.errors, "siteInitiationForm"))}
            >
              <Select
                displayEmpty
                name={"siteInitiationForm"}
                value={getIn(formik.values, "siteInitiationForm")}
                onChange={formik.handleChange}
                fullWidth={true}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em style={{ color: "#aaa", fontStyle: "normal" }}>
                    Select Site Initiation Configiration
                  </em>
                </MenuItem>
                <MenuItem value="metastatic-melanoma-site-init">
                  Metastatic Melanoma Site Initiation
                </MenuItem>
                <MenuItem value="second-site-init">
                  Second Site Initiation
                </MenuItem>
              </Select>
              <FormHelperText>
                {getIn(formik.touched, "siteInitiationForm") &&
                  getIn(formik.errors, "siteInitiationForm")}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          <Grid item sm={12} md={5} sx={{ pb: 2 }}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ pb: 0.5 }}
            >
              E-Consent Configuration
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              error={Boolean(getIn(formik.errors, "eConsentForm"))}
            >
              <Select
                displayEmpty
                name={"eConsentForm"}
                value={getIn(formik.values, "eConsentForm")}
                onChange={formik.handleChange}
                fullWidth={true}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em style={{ color: "#aaa", fontStyle: "normal" }}>
                    Select E-Consent Configuration
                  </em>
                </MenuItem>
                <MenuItem value="subject_enrollment_forms">
                  Metastatic Melanoma E-Consent Configuration
                </MenuItem>
                <MenuItem value="second-subject_enrollment_forms">
                  Second E-Consent Configuration
                </MenuItem>
              </Select>
              <FormHelperText>
                {getIn(formik.touched, "eConsentForm") &&
                  getIn(formik.errors, "eConsentForm")}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          <Grid item sm={12} md={5} sx={{ pb: 2 }}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
              sx={{ pb: 0.5 }}
            >
              CRF Configuration
            </Typography>
            <FormControl
              sx={{ width: "100%" }}
              error={Boolean(getIn(formik.errors, "crfForm"))}
            >
              <Select
                displayEmpty
                name={"crfForm"}
                value={getIn(formik.values, "crfForm")}
                onChange={formik.handleChange}
                fullWidth={true}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em style={{ color: "#aaa", fontStyle: "normal" }}>
                    Select CRF Configuration
                  </em>
                </MenuItem>
                <MenuItem value="crf_configuration_forms">
                  Metastatic Melanoma CRF Configuration
                </MenuItem>
                <MenuItem value="second-crf_configuration_forms">
                  Second CRF Configuration
                </MenuItem>
              </Select>
              <FormHelperText>
                {getIn(formik.touched, "crfForm") &&
                  getIn(formik.errors, "crfForm")}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item sm={12} sx={{ pb: 2, py: 2 }}>
            <Divider />
          </Grid>
          <Grid item sm={0} md={1}></Grid>
          {formik.values.theraeupticAgents.map((_, index) => {
            return (
              <Grid
                container
                direction={{ md: "row", sm: "column" }}
                // columnSpacing={3}
                sx={{ py: 1.5 }}
                key={index}
              >
                <Grid item sm={12} md={5}>
                  <TextFieldContainer
                    name={`theraeupticAgents.${index}.agentName`}
                    placeholder={"Enter Name of Therapeutic Agent"}
                    label={"Name of Therapeutic Agent"}
                    formik={formik}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                    sx={{ pb: 0.5 }}
                  >
                    Class of Therapeutic Agent
                  </Typography>
                  <FormControl
                    sx={{ width: "100%" }}
                    error={Boolean(getIn(formik.errors, "siteInitiationForm"))}
                  >
                    <Select
                      displayEmpty
                      name={`theraeupticAgents.${index}.agentClass`}
                      value={getIn(
                        formik.values,
                        `theraeupticAgents.${index}.agentClass`
                      )}
                      onChange={formik.handleChange}
                      fullWidth={true}
                      input={<OutlinedInput size="small" />}
                    >
                      <MenuItem disabled value="">
                        <em style={{ color: "#aaa", fontStyle: "normal" }}>
                          Select Class of Therapeutic Agent
                        </em>
                      </MenuItem>
                      <MenuItem value="Oral">Oral</MenuItem>
                      <MenuItem value="Injectable">Injectable</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    <FormHelperText>
                      {getIn(
                        formik.touched,
                        `theraeupticAgents.${index}.agentClass`
                      ) &&
                        getIn(
                          formik.errors,
                          `theraeupticAgents.${index}.agentClass`
                        )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={1}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",

                      pt: 3.5,
                    }}
                  >
                    {index <= 0 &&
                      formik.values.theraeupticAgents.length !== 3 && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (formik.values.theraeupticAgents.length < 3) {
                              formik.values.theraeupticAgents.push(
                                theraeupticAgents
                              );
                              formik.setFieldValue(
                                "theraeupticAgents",
                                formik.values.theraeupticAgents
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
                          formik.values.theraeupticAgents.splice(index, 1);
                          formik.setFieldValue(
                            "theraeupticAgents",
                            formik.values.theraeupticAgents
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrialDetailsSection;
