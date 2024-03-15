import React, { useState } from "react";
import CustomCard from "../../components/@extended/CustomCard";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../components/@extended/CustomTable";
import TableCellLabel from "../../components/common/TableCellLabel";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import DocumentsList from "../../components/common/DocumentsList";
import Label from "../../components/common/Label";
import { convertToTitleCase } from "../util";
import CustomButton from "../../components/@extended/CustomButton";
import ManageMembers from "../createTrial/siteDetails/ManageMembers";
const columns = [
  {
    id: "name",
    label: `Name`,
    minWidth: 200,
    align: "left",
  },
  {
    id: "contact_Information",
    label: "Contact Information",
    minWidth: 200,
    align: "center",
  },
  {
    id: "role",
    label: "Role",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "",
    minWidth: 170,
    align: "center",
  },
];

const ExpandableTableRow = ({
  children,
  expandComponent,
  row,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <TableRow {...otherProps}>
        {columns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell key={column.id} align={column.align}>
              {column.id === "action" ? (
                <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? (
                    <KeyboardArrowUpOutlinedIcon />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon />
                  )}
                </IconButton>
              ) : column.id === "role" ? (
                <TableCellLabel label={convertToTitleCase(value)} />
              ) : (
                <TableCellLabel label={value} />
              )}
            </TableCell>
          );
        })}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={4}>
          <Box sx={{ display: "flex", pb: 1.5 }}>
            <Label>Email :</Label>
            <Typography variant="subtitle2" color="initial">
              {row.email}
            </Typography>
          </Box>
            <DocumentsList
              trialId={row.trialId}
              siteId={row.siteId}
              userId={row.userId}
              sponsorId={row.sponsorId}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const SiteClinicalTeamCard = ({
  teamMembers,
  currentUserRoleOfTrailSite,
  trialId,
  siteId,
  siteName,
}) => {
  const theme = useTheme();
  const [manageMemberModal, setManageMemberModal] = useState(false);
  const rows = teamMembers
    ? teamMembers.map((member) => {
        return {
          name: `${member?.user?.firstName} ${member?.user?.lastName}`,
          contact_Information: member?.user?.contactNumber,
          role: member?.role,
          action: "",
          userId: member?.userId,
          trialId: member?.trialId,
          siteId: member?.siteId,
          sponsorId: member?.sponsorId,
          email: member?.user.email,
        };
      })
    : [];
  const handleOpenMemberModal = () => {
    setManageMemberModal(true);
  };

  return (
    <CustomCard
      title={"Clinical Team Details"}
      sx={{ p: 1, pt: 2 }}
      action={
       ( currentUserRoleOfTrailSite == "site_admin" ||
        currentUserRoleOfTrailSite == "sponsor") && (
          <CustomButton size="small" onClick={handleOpenMemberModal}>
            Manage Members
          </CustomButton>
        )
      }
    >
      <TableContainer
        sx={{
          maxHeight: 250,
          border: `1px ${theme.palette.grey[100]} solid `,
        }}
      >
        <Table stickyHeader>
          <CustomTableHead>
            {columns.map((column) => (
              <CustomTableHeadCell key={column.id} align={column.align}>
                {column.label}
              </CustomTableHeadCell>
            ))}
          </CustomTableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell align={"center"} colSpan={4}>
                  <TableCellLabel label={"No Available Data."} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => {
                return (
                  <ExpandableTableRow
                    tabIndex={-1}
                    key={index}
                    row={row}
                    columns={columns}
                  ></ExpandableTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={manageMemberModal}
        onClose={() => setManageMemberModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "80vh",
            width:"80vW"
          }}
        >
          <ManageMembers
            handleClose={() => setManageMemberModal(false)}
            trialId={trialId}
            siteId={siteId}
            siteName={siteName}
          />
        </Box>
      </Modal>
    </CustomCard>
  );
};

export default SiteClinicalTeamCard;
