import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CustomCard from "../../../components/@extended/CustomCard";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../../components/@extended/CustomTable";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';

const VisitList = (props) => {
  const { handleVisitNavigate, columns, rows, setView, view } = props;
  const theme = useTheme();
  const handleSetView = () => {
    setView(!view);
  };
  return (
    <>
      <CustomCard
        title={"Visits"}
        action={
          <Tooltip title={"Change table view"}>
            {view ? (
              <TableRowsRoundedIcon
                sx={{ mr: 2, cursor: "pointer" }}
                onClick={handleSetView} 
              />
            ) : (
              <ViewWeekRoundedIcon
                sx={{ mr: 2, cursor: "pointer" }}
                onClick={handleSetView}
              />
            )}
          </Tooltip>
        }
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <CustomTableHead>
              <TableRow>
                {columns &&
                  columns.map((col) => (
                    <CustomTableHeadCell
                      key={col.key}
                      align={col.align}
                      sx={{ minWidth: col?.minWidth, maxWidth: col?.maxWidth }}
                    >
                      {col.label}
                    </CustomTableHeadCell>
                  ))}
              </TableRow>
            </CustomTableHead>
            <TableBody>
              {rows?.length === 0 ? (
                <TableRow>
                  <TableCell align={"center"} colSpan={8}>
                    <Typography variant="subtitle1" color="initial">
                      No Available Data.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                columns &&
                rows?.map((row, index) => {
                  return (
                    <TableRow tabIndex={-1} key={index} hover sx={{cursor:'pointer'}}>
                      {columns?.map((column) => {
                        const value = row[column.key];
                        return (
                          <TableCell
                            key={column.key}
                            align={column.align}
                            onClick={() => {
                              handleVisitNavigate(row.stepKey, row.crfMasterId,row.stepStatus);
                            }}
                          >
                            {(() => {
                              if (value === "Pending") {
                                return (
                                  <WatchLaterIcon
                                    sx={{
                                      color: "lightgrey",
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              } else if (value === "Verification_Pending") {
                                return (
                                  <WatchLaterIcon
                                    sx={{
                                      color: theme.palette.primary.light,
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              } else if (value === "Completed") {
                                return (
                                  <CheckCircleRoundedIcon
                                    sx={{
                                      color: theme.palette.success.light,
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              } else if (value === "External_Verification_Pending") {
                                return (
                                  <PendingActionsRoundedIcon
                                    sx={{
                                      color: theme.palette.primary.light,
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              } else if (/^\d+\/\d+$/.test(value)) {
                                return <Typography variant="body2" color="grey">{value}</Typography>;
                              } else if (value === undefined) {
                                return (
                                  <ClearRoundedIcon
                                    sx={{
                                      color: theme.palette.grey[400],
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              } else if (value === row.stepLabel) {
                                return (
                                  <Typography
                                    variant="body1"
                                    color={theme.palette.text.secondary}
                                  >
                                    {row.stepLabel}
                                  </Typography>
                                );
                              } else if (value === row.sectionLabel) {
                                return (
                                  <Typography
                                    variant="body1"
                                    color={theme.palette.text.secondary}
                                  >
                                    {row?.lableAbrivation?`${row?.sectionLabel} (${row?.lableAbrivation})`: row?.sectionLabel}
                                  </Typography>
                                );
                              } else {
                                return (
                                  <ClearRoundedIcon
                                    sx={{
                                      color: theme.palette.grey[400],
                                      fontSize: 20,
                                    }}
                                  />
                                );
                              }
                            })()}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomCard>
    </>
  );
};
export default VisitList;
