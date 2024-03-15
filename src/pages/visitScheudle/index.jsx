import { Box, Grid, Typography, useTheme } from "@mui/material";
import ScheduleFilter from "./ScheduleFilter";
import ScheduleCalendar from "./ScheduleCalendar";
import CustomButton from "../../components/@extended/CustomButton";
import AddSchedule from "./AddSchedule";
import { useEffect, useMemo, useState } from "react";
import {
  bloqcibeApi,
  useAddCommentOnScheduleEventMutation,
  useCreateScheduleMutation,
  useGetOngoingTrialsQuery,
  useGetScheduleMutation,
  useUpdateScheduleMutation,
} from "../../store/slices/apiSlice";
import moment from "moment";
import { useSelector } from "react-redux";
import _ from "lodash";
import { getUserRole } from "../util";
import { selectCurrentUser } from "../../store/slices/authSlice";

const _getScheduleObj = (schedule, trial, site) => {
  let startDateWithoutTimezone = schedule.startDate.slice(0, -5);
  let endDateWithoutTimezone = schedule.endDate.slice(0, -5);

  return {
    scheduleId: schedule.id,
    start: moment(startDateWithoutTimezone).toDate(),
    end: moment(endDateWithoutTimezone).toDate(),
    title: schedule.title,
    users: schedule.participants,
    // color: getSeriesColor(9),
    comments: schedule.comments,
    trial,
    site,
  };
};

