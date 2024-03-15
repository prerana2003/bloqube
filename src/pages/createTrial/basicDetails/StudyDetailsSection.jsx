import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  useTheme,
  Typography,
  OutlinedInput,
  FormHelperText,
  Select,
  FormControl,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import React from "react";
import TextFieldContainer from "../../../components/inputContainers/TextFieldContainer";
import { getIn } from "formik";
import { RemoveOutlined } from "@mui/icons-material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useUpdateTrialStudyDetailMutation } from "../../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/@extended/CustomButton";

const StudyDetailsSection = ({
  formik,
  testArticles,
  openMessageNotification,
}) => {
  const theme = useTheme();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [updateTrialStudyDetail] = useUpdateTrialStudyDetailMutation();

  const handleUpdate = () => {
    let studyDetail = formik.values.studyDetail;
    updateTrialStudyDetail({
      sponsorId,
      trialId: studyDetail.trialId,
      studyDetail: { studyDetail: studyDetail },
    });
    openMessageNotification({
      message: "Submitted Successfully",
      type: "success",
    });
  };

  const frequencyOfAdministration = [
    {
      label: "BD (Twice a day)",
      value: "BD",
    },
    {
      label: "TDS (Three times a day)",
      value: "TDS",
    },
    {
      label: "Qid (Four times a day)",
      value: "Qid",
    },
    {
      label: "Eod (Every day / Once a day)",
      value: "Eod",
    },
    {
      label: "Q1d (Every other day)",
      value: "Q1d",
    },
  ];
  return (
    <Card>
      <CardHeader
        title={"Study Details"}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"studyDetail.studyType"}
              placeholder={"Enter study type"}
              label={"Study Type"}
              formik={formik}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"studyDetail.treatmentNumber"}
              placeholder={"Enter number of treatments"}
              label={"Number of Treatments"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} md={4} sx={{ pb: 2, pr: 5 }}>
            <TextFieldContainer
              name={"studyDetail.totalTreatmentDuration"}
              placeholder={"Enter treatment duration"}
              label={"Total Treatment Duration (months)"}
              formik={formik}
              type={"number"}
            />
          </Grid>
          <Grid item sm={12} pt={3}>
            <Typography fontSize={18} color={theme.palette.text.primary}>
            Investigational Products
            </Typography>
          </Grid>
          {formik.values.studyDetail.testArticles.map((_, index) => {
            return (
              <Grid container sx={{ py: 1.5 }} key={index}>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <TextFieldContainer
                    name={`studyDetail.testArticles.${index}.drugName`}
                    placeholder={"Enter name of drug"}
                    label={"Name of Drug"}
                    formik={formik}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <TextFieldContainer
                    name={`studyDetail.testArticles.${index}.drugClass`}
                    placeholder={"Enter class of drug"}
                    label={"Class of Drug"}
                    formik={formik}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <TextFieldContainer
                    name={`studyDetail.testArticles.${index}.dosage`}
                    placeholder={"Enter dosage"}
                    label={"Dosage (In mg)"}
                    formik={formik}
                    type={"number"}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <TextFieldContainer
                    name={`studyDetail.testArticles.${index}.routesOfAdministration`}
                    placeholder={"Enter route"}
                    label={"Routes of Administation"}
                    formik={formik}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <TextFieldContainer
                    name={`studyDetail.testArticles.${index}.duration`}
                    placeholder={"Enter Duration"}
                    label={"Duration (In hours)"}
                    formik={formik}
                    type={"number"}
                  />
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} md={5} sx={{ py: 1 }}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                    sx={{ pb: 0.5 }}
                  >
                    Frequency of Administration
                  </Typography>
                  <FormControl
                    sx={{ width: "100%" }}
                    error={Boolean(
                      getIn(
                        formik.errors,
                        `studyDetail.testArticles.${index}.frequencyOfAdministration`
                      )
                    )}
                  >
                    <Select
                      name={`studyDetail.testArticles.${index}.frequencyOfAdministration`}
                      value={getIn(
                        formik.values,
                        `studyDetail.testArticles.${index}.frequencyOfAdministration`
                      )}
                      onChange={formik.handleChange}
                      fullWidth={true}
                      placeholder={"Frequency of Administration"}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      input={<OutlinedInput size="small" />}
                    >
                      <MenuItem disabled value="">
                        <em>Frequency of Administration</em>
                      </MenuItem>
                      {frequencyOfAdministration.map((option) => {
                        return (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {getIn(
                        formik.touched,
                        `studyDetail.testArticles.${index}.frequencyOfAdministration`
                      ) &&
                        getIn(
                          formik.errors,
                          `studyDetail.testArticles.${index}.frequencyOfAdministration`
                        )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item sm={0} md={1}></Grid>
                <Grid item sm={12} sx={{ py: 2 }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    {formik.values.studyDetail.testArticles.length ===
                      index + 1 && (
                      <Button
                        size="large"
                        variant="outlined"
                        onClick={() => {
                          if (
                            formik.values.studyDetail.testArticles.length < 3
                          ) {
                            formik.values.studyDetail.testArticles.push(
                              testArticles
                            );
                            formik.setFieldValue(
                              "studyDetail.testArticles",
                              formik.values.studyDetail.testArticles
                            );
                          }
                        }}
                        startIcon={
                          <AddOutlinedIcon
                            fontSize={"18"}
                            color={theme.palette.common.white}
                          />
                        }
                        sx={{ mr: 2 }}
                      >
                        <Typography variant="subtitle1">Add Product</Typography>
                      </Button>
                    )}
                    {index > 0 && (
                      <Button
                        aria-label="delete"
                        size="large"
                        variant="outlined"
                        onClick={() => {
                          formik.values.studyDetail.testArticles.splice(
                            index,
                            1
                          );
                          formik.setFieldValue(
                            "trialDetails.theraputicAgent",
                            formik.values.studyDetail.testArticles
                          );
                        }}
                        sx={{ ml: 2 }}
                      >
                        <RemoveOutlined
                          fontSize="inherit"
                          color={theme.palette.common.white}
                        />
                        <Typography variant="subtitle1">
                          Remove Article
                        </Typography>
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item sm={12}>
                  {formik.values.studyDetail.testArticles.length !==
                    index + 1 && <Divider />}
                </Grid>
              </Grid>
            );
          })}

          {formik.values.studyDetail.id && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid
                item
                sm={12}
                md={12}
                sx={{
                  py: 2,
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
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StudyDetailsSection;
