import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { AppBar, Box, IconButton, Toolbar, useMediaQuery } from "@mui/material";

// project import
import AppBarStyled from "./AppBarStyled";
import HeaderContent from "./headerContent/HeaderContent";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../components/Logo/Logo";
import { useSelector } from "react-redux";
import SponsorLogo from "../../../components/Logo/SponsorLogo";
import PharmaLogo from "../../../components/Logo/PharmaLogo";
import { useResponsive } from "../../../hooks/ResponsiveProvider";

const Header = ({ open, handleDrawerToggle }) => {
  const key = useSelector((state) => state.userDetails.user?.logoS3Key);
  const sponsorId = useSelector((state) => state.userDetails.user?.id);
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const {isSmallScreen} = useResponsive();
  const iconBackColor = "grey.100";

  // common header
  const mainHeader = (
    <Toolbar>
      <Box sx={{ flexGrow: 1, display: "flex", columnGap: 1 }}>
        {!open && matchDownMD && (
          <IconButton
            disableRipple
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            color="secondary"
            sx={{
              color: "text.primary",
              bgcolor: open ? theme.palette.common.white : iconBackColor,
              ml: { xs: 0, lg: -2 },
            }}
          >
            {!open && !isSmallScreen ? <NavigateNextIcon /> : <MenuIcon />}
          </IconButton>
        )}
        {key && sponsorId ? (
          <SponsorLogo s3Key={key} sponsorId={sponsorId} />
        ) : (
          <PharmaLogo />
        )}
      </Box>
      <HeaderContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.customShadows.z1,
    },
  };

  return (
    <>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

export default Header;
