import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
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
  useGetTrialDocumentsQuery,
  useUploadDocMutation,
} from "../../store/slices/apiSlice";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { CustomTableHead, CustomTableHeadCell } from "../@extended/CustomTable";
import moment from "moment";
import { openMessage } from "../../store/slices/showMessageSlice";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  disableAutoFocusItem: true,
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
const DocumentUploadWithCategory = ({
  dialogTitle,
  trialId,
  siteId,
  open,
  handleClose,
  selectedDocType,
  selectedDocTypeData,
  onDocUpload,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const [files, setFiles] = useState([]);
  const [getDownloadTrialDoc] =
    bloqcibeApi.endpoints.getDownloadTrialDoc.useLazyQuery();
  const { progress } = useSelector((state) => state.uploadProgress);
  const [uploadDoc] = useUploadDocMutation();
  const [deleteTrialDocuments] = useDeleteTrialDocumentsMutation();
  const [categories, setCategories] = useState([]);
    const [addNewCategory, setAddNewCategory] = useState(false);
    const [newCategory,setNewCategory]=useState("")
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getTrialDocTypes] =
    bloqcibeApi.endpoints.getTrialDocTypes.useLazyQuery();
  const [getSiteDocumentMeta] =
    bloqcibeApi.endpoints.getSiteDocumentMeta.useLazyQuery();
  const { data: uploadedDocs } = useGetTrialDocumentsQuery({
    trialId,
    sponsorId,
    data: { siteId: siteId },
  });
  useEffect(() => {
    (async () => {
      if (siteId) {
        const docMeta = await getSiteDocumentMeta();
        setCategories(docMeta.data);
      } else {
        const docMeta = await getTrialDocTypes();
        setCategories(docMeta.data);
      }
    })();
  }, [siteId]);

  const docSchema = Yup.object().shape({
    category: Yup.string().required("category is required"),
    name: Yup.string().required("name is required"),
    version: Yup.string().required("version is required"),
  });
  const formik = useFormik({
    initialValues: {
      category: "",
      name: "",
      version: "",
    },
    validationSchema: docSchema,
    onSubmit: (values) => {},
  });

  const handleUpload = async (acceptedFiles) => {
    setFiles([...files, acceptedFiles[0]]);
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("category", formik.values.category);
    formData.append("docName", formik.values.name);
    formData.append("docVersion", formik.values.version);
    if (siteId) {
      formData.append("siteId", siteId);
    }
    await uploadDoc({
      trialId: trialId,
      formData,
      sponsorId: sponsorId,
    });
    formik.resetForm();
  };
  const deleteDoc = async (s3Key) => {
    await deleteTrialDocuments({
      trialId,
      s3Key,
      sponsorId: sponsorId,
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
    { Header: "Document Name", align: "left" },
    { Header: "Version", align: "left" },
    { Header: "Category", align: "left" },
    { Header: "Uploaded Date", align: "left" },
    { Header: " ", accessor: "download_doc", align: "center" },
    { Header: " ", accessor: "delete_doc", align: "center" },
  ];
  const onCloseModal = () => {
    formik.resetForm();
    handleClose();
  };
    
  const handleSaveNewCategory = () => {
    let category = newCategory.split(" ").join("").toLowerCase().replace(/[^a-z0-9 ]/g, '');
    if (category === "") {
      dispatch(
        openMessage({
          messageSeverity: "warning",
          message: "Category name cannot be empty!",
        })
      );
      return false
  }
    if (categories.filter((_cat) =>{return _cat.type.split(" ").join("").toLowerCase() === category;}).length <= 0)
     {
        setCategories([...categories, { type: newCategory, id: categories.length + 1 }])
        setAddNewCategory(false)
        formik.setFieldValue("category", newCategory);
        setNewCategory("")
    } else {
      formik.setFieldValue("category", newCategory);
        dispatch(
          openMessage({
            messageSeverity: "warning",
            message: "Category Already Exists!",
          })
        );
      }
    }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      //sx={{minHeight: '50%'}}
      PaperProps={{ sx: { minHeight: "50%" } }}
      scroll={"paper"}
      open={open}
      onClose={onCloseModal}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
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
        <Box
          sx={{
            display: "flex",
            columnGap: 4,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <TextField
            sx={{ width: "20%" }}
            autoComplete="false"
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
            sx={{ width: "20%" }}
            label="Version"
            autoComplete="false"
            size="small"
            name="version"
            value={formik.values.version}
            onChange={formik.handleChange}
            variant="outlined"
            helperText={formik.touched.version && formik.errors.version}
            error={formik.touched.version && Boolean(formik.errors.version)}
          />
          <FormControl sx={{ width: "35%" }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formik.values.category}
              onChange={(event) => {
                  const { value } = event.target;
                  if (addNewCategory) {
                      setNewCategory("");
                      setAddNewCategory(false);
                  }
                formik.setFieldValue("category", value);
              }}
              size="small"
              input={<OutlinedInput label="Category" />}
              MenuProps={MenuProps}
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.type}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {category?.type}
                  </div>
                </MenuItem>
              ))}
              {addNewCategory ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    pl: 1,
                    pt:0.5
                  }}
                >
                  <TextField
                    size="small"
                    label={"New Category"}
                    value={newCategory}
                    onChange={async (e) => await setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <Button onClick={handleSaveNewCategory}>Ok</Button>
                </Box>
              ) : (
                <MenuItem
                  value={"addNew"}
                  onClickCapture={(event) => {
                    setAddNewCategory(true);
                    event.stopPropagation();
                  }}
                >
                  <ListItemText primary="Add New Document Category" />
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <Button
            sx={{ width: "20%" }}
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
              multiple={false}
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
        <Typography
          variant="subtitle1"
          color="initial"
          sx={{ fontWeight: "medium" }}
        >
          Uploaded Documents
        </Typography>
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
                  {columns.map((col, index) => (
                    <CustomTableHeadCell key={index} align={col.align}>
                      {col.Header}
                    </CustomTableHeadCell>
                  ))}
                </TableRow>
              </CustomTableHead>
              <TableBody>
                {uploadedDocs && uploadedDocs.length > 0 ? (
                  uploadedDocs.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{row.docName}</TableCell>
                        <TableCell>{row.docVersion}</TableCell>
                        <TableCell
                          sx={{
                            minWidth: 200,
                            maxWidth: 300,
                            textAlign: "justify",
                          }}
                        >
                          {row.category}
                        </TableCell>
                        <TableCell>
                          {moment(row.uploadedDate).format("DD-MM-YYYY HH:mm")}
                        </TableCell>
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

export default DocumentUploadWithCategory;
