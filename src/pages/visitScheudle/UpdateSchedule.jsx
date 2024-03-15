import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  List,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Field, Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import dayjs from "dayjs";
import DateTimeField from "./FormikDateField";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Edit } from "@mui/icons-material";
import { bloqcibeApi } from "../../store/slices/apiSlice";
import FormikMultiSelect from "./FormikMultiselect";
import _ from "lodash";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const UpdateSchedule = ({
  handleUpdateSchedule,
  handleClose,
  open,
  event,
  handleAddComment,
}) => {
  const theme = useTheme();
  const docSchema = Yup.object().shape({
    user: Yup.array()
      .min(1, "At least one option is required")
      .required("Required"),
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
  const [getTrialSiteMembers] =
    bloqcibeApi.endpoints.getTrialSiteMembers.useLazyQuery();
  const [comment, setComment] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [userList, setUserList] = useState([]);
  const loggedInUser = useSelector((state) => state?.userDetails?.loggedInUser);
  const sponsorId = useSelector((state) => state.auth.sponsorId);

  const onCloseModal = () => {
    // formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    (async () => {
      const _userList = await getTrialSiteMembers({
        sponsorId,
        trialId: event?.trial.id,
        siteId: event?.site.id,
      });
      if (_userList?.data) {
        const _list = _userList.data.map((_user) => ({
          label: `${_user.user.firstName} ${_user.user.lastName}`,
          value: _user.userId,
          role: _user.role,
        }));
        setUserList(_list);
      }
    })();
  }, [openEdit]);

  const participantIds = useMemo(() => {
    if (event) {
      return _.filter(
        event.users,
        (participant) => participant.role !== "subject"
      ).map((user) => user.userId);
    }
  }, [event]);

  const subjectParticipant = useMemo(() => {
    return _.find(event?.users, (user) => user.role === "subject");
  }, [event]);

  const adminParticipant = useMemo(() => {
    return _.filter(event?.users, (user) => user.role !== "subject");
  }, [event]);

  const _handleAddComment = async () => {
    if (comment.trim() !== "") {
      await handleAddComment({
        scheduleId: event.scheduleId,
        payload: { comment: comment, commentedByUserId: loggedInUser.id },
      });
      setComment("");
    }
  };

  const handleFormSubmit = (values) => {
    let participants = values.user.map((userId) => {
      let _user = _.find(userList, (user) => user.value === userId);
      if (_user) {
        return {
          id: userId,
          role: _user.role,
        };
      }
    });
    const subjectParticipant = _.filter(
      event.users,
      (participant) => participant.role === "subject"
    ).map((user) => {
      return { id: user.userId, role: user.role };
    });
    participants = _.concat(participants, subjectParticipant);
    const _values = values;
    _values["user"] = participants;
    handleUpdateSchedule(_values, event);
  };

  return (
    <>
      <Formik
        initialValues={{
          user: participantIds,
          startDateTime: dayjs(event?.start),
          endDateTime: dayjs(event?.end),
        }}
        validationSchema={docSchema}
        enableReinitialize={true}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          console.log(values);
          handleFormSubmit(values);
          // resetForm();
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          errors,
        }) => (
          <Dialog scroll={"paper"} open={open} onClose={onCloseModal}>
            <DialogTitle>{event?.title}</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setOpenEdit(!openEdit)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Edit />
            </IconButton>
            <DialogContent>
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="initial"
                        sx={{ fontWeight: 600, pr: 2 }}
                      >
                        Trial:
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.grey[900] }}
                      >
                        {event?.trial?.protocolNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="initial"
                        sx={{ fontWeight: 600, pr: 2 }}
                      >
                        Site:
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.grey[900] }}
                      >
                        {event?.site?.siteName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="initial"
                        sx={{ fontWeight: 600, pr: 2 }}
                      >
                        Subject:
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.grey[900] }}
                      >
                        {subjectParticipant &&
                          `${subjectParticipant?.user?.firstName} ${subjectParticipant?.user?.lastName}`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="initial"
                        sx={{ fontWeight: 600, pr: 2 }}
                      >
                        Users:
                      </Typography>
                      {openEdit ? (
                        <FormikMultiSelect
                          name="user"
                          label="Select Users"
                          options={userList}
                          size="small"
                        />
                      ) : (
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.palette.grey[900] }}
                        >
                          {adminParticipant &&
                            adminParticipant
                              .map((participant) => {
                                return `${participant?.user?.firstName} ${participant?.user?.lastName}`;
                              })
                              .join(", ")}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      label="Start Date Time"
                      name="startDateTime"
                      disabled={!openEdit}
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
                      disabled={!openEdit}
                      inputProps={{
                        name: "endDateTime",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        width: "100%",
                        border: "0.5px solid grey",
                        borderRadius: 1,
                        p: 1,
                        pb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, pl: 1 }}
                      >
                        Comments
                      </Typography>
                      <Divider />
                      <Box
                        sx={{
                          width: "100%",
                          height: 180,
                          overflowY: "scroll",
                          "&::-webkit-scrollbar": {
                            width: "0.4em",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,.1)",
                            borderRadius: 4,
                            //outline: '1px solid slategrey'
                          },
                        }}
                      >
                        {event?.comments.length === 0 && (
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              color="gray[500]"
                              pt={1}
                            >
                              No Comments.
                            </Typography>
                          </Box>
                        )}
                        <List
                          sx={{ width: "100%", bgcolor: "background.paper" }}
                        >
                          {event?.comments &&
                            event?.comments.map((_comment) => (
                              <ListItem
                                key={_comment.id}
                                style={{ paddingTop: 0, paddingBottom: 0 }}
                              >
                                <ListItemText
                                  primary={
                                    <div
                                      style={{
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                      }}
                                      dangerouslySetInnerHTML={{
                                        __html: `${_comment.comment}`,
                                      }}
                                    />
                                  }
                                  secondary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography variant="caption">
                                        {`${_comment?.commentedBy?.firstName} ${_comment?.commentedBy?.lastName}`}
                                      </Typography>
                                      <Box
                                        sx={{ display: "flex", columnGap: 1 }}
                                      >
                                        <Typography variant="caption">
                                          {moment(_comment?.createdAt).format(
                                            "MM-DD-YYYY HH:mm"
                                          )}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                      <Box sx={{ display: "flex", pt: 1 }}>
                        <Box
                          sx={{
                            pr: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Avatar></Avatar>
                        </Box>
                        <TextField
                          fullWidth
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Enter Comment"
                          type="text"
                          disabled={openEdit}
                        />
                        <IconButton
                          sx={{ ml: 1 }}
                          onClick={_handleAddComment}
                          disabled={openEdit}
                        >
                          <SendRoundedIcon
                            sx={{
                              fontSize: 35,
                              ":hover": { color: theme.palette.primary.main },
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            </DialogContent>
            <DialogActions>
              {openEdit && <Button onClick={() => handleSubmit()}>Save</Button>}
              <Button onClick={onCloseModal}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </>
  );
};

export default UpdateSchedule;
