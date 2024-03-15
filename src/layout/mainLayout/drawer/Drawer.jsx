import PropTypes from "prop-types";
import { useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Drawer, useMediaQuery } from "@mui/material";

// project import
import DrawerHeader from "./drawerHeader/DrawerHeader";
import DrawerContent from "./drawerContent";
import MiniDrawerStyled from "./MiniDrawerStyled";
import { drawerWidth } from "../../../config";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle, window }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  // responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

  return (
    <>
      {!matchDownMD ? (
        <MiniDrawerStyled variant="permanent" open={open}>
          {/* {drawerHeader} */}
          <DrawerContent open={open} handleDrawerToggle={handleDrawerToggle} />
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: "none",
              boxShadow: "inherit",
            },
          }}
        >
          {open && drawerHeader}
          {open && (
            <DrawerContent
              open={open}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}
        </Drawer>
      )}
    </>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.object,
};

export default MainDrawer;
