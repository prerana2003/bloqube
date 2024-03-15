import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
  Box,
  IconButton,
  TextField,
  Tooltip,
  Container,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { useFormik } from "formik";
import TableRow from "@mui/material/TableRow";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  bloqcibeApi,
  useAssignRoleMutation,
  useDeleteUserRoleMutation,
} from "../../../store/slices/apiSlice";
import AddMember from "./AddMember";
import { UserRole } from "../../../util/util";
import MamberDocumentUpload from "../../../components/common/MemberDocumentUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  CustomTableHead,
  CustomTableHeadCell,
} from "../../../components/@extended/CustomTable";
import CustomButton from "../../../components/@extended/CustomButton";
import TableCellLabel from "../../../components/common/TableCellLabel";
import { convertToTitleCase, getUserRole } from "../../util";
import { selectCurrentUser } from "../../../store/slices/authSlice";
import { openMessage } from "../../../store/slices/showMessageSlice";
import ConfirmationDialog from "../../../components/common/ConfirmationDialog";

const ManageMembers = ({
  siteId,
  trialId,
  onBackClick,
  siteName,
  handleClose,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openUploadDoc, setOpenUploadDoc] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedDocUser, setSelectedDocUser] = useState("");
  const [assignRole] = useAssignRoleMutation();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getSiteMembers, { data: siteUsersData }] =
    bloqcibeApi.endpoints.getSiteMembers.useLazyQuery();
  const [getTrialSiteMembers, { data: trialSiteUsersData }] =
    bloqcibeApi.endpoints.getTrialSiteMembers.useLazyQuery();
  const [deleteUserRole] = useDeleteUserRoleMutation();
  const user = useSelector(selectCurrentUser);
  const userRole = getUserRole(user, trialId);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: (
      <>
        <span>Are you sure you want to delete this user from the Trial?</span>
        <br />
        <span>
          This action cannot be undone. Please confirm whether you want to
          proceed with the deletion.
        </span>
      </>
    ),
    buttonLabel: "Confirm",
  });
  const [deleteUser,setDeleteUser]=useState()

  useEffect(() => {
    (async () => {
      await getSiteMembers({ sponsorId, siteId });
      await getTrialSiteMembers({ sponsorId, siteId, trialId });
    })();
  }, [dispatch]);
  useEffect(() => {
    (async () => {
      if (trialSiteUsersData) {
        setRows(trialSiteUsersData);
      }
    })();
  }, [trialSiteUsersData]);

  const memberSchema = Yup.object().shape({
    userId: Yup.string().required("Name is required"),
    //contact: Yup.string().required("Contact info is required"),
    role: Yup.string().required("Role is required"),
  });
  const formik = useFormik({
    initialValues: {
      userId: "",
      contact: "",
      role: "",
    },
    validationSchema: memberSchema,
    onSubmit: async (values) => {
      const result = await assignRole({
        data: { ...values, trialId, siteId },
        sponsorId: sponsorId,
      });
      formik.resetForm();
      await getTrialSiteMembers({ sponsorId, siteId, trialId });
    },
  });
  const columns = [
    { Header: "Name", align: "left" },
    { Header: "Contact", align: "left" },
    { Header: "Role", align: "left" },
    { Header: "Action", align: "left" },
  ];
  const addMember = () => {
    setOpenAddMember(true);
  };
  const onClose = () => {
    setOpenAddMember(false);
  };
  const onCloseUpload = () => {
    setOpenUploadDoc(false);
  };
  const onAddMember = async () => {
    await getSiteMembers({ siteId, sponsorId });
    setOpenAddMember(false);
  };
  const onMemberChange = (e) => {
    const getSelectedUser = siteUsersData.find(
      (_user) => _user.id == e.target.value
    );
    formik.setFieldValue("contact", getSelectedUser.contactNumber);
    formik.handleChange(e);
  };
  const deleteMember = async (user) => {
    console.log(user);
    if (user.role !== userRole) {
      setDeleteUser(user);
      setConfirmDialog({
        ...confirmDialog,
        open: true,
        message: (
          <>
            <span>
              Are you sure you want to delete{" "}
              {`${user.user.firstName} ${user.user.lastName}`} from the Trial?
            </span>
            <br />
            <span>
              This action cannot be undone. Please confirm whether you want to
              proceed with the deletion.
            </span>
          </>
        ),
      });
    } else {
      dispatch(
        openMessage({
          messageSeverity: "warning",
          message: "Delete is not permitted for this user!",
        })
      );
    }
  };
  const uploadDoc = (userId) => {
    setSelectedDocUser(userId);
    setOpenUploadDoc(true);
  };

  const handleDeleteMember = async () => {
    if (deleteUser) {
      await deleteUserRole({
        user_role_id: deleteUser?.id,
      });
      setConfirmDialog({
        ...confirmDialog,
        open: false,
      });
      await getTrialSiteMembers({ sponsorId, siteId, trialId });
    }
  }

  const handleConfirmDialogClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };
  return (
    <Box>
      <Container fixed>
        {onBackClick && (
          <Button
            component="label"
            variant="outlined"
            onClick={(e) => onBackClick()}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>)}
          <Card sx={{ height: "80vh", marginTop: 2 }}>
          <CardHeader
            title={`Clinical Team Details (${siteName})`}
            titleTypographyProps={{ variant: "h6" }}
            action={
              <>
                {handleClose && (
                  <IconButton
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                columnGap: 4,
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <Box sx={{ display: "flex", width: "25%" }}>
                <Select
                  name={`userId`}
                  value={formik.values.userId}
                  onChange={onMemberChange}
                  //fullWidth={true}
                  sx={{ width: "80%" }}
                  placeholder="Select Team Member"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  helperText={formik.touched.userId && formik.errors.userId}
                  error={formik.touched.userId && Boolean(formik.errors.userId)}
                  input={<OutlinedInput size="small" />}
                >
                  <MenuItem disabled value="">
                    <em>Select Team Member</em>
                  </MenuItem>
                  {siteUsersData &&
                    siteUsersData
                      .filter((_siteUsersData) => {
                        if (!trialSiteUsersData) return true;
                        const _rec = trialSiteUsersData.find(
                          (_trialData) => _trialData.userId == _siteUsersData.id
                        );
                        if (_rec) {
                          return false;
                        }
                        return true;
                      })
                      .map((_user) => (
                        <MenuItem key={_user.id} value={_user.id}>
                          <em>{`${_user.firstName} ${_user.lastName}`}</em>
                        </MenuItem>
                      ))}
                </Select>
                <IconButton aria-label="Add" onClick={addMember}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
              <TextField
                label="Contact Information"
                onChange={formik.handleChange}
                name="contact"
                value={formik.values.contact}
                size="small"
                disabled
                sx={{ width: "20%" }}
                variant="outlined"
                // helperText={formik.touched.contact && formik.errors.contact}
                // error={formik.touched.contact && Boolean(formik.errors.contact)}
              />
              <Select
                name={`role`}
                value={formik.values.role}
                onChange={formik.handleChange}
                //fullWidth={true}
                placeholder="Select Role"
                sx={{ width: "20%" }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                helperText={formik.touched.role && formik.errors.role}
                error={formik.touched.role && Boolean(formik.errors.role)}
                input={<OutlinedInput size="small" />}
              >
                <MenuItem disabled value="">
                  <em>Select Role</em>
                </MenuItem>
                {UserRole.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </Select>
              <CustomButton
                component="label"
                variant="contained"
                onClick={(e) => formik.handleSubmit()}
              >
                Add Member
              </CustomButton>
            </Box>
            <Typography
              variant="subtitle1"
              color="initial"
              sx={{ fontWeight: "medium" }}
            >
              Member Details
            </Typography>
            <Paper sx={{ width: "100%", marginTop: 3 }}>
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
                      {columns.map((col) => (
                        <CustomTableHeadCell key={col.Header} align={col.align}>
                          {col.Header}
                        </CustomTableHeadCell>
                      ))}
                    </TableRow>
                  </CustomTableHead>
                  <TableBody sx={{ overflow: "scroll" }}>
                    {rows && rows.length > 0 ? (
                      rows.map((row) => {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>
                              <TableCellLabel
                                label={`${row?.user.firstName} ${row?.user.lastName}`}
                              />
                            </TableCell>
                            <TableCell>
                              <TableCellLabel label={row?.user.contactNumber} />
                            </TableCell>
                            <TableCell>
                              <TableCellLabel
                                label={convertToTitleCase(row?.role)}
                              />
                            </TableCell>
                            <TableCell align="left">
                              <Tooltip title={"Upload"}>
                                <IconButton
                                  onClick={() => uploadDoc(row?.user)}
                                  color="primary"
                                >
                                  <CloudUploadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={"Delete"}>
                                <IconButton
                                  onClick={() => deleteMember(row)}
                                  color={theme.palette.grey[500]}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="subtitle1" color="initial">
                            No Members Found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </CardContent>
        </Card>
      </Container>
      <AddMember
        open={openAddMember}
        handleClose={onClose}
        onAddMember={onAddMember}
        siteId={siteId}
      />
      <MamberDocumentUpload
        open={openUploadDoc}
        handleClose={onCloseUpload}
        trialId={trialId}
        siteId={siteId}
        memberId={selectedDocUser.id}
        memberName={`${selectedDocUser.firstName} ${selectedDocUser.lastName}`}
      />
      <ConfirmationDialog
        open={confirmDialog.open}
        buttonLabel={confirmDialog.buttonLabel}
        message={confirmDialog.message}
        handleClose={handleConfirmDialogClose}
        handleConfirm={handleDeleteMember}
      />
    </Box>
  );
};

export default ManageMembers;
