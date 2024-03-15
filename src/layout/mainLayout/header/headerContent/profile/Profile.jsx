import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import {  useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

// project import
import MainCard from "../../../../../components/MainCard";
import Transitions from "../../../../../components/@extended/Transitions";

// assets
import avatar3 from "../../../../../assets/images/users/avatar-3.png";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonIcon from "@mui/icons-material/Person";
import { convertToTitleCase } from "../../../../../pages/util";
import CustomButton from "../../../../../components/@extended/CustomButton";
import { useResponsive } from "../../../../../hooks/ResponsiveProvider";
import { subjectDashboardDetails } from "../../../../../store/slices/subjectSlice";
import { base64ToArrayBuffer } from "../../../../../components/common/DocumentUpload";
import { bloqcibeApi } from "../../../../../store/slices/apiSlice";

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const userDetails = useSelector((state) => state.userDetails);
    const { isSmallScreen } = useResponsive();
  const given_name = user?.given_name;
  const subjectDashboardInfo = useSelector(subjectDashboardDetails);
  const subjectLoggedIn = useSelector((state) => state.auth.subjectLoggedIn);
  const [downloadSubjectProfilePic] =
        bloqcibeApi.endpoints.downloadSubjectProfilePic.useLazyQuery();
  const [imageSrc, setImageSrc] = useState('');
  const role = user?.details[0][0].role
    ? convertToTitleCase(user?.details[0][0].role)
    : "";
  const handleLogout = async () => {
    localStorage.clear();
    window?.location.replace(`/login`);
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    if (!isSmallScreen) setOpen((prevOpen) => !prevOpen);
  };
  useEffect(() => {
    (async () => {
        if(subjectLoggedIn && subjectDashboardInfo?.subjectDetail?.profilePic) {
            const result = await downloadSubjectProfilePic({
                s3Key: subjectDashboardInfo?.subjectDetail?.profilePic,
            });
            if (result.data) {
                const byteArray = base64ToArrayBuffer(result.data);
                const rr = new Blob([byteArray], { type: "application/octet-stream" });
                const reader = new FileReader();
                reader.readAsDataURL(rr);
                reader.onloadend = function () {
                    const base64data = reader.result;
                    setImageSrc(base64data);
                };
            }
        }
    })();
}, [subjectDashboardInfo])

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = "grey.300";

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : "transparent",
          borderRadius: 1,
          "&:hover": { bgcolor: "secondary.lighter" },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar
            alt="profile user"
            //src={avatar3}
            src={imageSrc ? imageSrc : avatar3}
            sx={{ width: 32, height: 32 }}
          />
          <Stack direction="column" alignItems="center">
            <Typography variant="subtitle1">Welcome, {given_name}</Typography>
            <Typography variant="caption">
              {userDetails.user?.orgnizationName
                ? `${userDetails.user?.orgnizationName}, `
                : ""}
              {role}
            </Typography>
          </Stack>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 350,
                  [theme.breakpoints.down("md")]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={5} border={false} content={false}>
                    <CardContent>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={12}>
                          <Stack
                            direction="column"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar
                              alt="profile user"
                              src={avatar3}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Stack direction="column" alignItems="center">
                                <Typography variant="subtitle1" py={0.2}>
                                  Welcome, {given_name}
                                </Typography>
                                <Typography variant="caption" py={0.2}>
                                  {userDetails.user?.orgnizationName
                                    ? `${userDetails.user?.orgnizationName}, `
                                    : ""}
                                  {role}
                                </Typography>
                                <Typography variant="body1" pt={0.2}>
                                  {user?.email}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display:'flex', justifyContent:'center',py:2, pt:1 }}>
                      <Button onClick={handleLogout} startIcon={<LogoutOutlinedIcon />} variant="text"><Typography variant="subtitle1" color={theme.palette.primary.main}>Logout</Typography></Button>
                    </Box>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
