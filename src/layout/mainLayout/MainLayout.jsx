import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Toolbar, useMediaQuery, Typography } from "@mui/material";

// project import
import Drawer from "./drawer/Drawer";
import Header from "./header/Header";

// types
import { openDrawer } from "../../store/reducers/application";

import { bloqcibeApi, useGetSponsorDetailsQuery, useGetMeUserQuery } from "../../store/slices/apiSlice";
import ShowMessage from "../../components/showMessage/ShowMessage";
import { WebSocketProvider } from "../../hooks/WebsocketProvider";
import { setSubjectLoggedIn } from "../../store/slices/authSlice";


// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("lg"));
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetSponsorDetailsQuery(user?.details[0][0]?.sponsorId);
  const drawerOpen = useSelector((state) => state.application.drawerOpen);

  const {data:userData} = useGetMeUserQuery()
  const [getSubjectDashboardDetail] =
    bloqcibeApi.endpoints.getSubjectDashboardDetail.useLazyQuery();

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };
  useEffect(() => {
    if (user && user.details[0][0]['role'] == 'subject') {
      getSubjectDashboardDetail(user.details[0][0]['userId']);
      dispatch(setSubjectLoggedIn(true));
    }
  }, [user]);
  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <WebSocketProvider>

      <Box sx={{
        display: "flex", width: "100%",
        '@media (max-width:600px)': {
          backgroundColor: '#F1F2F5'
        }
      }}>
        <Header open={open} handleDrawerToggle={handleDrawerToggle} />
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{ width: "100%", minHeight: "100vh", display: 'flex', flexDirection: "column", flexGrow: 1, p: { xs: 2, sm: 3 } }}
        >
          <Box >
            <Toolbar />
            <Outlet />
          </Box>
          <Box sx={{ marginTop: "auto" }}>
            <Box height={10} sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, }}>
              <Typography variant="caption" color={theme.palette.grey[500]}>
                Copyright &copy; Bloqcube 2023. All rights reserved.
              </Typography>
            </Box>
          </Box>
          <ShowMessage />
        </Box>
      </Box>
    </WebSocketProvider>
  );
};

export default MainLayout;
