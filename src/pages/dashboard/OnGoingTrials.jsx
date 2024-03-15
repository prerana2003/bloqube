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
import { useGetOngoingTrialsQuery } from "../../store/slices/apiSlice";
import moment from "moment";
import { useSelector } from "react-redux";
import { Columns } from "./TrialDetailColumns";

const OnGoingTrialsTable = () => {
  const navigate = useNavigate();
  const isOngoingTable = true;
  const columns1 = Columns(isOngoingTable);
  const theme = useTheme();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const {data, error, isLoading} = useGetOngoingTrialsQuery(sponsorId);
  
  return (
    <>
      <Typography variant="h6" color="initial" sx={{ py: 2 }}>
        Ongoing Trials
      </Typography>
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: 3,
            backgroundColor: theme.palette.primary.light,
            borderRadiusTop:5
          }}
        />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <CustomTableHead>
              <TableRow >
                {columns1.map((column) => {
                  let labelValue = null;
                  switch(column.id) {
                      case "trialTitle": {
                        labelValue = <div>
                              {column.label}<br/>
                              {"Start Date" }
                        </div>
                        break;
                      }
                    default:
                      labelValue = column.label;
                        break;
                  }
                  return(
                    <CustomTableHeadCell key={column.id} align={column.align}  sx={{...column?.style}}>
                    {labelValue}
                  </CustomTableHeadCell>
                  )
                  })}
              </TableRow>
            </CustomTableHead>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row) => {
                  return (
                    <CustomTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns1.map((column) => {
                        let value = null;
                        const style = {};
                        switch (column.id) {
                          case "createdAt": {
                            value = moment(row[column.id]).format(
                              "DD/MM/YYYY, hh:mm"
                            );
                            break;
                          }
                          
                          case "trialTitle": {
                            value = 
                              <div style={{diplay:'flex', justifyContent:'center'}}>
                              <Typography variant="subtitle2" color="initial">
                              {row.trialTitle}
                              </Typography>
                              <Typography variant="subtitle2" color="initial">
                              {moment(row.updatedAt).format("DD/MM/YYYY")}
                              </Typography>
                              </div>
                            break;
                          }
                          case "currentExpenditure": {
                            value = "--"  
                            break;
                          }
                          
                          default:
                            value = row[column.id];
                            break;
                        }
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Typography variant="subtitle2" color="initial">
                              {value}
                            </Typography>

                            {column.id === "action" && (
                              <RightArrow
                                onClick={() =>
                                  navigate(`/trial/${row.id}`)
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
                  <TableCell colSpan={columns1.length} align="center">
                    <Typography variant="subtitle1" color="initial">
                      No Ongoing Trials Found
                    </Typography>
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

export default OnGoingTrialsTable;
