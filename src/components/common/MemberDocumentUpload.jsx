import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { useFormik } from "formik";
import TableRow from "@mui/material/TableRow";
import CloseIcon from "@mui/icons-material/Close";
import {
  bloqcibeApi,
  useDeleteTrialDocumentsMutation,
  useUploadDocMutation,
} from "../../store/slices/apiSlice";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { CustomTableHead, CustomTableHeadCell } from "../@extended/CustomTable";
import moment from "moment";
import TableCellLabel from "./TableCellLabel";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export const base64ToArrayBuffer = (base64) => {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
};
const MamberDocumentUpload = ({
  trialId,
  open,
  handleClose,
  siteId,
  memberId,
  memberName,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [getDownloadTrialDoc, { data: documentDownloadData }] =
    bloqcibeApi.endpoints.getDownloadTrialDoc.useLazyQuery();
  const { progress } = useSelector((state) => state.uploadProgress);
  const [uploadDoc, { isLoading: load }] = useUploadDocMutation();
  const [deleteTrialDocuments, { isLoading }] =
    useDeleteTrialDocumentsMutation();
  const [rows, setRows] = useState([]);
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getTrialDocuments, { data: userDocumentData }] =
    bloqcibeApi.endpoints.getTrialDocuments.useLazyQuery();

  useEffect(() => {
    (async () => {
      if (memberId) {
        await getTrialDocuments({
          trialId,
          sponsorId,
          data: { siteId: siteId, userId: memberId },
        });
      }
    })();
  }, [memberId]);

  useEffect(() => {
    (async () => {
      if (userDocumentData && userDocumentData.length > 0) {
        const dataToDisplay = userDocumentData.map((obj, i) => ({
          ...obj,
          id: obj.documentId,
          name: obj.docName,
          title: obj.docName,
          version: obj.docVersion,
          uploadedDate: obj.createdAt,
        }));
        setRows(dataToDisplay);
      } else {
        setRows([]);
      }
    })();
  }, [userDocumentData]);

  const docSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    title: Yup.string().required("title is required"),
    version: Yup.string().required("version is required"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      title: "",
      version: "",
    },
    validationSchema: docSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleUpload = async (acceptedFiles) => {
    setFiles([...files, acceptedFiles[0]]);
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("category", formik.values.name);
    formData.append("docName", formik.values.title);
    formData.append("docVersion", formik.values.version);
    if (memberId) {
      formData.append("userId", memberId);
      formData.append("siteId", siteId);
    } else if (siteId) {
      formData.append("siteId", siteId);
    }
    await uploadDoc({
      trialId: trialId,
      formData,
      sponsorId: sponsorId,
    });
    formik.resetForm();
    await getTrialDocuments({
      trialId,
      sponsorId,
      data: { siteId: siteId, userId: memberId },
    });
  };
  const deleteDoc = async (s3Key) => {
    await deleteTrialDocuments({
      trialId,
      s3Key,
      sponsorId: sponsorId,
    });
    await getTrialDocuments({
      trialId,
      sponsorId,
      data: { siteId: siteId, userId: memberId },
    });
  };
  const extractFilenameFromKey = (key) => {
    // Split the key by '/'
    const parts = key.split("/");
    // Get the last part (filename)
    const filename = parts[parts.length - 1];
    return filename;
  };
  const downloadDoc = async (s3Key) => {
    await getDownloadTrialDoc({
      trialId,
      s3Key,
      fileName: extractFilenameFromKey(s3Key),
      sponsorId: sponsorId,
    });
  };

  const checkforName = (e) => {
    formik.handleSubmit();
    if (formik.isValid === false) {
      e.preventDefault();
    }
  };

  const columns = [
    { Header: "Name", align: "left" },
    { Header: "Title", align: "left" },
    { Header: "Version", align: "left" },
    { Header: "Uploaded Date", align: "left" },
    { Header: " ", accessor: "download_doc", align: "center" },
    { Header: "  ", accessor: "delete_doc", align: "center" },
  ];
  const onCloseModal = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog
      //fullWidth={true}
      maxWidth={"md"}
      //sx={{minHeight: '50%'}}
      PaperProps={{ sx: { minHeight: "50%" } }}
      scroll={"paper"}
      open={open}
      onClose={onCloseModal}
    >
      <DialogTitle>{"Documents - (" + memberName + ")"}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box sx={{ display: "flex", columnGap: 4, alignItems: "center" }}>
          <TextField
            label="Name"
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
            size="small"
            variant="outlined"
            helperText={formik.touched.name && formik.errors.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          <TextField
            label="Title"
            onChange={formik.handleChange}
            name="title"
            value={formik.values.title}
            size="small"
            variant="outlined"
            helperText={formik.touched.title && formik.errors.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
          />
          <TextField
            label="Version"
            size="small"
            name="version"
            value={formik.values.version}
            onChange={formik.handleChange}
            variant="outlined"
            helperText={formik.touched.version && formik.errors.version}
            error={formik.touched.version && Boolean(formik.errors.version)}
          />
          <Button
            component="label"
            variant="outlined"
            onClick={(e) => checkforName(e)}
            startIcon={<CloudUploadIcon />}
            // disabled={!formik.isValid}
          >
            Upload file
            <VisuallyHiddenInput
              onChange={(e) => handleUpload(e.target.files)}
              type="file"
              accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf, image/*"
            />
          </Button>
          {progress > -1 && progress < 100 && (
            <>
              <LinearProgress
                sx={{ width: "25%" }}
                variant="determinate"
                value={progress}
              />
              <Typography
                sx={{ width: "1%" }}
                variant="body2"
                color="text.secondary"
              >{`${Math.round(progress)}%`}</Typography>
            </>
          )}
        </Box>
        <Box sx={{ pt: 3 }}>
          <Typography
            variant="subtitle1"
            color="initial"
            sx={{ fontWeight: "medium" }}
          >
            Uploaded Documents
          </Typography>
        </Box>
        <Paper sx={{ width: "100%", marginTop: 2 }}>
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
              <TableBody>
                {rows && rows.length > 0 ? (
                  rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell><TableCellLabel label={row.name}/></TableCell>
                        <TableCell><TableCellLabel label={row.title}/></TableCell>
                        <TableCell><TableCellLabel label={row.version}/></TableCell>
                        <TableCell><TableCellLabel label={moment(row.uploadedDate).format("DD-MM-YYYY HH:mm")}/></TableCell>
                        <TableCell align="center">
                          <Tooltip title={"Download"}>
                            <IconButton
                              onClick={() => downloadDoc(row.docS3Key)}
                              color="primary"
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={"Delete"}>
                            <IconButton
                              onClick={() => deleteDoc(row.docS3Key)}
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
                        No Documents Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseModal}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MamberDocumentUpload;
