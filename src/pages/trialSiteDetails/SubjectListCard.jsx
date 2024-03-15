import React, { useEffect, useMemo, useState } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import CustomButton from "../../components/@extended/CustomButton";
import { useGetLibraryFormQuery, useGetSubjectListQuery } from "../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import { setSteps } from "../../store/slices/subjectSlice";
import _ from "lodash";
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';

const SubjectListCard = ({ trialId, siteId, trialSiteId }) => {
  const theme = useTheme();
  const navigate = useNavigate()
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const { data: subjectList } = useGetSubjectListQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteId: siteId,
  });
  const {data:formData}=useGetLibraryFormQuery(`${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/subject_enrollment_forms`)
  const dispatch = useDispatch()
  const [rows, setRows] = React.useState([]);
  const handleSearch = () => { };

  const columns = useMemo(() => {
    if (subjectList&&formData) {
      const data = [{
        id: "srNo",
        label: `Sr No`,
        minWidth: 60,
        align: "left",
      },
      {
        id: "subject",
        label: "Subject",
        minWidth: 200,
        align: "left",
      }];
      formData.steps.forEach((col) => {
        data.push({
          id: col.key,
          label: col.label,
          minWidth: 70,
          align: "center",
        })
      });
      data.push({
        id: "visitCount",
        label: "Visit",
        minWidth: 70,
        align: "center",
      });
      return data;
    }
  }, [subjectList,formData])
  useEffect(() => {
    if (subjectList) {
      const data = subjectList.map((subject, index) => {
        const result = _.reduce(
          subject.stepStatus,
          (acc, step) => {
            acc[step.stepKey] = step.status;
            return acc;
          },
          {}
        );
        return {
          srNo: index + 1,
          subject: subject?.subjectName,
          subjectId: subject?.id,
          visitCount:subject?.visitCount,
          subjectMasterId: subject?.stepStatus[0]?.subjectMasterId,
          ...result,
        };
      });
      setRows(data);
    }
  }, [subjectList]);

  const handleNavigate = (subjectId, subjectMasterId) => {
    const step = _.filter(subjectList, (su) => { return su.stepStatus[0]?.subjectMasterId === subjectMasterId })
    dispatch(setSteps(step[0]?.stepStatus))
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/details`, {})
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          height: 60,
          backgroundColor: "#fafafa",
        }}
      >
        <FormControl sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Search Subject
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={"text"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearch}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Search"
          />
        </FormControl>
        <CustomButton variant="contained" onClick={() => { }}>
          <Typography variant="subtitle1" color={theme.palette.common.white}>
            Export
          </Typography>
        </CustomButton>
      </Box>
      <CustomCard title={"Subjects"} 
        subHeader={`Total: ${rows?.length}`} sx={{ p: 1, pt: 2 }}
        action={<div style={{ display: 'flex', alignItems: 'center', paddingRight: 15 }}>

          <CheckCircleRoundedIcon
            sx={{
              color: theme.palette.success.light,
              fontSize: 20,
            }}
          />
          <Typography>Completed</Typography>
          <Divider orientation="vertical" width={5} flexItem/>
          <WatchLaterIcon
            sx={{
              color: theme.palette.primary.light,
              fontSize: 20,
            }}
          />
          <Typography>Verification Pending</Typography>
          <Divider orientation="vertical" width={5} flexItem/>
          <PendingActionsRoundedIcon
            sx={{
              color: theme.palette.primary.light,
              fontSize: 20,
            }}
          />
          <Typography>External Verification Pending</Typography>
          <Divider orientation="vertical" width={5} flexItem/>
          <WatchLaterIcon
            sx={{
              color: 'lightgrey',
              fontSize: 20,
            }}
          />
          <Typography>Pending to Submit</Typography>
        </div>}>
        <TableContainer
          sx={{
            maxHeight: 250,
            border: `1px ${theme.palette.grey[100]} solid `,
          }}
        >
          <Table stickyHeader>
            <CustomTableHead>
              {columns && columns.map((column) => {
                return <CustomTableHeadCell
                  key={column.id}
                  align={column.align}
                  width={column.minWidth}
                >
                  {column.label}
                </CustomTableHeadCell>
              }
              )}
            </CustomTableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell align={"center"} colSpan={8}>
                    <Typography variant="subtitle1" color="initial"> No Available Data.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
               columns && rows.map((subject, index) => {
                  return (
                    <TableRow tabIndex={-1} key={index} hover sx={{cursor:'pointer'}}>
                      {columns.map((column) => {
                        const value = subject[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} onClick={() => { handleNavigate(subject.subjectId, subject.subjectMasterId) }}>
                            {value === "Pending" ? (
                              <WatchLaterIcon
                                sx={{
                                  color: 'lightgrey',
                                  fontSize: 20,
                                }}
                              />
                            ) : value === "Verification_Pending" ? (
                              <WatchLaterIcon
                                sx={{
                                  color: theme.palette.primary.light,
                                  fontSize: 20,
                                }}
                              />
                            ) : value === "Completed" ? (
                              <CheckCircleRoundedIcon
                                sx={{
                                  color: theme.palette.success.light,
                                  fontSize: 20,
                                }}
                              />
                            ) :value === "External_Verification_Pending" ? (
                              <PendingActionsRoundedIcon
                                sx={{
                                  color: theme.palette.primary.light,
                                  fontSize: 20,
                                }}
                              />
                            ):value === "Completed" ? (
                              <CheckCircleRoundedIcon
                                sx={{
                                  color: theme.palette.success.light,
                                  fontSize: 20,
                                }}
                              />
                            ): (
                              value
                            )}
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

export default SubjectListCard;
