import { TableRows } from "@mui/icons-material";
import { TableBody, TableCell, TableHead, TableRow, styled } from "@mui/material";

export const CustomTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.primary.lighter
  },
  fontSize:14,
  textTransform: "none"
 
}));

export const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: "#222322",
  fontSize: 14,
  fontWeight: 600,
  wordWrap: "break-word",
  textTransform: "none",
}));

export const CustomTableRow = styled(TableRow)(({ theme }) => ({
  fontSize:14,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.grey[50],
  },
  "& .MuiTableRow-hover": {
    backgroundColor: theme.palette.primary.lighter
  }
}));
