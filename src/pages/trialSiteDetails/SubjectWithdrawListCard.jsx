import { useGetWithdrawSubjectListQuery } from "../../store/slices/apiSlice";
import React, {  useMemo } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
  Typography,
} from "@mui/material";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import moment from "moment";

const SubjectWithdrawListCard = ({ trialId, sponsorId, siteId,trialSiteId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: subjectList } = useGetWithdrawSubjectListQuery({
    trialId,
    sponsorId,
    siteId,
  });
  const columns = useMemo(() => {
    if (subjectList) {
      const data = [
        {
          id: "srNo",
          label: `Sr No`,
          minWidth: 60,
          align: "left",
        },
        {
          id: "subjectName",
          label: "Subject Name",
          minWidth: 200,
          align: "left",
        },
        {
          id: "subjectNumber",
          label: "Subject Number",
          minWidth: 200,
          align: "left",
        },
        {
          id: "createdAt",
          label: "Discontinued Date",
          minWidth: 200,
          align: "center",
        },
        {
          id: "visitCount",
          label: "Visit",
          minWidth: 70,
          align: "center",
        },
      ];

      return data;
    }
  }, [subjectList]);

  const handleNavigate = (subjectMasterId) => {
    navigate(`/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectMasterId}/details`, {})
  }
    
  return (
    <>
      {
       subjectList && <CustomCard
          title={"Discontinued Subjects"}
          subHeader={`Total: ${subjectList?.length}`}
          sx={{ p: 1, pt: 2 }}
        >
          <TableContainer
            sx={{
              maxHeight: 250,
              border: `1px ${theme.palette.grey[100]} solid `,
            }}
          >
            <Table stickyHeader>
              <CustomTableHead>
                {columns &&
                  columns.map((column) => {
                    return (
                      <CustomTableHeadCell
                        key={column.id}
                        align={column.align}
                        width={column.minWidth}
                      >
                        {column.label}
                      </CustomTableHeadCell>
                    );
                  })}
              </CustomTableHead>
              <TableBody>
                {subjectList?.length === 0 ? (
                  <TableRow>
                    <TableCell align={"center"} colSpan={8}>
                      <Typography variant="subtitle1" color="initial">
                        No Available Data.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  columns &&
                  subjectList.map((subject, index1) => {
                    return (
                      <TableRow tabIndex={-1} key={index1} hover sx={{cursor:'pointer'}}>
                        {columns.map((column) => {
                          let value;
                          switch (column.id) {
                            case "srNo":
                              value = index1 + 1;
                              break;
                            case "createdAt":
                              value = moment(subject[column.id]).format("DD/MM/YYYY");
                              break;
                            default:
                              value = subject[column.id];
                              break;
                          }
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              onClick={() => {
                                handleNavigate(subject.id);
                              }}
                            >
                              {value}
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
      }
    </>
  );
};

export default SubjectWithdrawListCard;
