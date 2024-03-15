import { useSelector } from "react-redux";
import { useMemo } from "react";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { getUserRole } from "../util";

export const Columns = (isOngoingTable=false) => {
  const user = useSelector(selectCurrentUser);
  const userRole = getUserRole(user);

  const columns = useMemo(() => {
    switch (userRole) {
      case "site_admin":
        return [
          {
            id: "trialTitle",
            label: `Trial Title`,
            style: {
              minWidth: 200,
              maxWidth: 300,
              textAlign:'justify'
            },
            align: "left",
          },
          {
            id: "protocolNumber",
            label: "Protocol Number",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          {
            id: "totalSubjectNumber",
            label: "Number of Subjects",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          {
            id: "siteBudget",
            label: "Site Budget",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          isOngoingTable ? "" :{
            id: "status",
            label: "Status",
            style: {
              minWidth: 170,
            },
            align: "center",
        },
          { id: "action", label: "", minWidth: 100 },
        ];
      case "PI":
        return [
          {
            id: "trialTitle",
            label: `Trial Title`,
            style: {
              minWidth: 200,
              maxWidth: 300,
              textAlign:'justify'
            },
            align: "left",
          },
          {
            id: "protocolNumber",
            label: "Protocol Number",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          {
            id: "totalSubjectNumber",
            label: "Number of Subjects",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          { id: "action", label: "", minWidth: 100 },
        ];
      default:
        return [
          {
            id: "trialTitle",
            label: `Trial Title`,
            style: {
              minWidth: 200,
              maxWidth: 300,
              textAlign:'justify'
            },
            align: "left",
          },
          {
            id: "protocolNumber",
            label: "Protocol Number",
            style: {
              minWidth: 170,
            },
            align: "center",
          },
          {
            id: "totalSubjectNumber",
            label: "Number of Subjects",
            style: {
              minWidth: 150,
            },
            align: "center",
          },
          {
            id: "siteCount",
            label: "Number of Sites",
            style: {
              minWidth: 150,
            },
            align: "center",
          },
           {
            id: "totalBudget",
            label: "Total Budget",
            style: {
              minWidth: 150,
            },
            align: "center",
          } ,
          isOngoingTable ? "" :{
              id: "status",
              label: "Status",
              style: {
                minWidth: 150,
              },
              align: "center",
          },
          { id: "action", label: "", minWidth: 100 },
        ];
    }
  }, [userRole]);
  return columns;
};