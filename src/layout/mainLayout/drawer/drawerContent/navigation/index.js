// material-ui
import { Box, IconButton, Typography, useTheme } from "@mui/material";

// project import
import NavGroup from "./NavGroup";
import menuItem from "../../../menu-item";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Logo from "../../../../../components/Logo/Logo";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import GroupsIcon from '@mui/icons-material/Groups';
import _ from "lodash";
import { useGetSubjectDetailQuery } from "../../../../../store/slices/apiSlice";
import { useResponsive } from "../../../../../hooks/ResponsiveProvider";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { subjectDashboardDetails } from "../../../../../store/slices/subjectSlice";
import { selectCurrentUser } from "../../../../../store/slices/authSlice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getUserRole } from "../../../../../pages/util";

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = ({ open, handleDrawerToggle }) => {
  const subjectDashboardInfo = useSelector(subjectDashboardDetails);
  const user = useSelector(selectCurrentUser);
  const userRole = getUserRole(user);
  const theme = useTheme();
  const { isSmallScreen } = useResponsive();
  const trialId = subjectDashboardInfo?.crfDetail.trialId;
  const siteId = subjectDashboardInfo?.crfDetail.siteId;
  const trialSiteId = subjectDashboardInfo?.siteTrialDetail.id;
  const subjectMasterId = subjectDashboardInfo?.crfDetail.subjectMasterId;
  const subjectLoggedIn = useSelector((state) => state.auth.subjectLoggedIn);
  //const { data: subjectDetailWithSteps } = useGetSubjectDetailQuery(subjectMasterId)//subjectMasterId);

  const crfStepStatus = useMemo(() => {

    switch (userRole) {
      case "subject":
          if (subjectDashboardInfo?.crfDetail) {
            const steps = _.sortBy(
              subjectDashboardInfo?.crfDetail?.stepStatus,
              "order"
            );
            const _tempArr = [];
            for (let i = 0; i < steps.length; i++) {
              _tempArr.push({
                id: steps[i].stepKey,
                title: steps[i].stepLabel,
                type: "item",
                url: `/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/crf/${subjectDashboardInfo?.crfDetail.id}/${steps[i].stepKey}/subject`,
                icon: GroupsIcon,
                breadcrumbs: false,
              });
            }
            const _leftMenuItems = _.cloneDeep(menuItem.items);
            _leftMenuItems[0].children.push({
              id: "profile",
              title: "My Profile",
              type: "item",
              url: "/profile",
              icon: AccountCircleIcon,
              breadcrumbs: false,
            });
            const updatedTasks = _leftMenuItems[0].children.concat(_tempArr);
            _leftMenuItems[0].children = updatedTasks;
            return _leftMenuItems;
          }
        break;
      case "PI":
      case "site_monitor":
      case "site_admin":
      case "site_coordinator":
        if (!subjectLoggedIn) {
          const _leftMenuItems = _.cloneDeep(menuItem.items);
          _leftMenuItems[0].children.push({
            id: "schedule",
            title: "Schedule",
            type: "item",
            url: "/schedule",
            icon: CalendarMonthIcon,
            breadcrumbs: false,
          });
          return _leftMenuItems;
        }
        break;
      default:
        return menuItem.items;
    }
    
  }, [subjectDashboardInfo]);

  const navGroups = crfStepStatus?.map((item) => {
    switch (item.type) {
      case "group":
        return <NavGroup key={item.id} item={item} handleDrawerToggle={handleDrawerToggle} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box sx={{ pt: 2, height: "100vh", display: 'flex', alignItems: "space-between", flexDirection: "column" }} >
      <Box>
        {!isSmallScreen && <Box sx={{ display: "flex", justifyContent: "end", paddingRight: 1 }}>
          <IconButton
            disableRipple
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            color="secondary"
            sx={{
              color: "text.primary",
              bgcolor: `${theme.palette.grey[100]}`,
              ml: { xs: 0, lg: -2 },
            }}
          >
            {open ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
          </IconButton>
        </Box>}
        {navGroups}</Box>
      {open && <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', pb: 3 }}><Logo /> </Box>}

    </Box>
  );
};

export default Navigation;