const VisitSchedule = (props) => {
  const theme = useTheme();
  const [openAddSchedule, setOpenAddSchedule] = useState(false);
  const sponsorId = useSelector((state) => state.auth?.sponsorId);
  const [createSchedule] = useCreateScheduleMutation();
  const [getSchedule] = useGetScheduleMutation();
  const { data: ongoingTrials } = useGetOngoingTrialsQuery(sponsorId);
  const [getTrialSiteDetails] =
    bloqcibeApi.endpoints.getTrialSiteDetails.useLazyQuery();
  const [getTrialSiteMembers] =
    bloqcibeApi.endpoints.getTrialSiteMembers.useLazyQuery();
  const [getSubjectList] = bloqcibeApi.endpoints.getSubjectList.useLazyQuery();
  const [addCommentOnScheduleEvent] = useAddCommentOnScheduleEventMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [getOneSchedule] = bloqcibeApi.endpoints.getOneSchedule.useLazyQuery();
  const [siteList, setSiteList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [selectedUserList, setSelectedUserList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [visibleDateRange, setVisibleDateRange] = useState({
    start: null,
    end: null,
  });
  const [calanderEvents, setCalanderEvents] = useState([]);
  const [selectedTrialId, setSelectedTrialId] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const loggedinUserId = useSelector(
    (state) => state.userDetails?.loggedInUser?.id
  );

  const user = useSelector(selectCurrentUser);
  const userRole = getUserRole(user);

  const onAddSchedule = async (value) => {
    const schedule = await createSchedule({
      trialId: value.trialId,
      siteId: value.siteId,
      payload: {
        title: value.title,
        startDate: moment(new Date(value.startDateTime)).format(
          "MM-DD-YYYYTHH:mm"
        ),
        endDate: moment(new Date(value.endDateTime)).format("MM-DD-YYYYTHH:mm"),
        participants: [...value.user],
      },
    });
    if (
      schedule.data &&
      selectedTrialId === value.trialId &&
      selectedSite.id === value.siteId
    ) {
      const trial = ongoingTrials.find(
        (_trial) => _trial.id === schedule.data.trialId
      );

      const site = siteList?.find((_site) => _site.id === schedule.data.siteId);

      const updatedSchedule = _getScheduleObj(schedule.data, trial, site);

      let _calenderEvents = calanderEvents.filter(
        (_event) => _event.scheduleId !== updatedSchedule.scheduleId
      );

      setCalanderEvents([..._calenderEvents, updatedSchedule]);
    }
    setOpenAddSchedule(false);
  };

  const onUpdateSchedule = async (values, event) => {
    const schedule = await updateSchedule({
      trialId: event.trial.id,
      siteId: event.site.id,
      scheduleId: event.scheduleId,
      payload: {
        startDate: moment(new Date(values.startDateTime)).format(
          "MM-DD-YYYYTHH:mm"
        ),
        endDate: moment(new Date(values.endDateTime)).format(
          "MM-DD-YYYYTHH:mm"
        ),
        participants: [...values.user],
      },
    });
    if (
      schedule.data &&
      selectedTrialId === schedule.data.trialId &&
      selectedSite.id === schedule.data.siteId
    ) {
      const trial = ongoingTrials.find(
        (_trial) => _trial.id === schedule.data.trialId
      );

      const site = siteList?.find((_site) => _site.id === schedule.data.siteId);

      const updatedSchedule = _getScheduleObj(schedule.data, trial, site);

      let _calenderEvents = calanderEvents.filter(
        (_event) => _event.scheduleId !== updatedSchedule.scheduleId
      );

      setCalanderEvents([..._calenderEvents, updatedSchedule]);
    }
    console.log(schedule.data);
  };

  const onClose = () => {
    setOpenAddSchedule(false);
  };

  const _fetchEvents = async (trialId, visibleDateRange, _site) => {
    const response = await getSchedule({
      trialId: trialId,
      payload: {
        loggedinUserId,
        siteId: _site.id,
        startDate: visibleDateRange.start,
        endDate: visibleDateRange.end,
      },
    });
    if (response.data) {
      const scheduleEvents = response.data.map((_event, index) => {
        const trial = ongoingTrials?.find(
          (_trial) => _trial.id === _event.trialId
        );
        return _getScheduleObj(_event, trial, _site);
      });
      setCalanderEvents(scheduleEvents);
    }
  };

  const handleAddComment = async (payload) => {
    const response = await addCommentOnScheduleEvent(payload);
    if (response.data) {
      const schedule = await getOneSchedule(response.data.scheduleId);

      const trial = ongoingTrials.find(
        (_trial) => _trial.id === schedule.data.trialId
      );

      const site = siteList?.find((_site) => _site.id === schedule.data.siteId);

      const updatedSchedule = _getScheduleObj(schedule.data, trial, site);

      let _calenderEvents = calanderEvents.filter(
        (_event) => _event.scheduleId !== updatedSchedule.scheduleId
      );

      setCalanderEvents([..._calenderEvents, updatedSchedule]);
    }
  };

  useEffect(() => {
    if (ongoingTrials && ongoingTrials.length !== 0) {
      setSelectedTrialId(ongoingTrials[0].id);
    }
  }, [ongoingTrials]);

  useEffect(() => {
    (async () => {
      if (selectedTrialId && visibleDateRange) {
        const _siteList = await getTrialSiteDetails({
          sponsorId,
          trialId: selectedTrialId,
        });
        let site = selectedSite;
        if (_siteList?.data) {
          const _list = _siteList.data.map((_site) => {
            return { siteName: _site?.site?.orgname, id: _site.siteId };
          });
          setSiteList(_list);
          setSelectedSite(_list[0]);
          if (
            !selectedSite.id ||
            _list.includes((site) => site.id !== selectedSite.id)
          ) {
            setSelectedSite(_list[0]);
            site = _list[0];
          }
          await _fetchEvents(selectedTrialId, visibleDateRange, site);
        }
      }
    })();
  }, [selectedTrialId, visibleDateRange]);

  useEffect(() => {
    (async () => {
      if (selectedSite && selectedTrialId) {
        const _userList = await getTrialSiteMembers({
          sponsorId,
          trialId: selectedTrialId,
          siteId: selectedSite.id,
        });

        if (_userList?.data) {
          const _list = _.filter(
            _userList.data,
            (user) => user.userId !== null
          ).map((_user) => {
            return {
              label: `${_user.user.firstName} ${_user.user.lastName}`,
              value: _user.userId,
            };
          });
          if (selectedUserList.length !== 0) {
            const _selectedUsers = _.filter(_list, (_user) =>
              _.includes(selectedUserList, _user.value)
            ).map((_user) => _user.value);
            setSelectedUserList(_selectedUsers);
          } else {
            setSelectedUserList([]);
          }
          setUserList(_list);
        }

        const _subjectList = await getSubjectList({
          sponsorId,
          trialId: selectedTrialId,
          siteId: selectedSite.id,
        });

        if (_subjectList?.data) {
        const _list1 = _.filter(
            _subjectList.data,
            (user) =>
              user.userId !== null &&
              _.every(user.stepStatus, (step) => step.status !== "Pending")
          ).map((_user) => {
            return { subjectName: _user.subjectName, id: Number(_user.userId) };
          });

          setSubjectList(_list1);
        }

        await _fetchEvents(selectedTrialId, visibleDateRange, selectedSite);
      }
    })();
  }, [selectedSite, selectedTrialId]);

  const _events = useMemo(() => {
    if (calanderEvents && selectedUserList.length === 0) {
      return calanderEvents;
    } else {
      const filteredEvents = calanderEvents.filter((event) => {
        let userEvent = _.some(event.users, (participant) =>
          selectedUserList.includes(participant.userId)
        );
        if (userEvent) return event;
      });
      return filteredEvents;
    }
  }, [calanderEvents, selectedUserList]);

  return (
    <Grid container>
      <Grid item sm={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 3,
            paddingLeft: 0,
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Schedule
          </Typography>
          <Box sx={{ display: "flex", columnGap: 2 }}>
            <CustomButton
              variant="contained"
              //onClick={() => setOpenAddSchedule(true)}
            >
              <Typography
                variant="subtitle1"
                color={theme.palette.common.white}
              >
                Export
              </Typography>
            </CustomButton>
            {!_.includes(["site_monitor","site_admin","subject"],  userRole) && (
              <CustomButton
                variant="contained"
                onClick={() => setOpenAddSchedule(true)}
              >
                <Typography
                  variant="subtitle1"
                  color={theme.palette.common.white}
                >
                  + Schedule Visit
                </Typography>
              </CustomButton>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item sm={3}>
        <ScheduleFilter
          trials={ongoingTrials}
          selectedTrialId={selectedTrialId}
          setSelectedTrialId={setSelectedTrialId}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          siteList={siteList}
          userList={userList}
          subjectList={subjectList}
          selectedUserList={selectedUserList}
          setSelectedUserList={setSelectedUserList}
        />
      </Grid>
      <Grid item sm={9}>
        <ScheduleCalendar
          handleAddComment={handleAddComment}
          handleUpdateSchedule={onUpdateSchedule}
          visibleRange={visibleDateRange}
          setVisibleRange={setVisibleDateRange}
          events={_events}
        />
      </Grid>
      <AddSchedule
        open={openAddSchedule}
        handleClose={onClose}
        onAddSchedule={onAddSchedule}
      />
    </Grid>
  );
};
export default VisitSchedule;
