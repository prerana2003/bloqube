import { Box, Container, Tooltip, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { getSeriesColor } from "../../util/util";
import { useEffect, useState } from "react";
import UpdateSchedule from "./UpdateSchedule";
import { generateColorHex } from "../util";
import SubjectEvents from "./SubjectEvents";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";

const localizer = momentLocalizer(moment);

const MyEvent = ({ event }) => {
  const Dot = ({ name }) => {
    return (
      <Tooltip title={name} arrow>
        <Box
          sx={{
            height: 10,
            width: 10,
            backgroundColor: generateColorHex(name),
            borderRadius: "50%",
            margin: 0.5,
          }}
        />
      </Tooltip>
    );
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{ overflow: "hidden", textOverflow: "ellipsis", width: "80%" }}
      >
        <Typography variant="caption">{event.title}</Typography>
      </Box>
      <Box sx={{ display: "flex", ml: "auto" }}>
        {event.users.map((_user, index) => (
          <Dot key={`${index}dot`} name={`${_user?.user?.firstName} ${_user?.user?.lastName}`} />
        ))}
      </Box>
    </Box>
  );
};

const ScheduleCalendar = (props) => {
  const { setVisibleRange, events, handleAddComment, handleUpdateSchedule } = props;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const subjectLoggedIn = useSelector((state) => state.auth.subjectLoggedIn);
  const [openUpdateSchedule, setOpenUpdateSchedule] = useState(false);
  const [openSubjectEvents, setOpenSubjectEvents] = useState(false);
  const navigate = useNavigate()
  const {scheduleId} = useParams()

  const handleViewChange = ({ start, end }) => {
    setVisibleRange({
      start: moment(start).format("MM-DD-YYYYTHH:mm"),
      end: moment(end).format("MM-DD-YYYYTHH:mm"),
    });
  };

  // Function to calculate the initial visible range based on the current date and view
  const calculateInitialVisibleRange = (currentDate, view) => {
    if (view) {
      const startOfMonth = moment(currentDate).startOf(view);
      const endOfMonth = moment(currentDate).endOf(view);
      return { start: startOfMonth, end: endOfMonth };
    } else {
      const startOfMonth = moment(currentDate).startOf("month");
      const endOfMonth = moment(currentDate).endOf("month");
      return { start: startOfMonth, end: endOfMonth };
    }
  };

  useEffect(() => {
    // Get the current date and selected view
    const currentDate = moment();
    const selectedView = "month"; // You can change this to the default view you want

    // Calculate the initial visible range based on the current date and selected view
    const initialVisibleRange = calculateInitialVisibleRange(
      currentDate,
      selectedView
    );

    // Call the handleViewChange function with the initial visible range
    handleViewChange(initialVisibleRange);
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const updatedEvent = events.find(
        (_event) => _event.scheduleId === selectedEvent.scheduleId
      );
      setSelectedEvent(updatedEvent);
    }
  }, [events]);

  useEffect(() => {
    if (events.length !== 0 && scheduleId) {
      const updatedEvent = events.find(
        (_event) => _event.scheduleId === Number(scheduleId)
      );
      if (updatedEvent){ setSelectedEvent(updatedEvent);
      setOpenUpdateSchedule(true)}
    }
  }, [scheduleId,events]);

  const onUpdateSchedule = (values,event) => {
    setOpenUpdateSchedule(false);
    handleUpdateSchedule(values, event);
  };
  const onClose = () => {
    setSelectedEvent(null);
    setOpenUpdateSchedule(false);
    navigate(`/schedule`);
  };
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    if(subjectLoggedIn) {
      setOpenSubjectEvents(true);
    } else {
      setOpenUpdateSchedule(true);
      navigate(`/schedule/${event.scheduleId}`);
    }
  };

  const handleRangeChange = (range, view) => {
    switch (view) {
      case "month":
        handleViewChange({ start: range?.start, end: range?.end });
        break;
      case "week":
        handleViewChange({ start: range[0], end: range[6] });
        break;
      case "day":
        handleViewChange({
          start: moment(range[0]).startOf("week").toDate(),
          end: moment(range[0]).endOf("week").toDate(),
        });
        break;
      default:
        if (range?.length === 7) {
          handleViewChange({ start: range[0], end: range[6] });
        } else if (range?.length === 1) {
          handleViewChange({
            start: moment(range[0]).startOf("week").toDate(),
            end: moment(range[0]).endOf("week").toDate(),
          });
        } else if(range?.start && range?.end) {
          handleViewChange({ start: range?.start, end: range?.end });
        }
        break;
    }
  };

  return (
    <Container>
      <Calendar
        localizer={localizer}
        events={events && events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={subjectLoggedIn ? ['month', 'week', 'day'] : ['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleEventSelect}
        onRangeChange={handleRangeChange}
        style={{ height: "calc(100vh - 250px)" }}
        components={{
          event: MyEvent,
        }}
      />
      {openUpdateSchedule && (
        <UpdateSchedule
          open={openUpdateSchedule}
          handleClose={onClose}
          handleUpdateSchedule={onUpdateSchedule}
          handleAddComment={handleAddComment}
          event={selectedEvent}
        />
      )}
      {openSubjectEvents && (
        <SubjectEvents
          open={openSubjectEvents}
          handleClose={onClose}
          event={selectedEvent}
        />
      )}
    </Container>
  );
};

export default ScheduleCalendar;
