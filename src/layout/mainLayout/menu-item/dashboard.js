// assets
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const icons = {
  DashboardOutlinedIcon,
  CalendarMonthIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: "group-dashboard",
  title: " ",
  type: "group",
  children: [
    {
      id: "dashboard",
      title: "Home",
      type: "item",
      url: "/",
      icon: icons.DashboardOutlinedIcon,
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
