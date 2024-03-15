import React, { useEffect, useMemo, useState } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import RightArrow from "../../components/icons/RightArrow";
import { useNavigate } from "react-router-dom";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import { useSelector } from "react-redux";
import { getUserRole } from "../util";
import {
  useGetSubjectListByFieldMutation,
  useGetSubjectListQuery,
} from "../../store/slices/apiSlice";
import _ from "lodash";

const columns = [
  {
    id: "subjectId",
    label: "Subject Id",
    minWidth: 170,
    align: "left",
  },
  {
    id: "aeObserved",
    label: "AE Observed",
    minWidth: 170,
    align: "center",
  },
  {
    id: "saeObserved",
    label: "SAE Observed",
    minWidth: 170,
    align: "center",
  },
  {
    id: "completedStage",
    label: "Completed Stage",
    minWidth: 170,
    align: "center",
  },
  { id: "action", label: "", minWidth: 100 },
];

const SubjectAEListCard = ({ trialId, siteId, trialSiteId }) => {
  useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [rows, setRows] = useState([]);
  const { data: subjectList,isLoading } = useGetSubjectListQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteId: siteId,
  });
  const [getSubjectListByField,{isLoading:isSubjectLisyByFieldLoading}] = useGetSubjectListByFieldMutation();

  const getAESubjects = async (siteId) => {
    const AE = await getSubjectListByField({
      trialId,
      sponsorId,
      siteId,
      payload: {
        stepKey: "Create_Visit_2",
        sectionKey: "adverse_Events",
        categoryKey: "adverseEventsDetails",
        subSectionKey: "",
        fieldKey: "newAdvEvent",
        value: "Yes",
      },
    });
    if (AE.data) {
      return AE?.data;
    } else {
      return 0;
    }
  };

  const getSAESubjects = async (siteId) => {
    const sae = await getSubjectListByField({
      trialId,
      sponsorId,
      siteId,
      payload: {
        stepKey: "Create_Visit_2",
        sectionKey: "adverse_Events",
        categoryKey: "SeriousAdverseEventsDetails",
        subSectionKey: "",
        fieldKey: "newSeriousAdvEvent",
        value: "Yes",
      },
    });
    if (sae.data) {
      return sae?.data;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    (async () => {
      const _rows = [];
      if (subjectList) {
        const aeSubjects = await getAESubjects(siteId);
        const saeSubjects = await getSAESubjects(siteId);
        await Promise.all(
          _.map(subjectList, (subject) => {
            const row = {};
            _.map(columns, (column) => {
              switch (column.id) {
                case "subjectId":
                  return (row[column.id] = subject?.subjectNumber);
                case "aeObserved":
                  let val = "-";
                  if (_.some(aeSubjects, (_aeSub) => _aeSub.id == subject.id)) {
                    val = "Visit 2";
                  }
                  return (row[column.id] = val);
                case "saeObserved":
                  let val1 = "-";
                  if (
                    _.some(saeSubjects, (_saeSub) => _saeSub.id == subject.id)
                  ) {
                    val1 = "Visit 2";
                  }
                  return (row[column.id] = val1);
                case "completedStage":
                  return (row[column.id] = getCompletedStep(subject));
              }
            });
            row["subjectMasterId"] = subject?.id;
            _rows.push(row);
          })
        );
      }
      setRows(_rows);
    })();
  }, [subjectList]);

  const getCompletedStep = (subject) => {
    let stepLabel = "-";
    if (subject.stepStatus) {
      const orderedEnrollmentSteps = _.sortBy(subject.stepStatus, "order");
      let stepIndex = _.findIndex(
        orderedEnrollmentSteps,
        (_step) => _step.status === "Pending"
      );
      if (stepIndex !== -1) {
        stepLabel = orderedEnrollmentSteps[stepIndex - 1].stepLabel;
      } else if (subject.crfStatus) {
        const orderedCRFSteps = _.sortBy(subject.crfStatus.stepStatus, "order");
        let crfStepIndex = _.findIndex(
          orderedCRFSteps,
          (_step) => _step.status === "Pending"
        );
        if (crfStepIndex !== -1) {
          stepLabel =
            crfStepIndex === 0
              ? orderedEnrollmentSteps[orderedEnrollmentSteps.length - 1]
                  .stepLabel
              : orderedCRFSteps[crfStepIndex - 1].stepLabel;
        } else if (crfStepIndex === -1) {
          stepLabel = orderedCRFSteps[orderedCRFSteps.length - 1].stepLabel;
        }
      }
    }
    return stepLabel;
  };

  const handleNavigate = (subjectRow) => {
    navigate(
      `/eConcent/${trialId}/trial-site/${trialSiteId}/site/${siteId}/subject/${subjectRow.subjectMasterId}/details`,
      {}
    );
  };

  return (
    <CustomCard
      title={"Subjects"}
      subHeader={`Total: ${rows?.length}`}
      sx={{ p: 1, pt: 2 }}
    >
      <TableContainer
        sx={{
          maxHeight: 250,
          border: `1px ${theme.palette.grey[100]} solid `,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <CustomTableHead>
            <TableRow>
              {columns.map((column) => (
                <CustomTableHeadCell key={column.id} align={column.align}>
                  {column.label}
                </CustomTableHeadCell>
              ))}
            </TableRow>
          </CustomTableHead>
          <TableBody>
            {rows &&
              rows?.map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={row[column.id]} align={column.align}>
                          <Typography variant="subtitle2" color="initial">
                            {row[column.id]}
                          </Typography>
                          {column.id === "action" && (
                            <RightArrow onClick={() => handleNavigate(row)} />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {rows.length === 0 && (
              <TableRow tabIndex={-1}>
                <TableCell colSpan={5} align="center">
                  {(isLoading)&& <CircularProgress />}
                  {!rows && (
                    <Typography variant="subtitle2" color="initial">
                      No subjects found
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default SubjectAEListCard;
