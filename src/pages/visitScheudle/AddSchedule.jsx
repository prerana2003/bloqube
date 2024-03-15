import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Field, Form, Formik} from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikField from "./FormikTextField";
import DateTimeField from "./FormikDateField";
import FormikMultiSelect from "./FormikMultiselect";
import {
  bloqcibeApi,
  useGetOngoingTrialsQuery,
} from "../../store/slices/apiSlice";
import { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";

const AddSchedule = ({ onAddSchedule, handleClose, open }) => {
  const sponsorId = useSelector((state) => state.auth?.sponsorId);
  const {
    data: ongoingTrials,
  } = useGetOngoingTrialsQuery(sponsorId);
  const [getTrialSiteDetails] =
    bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
  const [getTrialSiteMembers] =
    bloqcibeApi.endpoints.getTrialSiteMembers.useLazyQuery();
  const [getSubjectList] = bloqcibeApi.endpoints.getSubjectList.useLazyQuery();
  const [siteList, setSiteList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [trial, setTrial] = useState();
  const [site, setSite] = useState();

  const docSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    trialId: Yup.string().required("Trial is required"),
    siteId: Yup.string().required("Site is required"),
    user: Yup.array()
      .min(1, "At least one option is required")
      .required("Required"),
    subjectId: Yup.string().required("Subject is required"),
    startDateTime: Yup.date("Please select or enter valid date")
      .typeError("Please select or enter valid date")
      .required("Date and time are required")
      .test(
        "start-end-date",
        "Start time should be before the end time",
        function (value) {
          const { endDateTime } = this.parent;
          return moment(value).isBefore(endDateTime);
        }
      ),
    endDateTime: Yup.date("Please select or enter valid date")
      .typeError("Please select or enter valid date")
      .required("Date and time are required")
      .test(
        "start-end-date",
        "End time should be after the start time",
        function (value) {
          const { startDateTime } = this.parent;
          return moment(value).isAfter(startDateTime);
        }
      ),
  });

  const onCloseModal = () => {
    // formik.resetForm();
    handleClose();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "trialId") {
      setTrial(value);
    } else if (name === "siteId") {
      setSite(value);
    }
  };

  useEffect(() => {
    (async () => {
      if (trial) {
        const _siteList = await getTrialSiteDetails({
          sponsorId,
          trialId: trial,
        });
        if (_siteList?.data) {
          const _list = _siteList.data.map((_site) => {
            return { siteName: _site.site.orgname, id: _site.siteId };
          });
          setSiteList(_list);
        }
      }
    })();
  }, [trial]);

  useEffect(() => {
    (async () => {
      if (site && trial) {
        const _userList = await getTrialSiteMembers({
          sponsorId,
          trialId: trial,
          siteId: site,
        });
        if (_userList?.data) {
          const _list = _userList.data
            .map((_user) => ({
              label: `${_user.user.firstName} ${_user.user.lastName}`,
              value: _user.userId,
              role: _user.role,
            }));
          setUserList(_list);
        }
        const _subjectList = await getSubjectList({
          sponsorId,
          trialId: trial,
          siteId: site,
        });
        if (_subjectList?.data) {
          const _list = _subjectList.data
            .filter((user) => user.userId !== null && _.every(user.stepStatus, (step) => step.status !== "Pending"))
            .map((_user) => {
              return {
                subjectName: _user.subjectName,
                id: Number(_user.userId),
              };
            });
          setSubjectList(_list);
        }
      }
    })();
  }, [site, trial]);

  const handleFormSubmit = (values) => {
    const participants = values.user.map((userId) => {
      const _user = _.find(userList, (user) => user.value === userId);
      return {
        id: userId,
        role: _user?.role,
      };
    });
    participants.push({ id: Number(values.subjectId) ,role:"subject"});
    const _values = values;
    _values["user"] = participants;
     onAddSchedule(_values);
  }

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          trialId: "",
          siteId: "",
          user: [],
          subjectId: "",
          startDateTime: null,
          endDateTime: null,
        }}
        validationSchema={docSchema}
        onSubmit={(values, { resetForm }) => {
          handleFormSubmit(values);
          resetForm();
        }}
      >
        {({
          isSubmitting,
          handleSubmit,
          handleChange,
          handleBlur,
          resetForm,
          values,
          touched,
          errors,
        }) => (
          <Dialog scroll={"paper"} open={open} onClose={onCloseModal}>
            <DialogTitle>Add Schedule</DialogTitle>
            <DialogContent>
              <Form>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Field
                        component={FormikField}
                        name="title"
                        label="Title"
                        type="text"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={touched.trialId && Boolean(errors.trialId)}
                    >
                      <InputLabel>Trial</InputLabel>
                      <Field
                        component={Select}
                        onChange={(e) => {
                          handleFormChange(e);
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        label="Trial"
                        inputProps={{
                          id: "trialId",
                          name: "trialId",
                        }}
                      >
                        {ongoingTrials &&
                          ongoingTrials.map((trial) => (
                            <MenuItem value={trial.id}>
                              {trial.protocolNumber}
                            </MenuItem>
                          ))}
                      </Field>
                      {touched.trialId && errors.trialId ? (
                        <FormHelperText>{errors.trialId}</FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={touched.siteId && Boolean(errors.siteId)}
                    >
                      <InputLabel>Site</InputLabel>
                      <Field
                        component={Select}
                        onChange={(e) => {
                          handleFormChange(e);
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        label="Site"
                        inputProps={{
                          id: "siteId",
                          name: "siteId",
                        }}
                      >
                        {siteList &&
                          siteList?.map((site) => (
                            <MenuItem value={site.id}>{site.siteName}</MenuItem>
                          ))}
                      </Field>
                      {touched.siteId && errors.siteId ? (
                        <FormHelperText>{errors.siteId}</FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormikMultiSelect
                      name="user"
                      label="Select Users"
                      options={userList}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      error={touched.subjectId && Boolean(errors.subjectId)}
                    >
                      <InputLabel>Subject</InputLabel>
                      <Field
                        component={Select}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        label="Subject"
                        inputProps={{
                          id: "subjectId",
                          name: "subjectId",
                        }}
                      >
                        {subjectList.length !== 0 ? (
                          subjectList?.map((subject) => (
                            <MenuItem value={subject.id} key={subject.id}>
                              {subject.subjectName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value={""}>Select Subject</MenuItem>
                        )}
                      </Field>
                      {touched.subjectId && errors.subjectId ? (
                        <FormHelperText>{errors.subjectId}</FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      label="Start Date Time"
                      name="startDateTime"
                      component={DateTimeField}
                      inputProps={{
                        name: "startDateTime",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      label="End Date Time"
                      name="endDateTime"
                      component={DateTimeField}
                      inputProps={{
                        name: "endDateTime",
                      }}
                    />
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  resetForm();
                  onCloseModal();
                }}
              >
                Close
              </Button>
              <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </>
  );
};

export default AddSchedule;
