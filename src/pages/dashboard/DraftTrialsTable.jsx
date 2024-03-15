import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  CustomTableHead,
  CustomTableHeadCell,
  CustomTableRow,
} from "../../components/@extended/CustomTable";
import RightArrow from "../../components/icons/RightArrow";
import { useNavigate } from "react-router-dom";
import { useGetTrialsMutation } from "../../store/slices/apiSlice";
import moment from "moment";
import { useSelector } from "react-redux";
import { getUserRole } from "../util";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { Columns } from "./TrialDetailColumns";

const DraftTrialsTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);
  const [getTrials, { data, error }] = useGetTrialsMutation();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const userRole = getUserRole(user);
  const columns = Columns();
  useEffect(() => {
    getTrials({
      filter: userRole == "sponsor" ? "Drafted,Created" : "Created",
      sponsorId: sponsorId,
    });
    if (data || error) {
    }
  }, []);
  return (
    <>
      <Box sx={{ py: 2 ,}}>
        <Typography variant="h6" color="initial">
          {userRole === "PI" || userRole === "site_coordinator"
            ? "Created Trials"
            : "Draft Trials"}
        </Typography>
        {(userRole === "PI" || userRole === "site_coordinator")
           && 
            <Typography variant="body1" color="initial">
              (Pending Site Initiation)
            </Typography>
          }
      </Box>
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: 3,
            backgroundColor: theme.palette.primary.light,
          }}
        />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <CustomTableHead>
              <TableRow>
                {columns.map((column) => (
                  <CustomTableHeadCell key={column.id} align={column.align} sx={{...column?.style}}>
                    {column.label}
                  </CustomTableHeadCell>
                ))}
              </TableRow>
            </CustomTableHead>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row) => {
                  return (
                    <CustomTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        let value = null;
                        const style = {...column?.style};
                        switch (column.id) {
                          case "createdAt": {
                            value = moment(row[column.id]).format(
                              "DD/MM/YYYY, hh:mm"
                            );
                            break;
                          }
                          case "currentExpenditure": {
                            value = "--"  
                            break;
                          }                      
                          case "status": {
                            style.fontWeight = 600;
                            if (row.status == "Created") {
                              style.color = "green";
                            } else {
                              style.color = "orange";
                            }
                            value = row.status;
                            break;
                          }
                          default:
                            value = row[column.id];
                            break;
                        }

                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Typography
                              variant="subtitle2"
                              color="initial"
                              style={style}
                            >
                              {value}
                            </Typography>
                            {column.id === "action" && (
                              <RightArrow
                                onClick={() =>
                                  row.status == "Drafted"
                                    ? navigate(`/createTrial/${row.id}`)
                                    : navigate(`/trial/${row.id}`)
                                }
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </CustomTableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {userRole === "PI" || userRole === "site_coordinator" ? (
                      <Typography variant="subtitle1" color="initial">
                      No Created Trials Found
                    </Typography>
                    ) : (
                      <Typography variant="subtitle1" color="initial">
                        No Draft Trials Found
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default DraftTrialsTable;
