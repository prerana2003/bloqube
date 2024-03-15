import { useMemo, useRef, useState } from "react";
// material-ui
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Transitions from "../../../../components/@extended/Transitions";
import { useWebSocket } from "../../../../hooks/WebsocketProvider";

const avatarSX = {
  width: 30,
  height: 30,
  fontSize: "1rem",
};

const actionSX = {
  mt: "6px",
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector((state) => state.notifications)
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const isSubjectLoggedIn = useSelector((state) => state.auth.subjectLoggedIn);
  const socket = useWebSocket();
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMessageClick =async (message) => {
    const content = JSON.parse(message?.content)
    const payload = content?.payload
    if (!message.isRead) await socket.emit("read-message", {messageId: message.id,status: true,});  
    switch (content.action) {
      case "TRIAL_CREATED":
        const path = `/trial/${payload.trialId}`;
        handleNavigate(path);
        break;
      case "VERIFY_SITE_INITIATION":
      case "COMPLETE_SITE_INITIAION":
        const navigationPath = `/trial/${payload?.trialId}/trial-site/${payload?.siteTrialId}/${payload?.stepKey}`
        handleNavigate(navigationPath);
        break;
      case "SITE_INITIATION_COMPLETED":
        const path1 = `/trial/${payload?.trialId}/trial-site/${payload?.siteTrialId}`;
        handleNavigate(path1);
        break;
      case "COMPLETE_SUBJECT_ENROLMENT":
      case "SUBJECT_ENROLMENT_VERIFY":
        const path2 = `/eConcent/${payload?.trialId}/trial-site/${payload?.siteTrialId}/${payload?.stepKey}/${payload?.subjectMasterId}`;
        handleNavigate(path2);
        break;
      case "SCHEDULE":
        const { schedule, trialId, siteId } = content.payload;
        if (isSubjectLoggedIn) {
            const path2 = `/schedule`;
            handleNavigate(path2);
        } else {
            const path3 = `/schedule/${schedule.id}`;
            navigate(path3, { state: { trialId, siteId, schedule } });
        }
      
        break;
      default:
        console.log("message clicked", message);
        break;
    }
    setOpen(false);
  };

  const handleNavigate = (navigationPath) => {
      if (window.location.pathname !== navigationPath) {
        navigate(navigationPath);
      }
  };

  const notificationBadgeCount = useMemo(() => {
  const _data =   notifications.messages.filter((message) => message.isRead === false);
    return _data?.length
  },[notifications])

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          disableRipple
          color="secondary"
          sx={{
            color: "text.primary",
            backgroundColor: theme.palette.common.white,
          }}
          aria-label="open profile"
          ref={anchorRef}
          aria-controls={open ? "profile-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Badge badgeContent={notificationBadgeCount} color="primary">
            <NotificationsOutlinedIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>
      </Box>
      <Popper
        placement={"bottom"}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [100, 7],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: "100%",
                minWidth: 400,
                maxWidth: 500,
                [theme.breakpoints.down("md")]: {
                  maxWidth: 285,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Card elevation={10}>
                  <CardHeader
                    sx={{ p: 2 }}
                    title="Notifications"
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent sx={{ padding:0,minHeight:200, maxHeight:500, overflow:'auto' }}>
                    <List
                      // component="nav"
                      sx={{
                        p: 0,
                        "& .MuiListItemButton-root": {
                          py: 0.5,
                          "& .MuiAvatar-root": avatarSX,
                          "& .MuiListItemSecondaryAction-root": {
                            ...actionSX,
                            position: "relative",
                          },
                        },
                      }}
                    >
                      {notifications.messages.length !== 0 &&
                        notifications?.messages.map((message, index) => {
                          const content = JSON?.parse(message?.content);

                        const createdAt = moment(message.createdAt);
                          const timeDifference = createdAt.fromNow();
                          
                          const includeDate =
                            createdAt.diff(moment(), "days") < -2;
                          const formattedTime = includeDate
                            ? createdAt.format("MMM DD, YYYY [at] HH:mm")
                            : timeDifference;
                          return (
                            <Box key={index}>
                              <ListItem
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: theme.palette.grey[100],
                                  },
                                }}
                                onClick={() => handleMessageClick(message)}
                              >
                                <ListItemAvatar>
                                  <Badge
                                    color="primary"
                                    variant="dot"
                                    invisible={message?.isRead}
                                  >
                                    <Box
                                      sx={{
                                        padding: 1,
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "50%",
                                      }}
                                    >
                                      {content.action === "TRIAL_CREATED" ? (
                                        <TaskAltOutlinedIcon />
                                      ) : content.action ===
                                        "VERIFY_SITE_INITIATION" ? (
                                        <ShieldOutlinedIcon />
                                      ) : content.action ===
                                        "COMPLETE_SITE_INITIATION" ? (
                                        <TodayRoundedIcon />
                                      ) : content.action ===
                                        "SITE_INITIATION_COMPLETED" ? (
                                        <TaskAltOutlinedIcon />
                                      ) : content.action ===
                                        "COMPLETE_SUBJECT_ENROLMENT" ? (
                                        <GppGoodOutlinedIcon />
                                      ) : content.action ===
                                        "SUBJECT_ENROLMENT_VERIFY" ? (
                                        <ShieldOutlinedIcon />
                                      ) : content.action === "SCHEDULE" ? (
                                        <TodayRoundedIcon />
                                      ) : (
                                        <AlternateEmailIcon />
                                      )}
                                    </Box>
                                  </Badge>
                                </ListItemAvatar>

                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                      color={theme.palette.grey[800]}
                                    >
                                      {content?.title}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color={theme.palette.grey[800]}
                                      >
                                        {content.message}
                                      </Typography>
                                      {formattedTime}
                                    </Box>
                                  }
                                />
                                {/* <ListItemSecondaryAction>
                                  <Typography variant="caption" noWrap>
                                    {moment(message?.createdAt).format("HH:mm")}
                                  </Typography>
                                </ListItemSecondaryAction> */}
                              </ListItem>
                              {notifications.messages.length !== index + 1 && (
                                <Divider />
                              )}
                            </Box>
                          );
                        })}
                      {
                        notifications.messages.length === 0 &&
                        <Box sx={{display:'flex', justifyContent:'center', py:2}}><Typography variant="subtitle1" color="grey[800]">No new message.</Typography></Box>
                      }
                    </List>
                  </CardContent>
                </Card>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default Notification;
