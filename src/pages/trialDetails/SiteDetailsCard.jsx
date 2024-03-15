import React, { useEffect, useMemo, useState } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import RightArrow from "../../components/icons/RightArrow";
import { useNavigate } from "react-router-dom";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import { useSelector } from "react-redux";
import _ from "lodash";
import { getUserRole } from "../util";
import { useGetSubjectListByFieldMutation } from "../../store/slices/apiSlice";

const getStatus = (row) => {
  const steps = _.sortBy(row?.siteInitiationMaster?.stepStatus, "order");
  let currentStatus = "Completed";
  for (let i = 0; i < steps?.length; i++) {
    const stepStatusData = steps[i];
    if (stepStatusData.status === "Pending") {
      const value = stepStatusData?.stepLabel;
      if (value) {
        currentStatus = value;
      }
      break;
    }
  }
  return currentStatus;
};
const SiteDetailsCard = ({ trialId, sponsorId }) => {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.user);
  const userRole = getUserRole(loggedInUser, trialId);
  const trialSites = useSelector((state) => state.trial.currentTrialSites);
  const [rows, setRows] = useState([]);
  const [getSubjectListByField] = useGetSubjectListByFieldMutation();
  const getColumns = () => {
    switch (userRole) {
      case "site_monitor":
        return [
          {
            id: "name",
            label: "Site Name",
            minWidth: 170,
            align: "left",
          },
          {
            id: "siteId",
            label: "Site ID",
            minWidth: 170,
            align: "center",
          },
          {
            id: "noOfSubject",
            label: "Number of Subjects",
            minWidth: 170,
            align: "center",
          },
          {
            id: "noOfAESubject",
            label: "Number of AE Subjects",
            minWidth: 170,
            align: "center",
          },
          {
            id: "noOfSAESubject",
            label: "Number of SAE Subjects",
            minWidth: 170,
            align: "center",
          },
          { id: "action", label: "", minWidth: 100 },
        ];
      default:
        return [
          {
            id: "name",
            label: "Site Name",
            minWidth: 170,
            align: "left",
          },
          {
            id: "siteId",
            label: "Site ID",
            minWidth: 170,
            align: "center",
          },
          {
            id: "noOfSubject",
            label: "Number of Subjects",
            minWidth: 170,
            align: "center",
          },
          { id: "status", label: "Status", minWidth: 170, align: "center" },

          { id: "action", label: "", minWidth: 100 },
        ];
    }
  };
  const columns = getColumns();

  const getAECount = async (siteId) => {
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
      return AE?.data?.length;
    } else {
      return 0;
    }
  };

  const getSAECount = async (siteId) => {
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
      return sae?.data?.length;
    } else {
      return 0;
    }
  };

  const fetchData = async () => {
    const fetchedRows = [];
    if (trialSites && columns) {
      await Promise.all(
        trialSites.map(async (siteObj) => {
          let aeCount = 0;
          let saeCount = 0;
          if (_.some(columns,(col) => col.id === "noOfAESubject" || col.id === "noOfSAESubject")
          ) {
            aeCount = await getAECount(siteObj.siteId);
            saeCount = await getSAECount(siteObj.siteId);
          }
          const row = {};
          columns.map((column) => {
            switch (column.id) {
              case "name":
                row[column.id] = siteObj.site.orgname;
                break;
              case "noOfAESubject":
                row[column.id] = aeCount;
                break;
              case "noOfSAESubject":
                row[column.id] = saeCount;
                break;
              case "status":
                row[column.id] = getStatus(siteObj);
                break;
              case "noOfSubject":
                row[column.id] = siteObj.totalSubjects;
                break;
              default:
                row[column.id] = siteObj[column.id];
                break;
            }
          });
          row["trialSiteId"] = siteObj.id;
          fetchedRows.push(row);
        })
      );
      setRows(fetchedRows);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trialSites]);

  return (
    <CustomCard>
      <TableContainer>
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
                            <RightArrow
                              onClick={() =>
                                navigate(
                                  `/trial/${trialId}/trial-site/${row.trialSiteId}`
                                )
                              }
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns?.length} align="center">
                  <Typography variant="subtitle2" color="initial">
                    No AE/SAE subjects found in any site
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CustomCard>
  );
};

export default SiteDetailsCard;
