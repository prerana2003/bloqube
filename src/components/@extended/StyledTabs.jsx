import { Tabs, styled } from "@mui/material";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiButtonBase-root.MuiTab-root": {
    fontSize:16,
    color: theme.palette.primary.light,
    border: `2px solid ${theme.palette.primary.light}`,
  },
  "& .MuiButtonBase-root.MuiTab-root.Mui-selected": {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.light,
    border: `2px solid ${theme.palette.primary.light}`,
    "& .MuiTypography-root": {
      color: theme.palette.grey[100],
    }
  },
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.light,
  },
  "& .MuiButtonBase-root.MuiTab-root.Mui-disabled": {
    backgroundColor:theme.palette.grey[300],
    color: theme.palette.common.white,
    border: `2px solid ${theme.palette.grey[300]}`,
  }
}));

export default StyledTabs;
