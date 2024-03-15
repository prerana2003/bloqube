// material-ui
import { Box, useMediaQuery } from "@mui/material";

// project import
import Profile from "./profile/Profile";
import Notification from "./Notification";
import MobileSection from "./MobileSection";

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <>
      {matchesXs && <Box sx={{ width: "100%", ml: 1 }} />}

      <Notification />
      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
