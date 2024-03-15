import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  useTheme,
  TextField,
  typographyClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DocumentUpload from "../../components/common/DocumentUpload";
import {
  bloqcibeApi,
  useGetTrialDocTypesQuery,
  useGetTrialDocumentsQuery,
} from "../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import CloudDoneIcon from "@mui/icons-material/CloudDone";

const DocumentsSection = ({ trialId,BoxName,touchedState, errorState,handleDocumentValidation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedDocTypeData, setSelectedDocTypeData] = useState([]);
  const [disableNewUpload, setDisableNewUpload] = useState(true);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [addNewCategory, setNewCategory] = useState({
    name: "",
    state: false,
  });
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [getTrialDocuments, { data: trialDocumentData }] =
    bloqcibeApi.endpoints.getTrialDocuments.useLazyQuery();

  const { data: doctypes } = useGetTrialDocTypesQuery();
  const [documentMeta, setDocumentMeta] = useState([]);

  useEffect(() => {
    (async () => {
      await getTrialDocuments({ trialId, sponsorId });
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (trialDocumentData && doctypes) {
        trialDocumentData.length!==0?handleDocumentValidation(false):handleDocumentValidation(true)
        const metaData = doctypes.map((_obj) => _obj.type);
        const result = _.groupBy(trialDocumentData, "category");
        if (selectedDocType && !_.keys(result).includes(selectedDocType)) {
          setSelectedDocTypeData([]);
        }
        _.each(_.keys(result), (type, index) => {
          if (!metaData.includes(type)) {
            metaData.push(type);
          }
          if (selectedDocType) {
            if (selectedDocType == type) {
              setSelectedDocTypeData(result[type]);
            }
          }
        });
        setDocumentMeta(metaData);
      }
    })();
  }, [trialDocumentData, doctypes]);

  useEffect(() => {
    if (addNewCategory.name.length >= 3) {
      setDisableNewUpload(false);
    } else {
      setDisableNewUpload(true);
    }
  }, [addNewCategory]);

  const openUploadDocument = (docType) => {
    const result = _.groupBy(trialDocumentData, "category");
    _.each(_.keys(result), (type, index) => {
      if (docType == type) {
        setSelectedDocTypeData(result[type]);
      }
    });
    setSelectedDocType(docType);
    setOpen(true);
  };

  const onDocUpload = async () => {
    await getTrialDocuments({ trialId, sponsorId });
  };

  const docUploadedForSelectedCategory = (cat) => {
    return trialDocumentData.find((item) => item.category === cat);
  };

  const onClose = () => {
    setSelectedDocType(null);
    setSelectedDocTypeData([]);
    setOpen(false);
  };

  const handleAddNewCategory = () => {
    setNewCategory({ ...addNewCategory, state: true });
  };

  const handleNewDocumentUpload = () => {
    setDocumentMeta([...documentMeta, addNewCategory.name]);
    setNewCategory({ ...addNewCategory, state: false });
    openUploadDocument(addNewCategory.name);
  };

  return (
    <>
      <Card sx={{border:touchedState&&errorState&&`1px solid ${theme.palette.error.main}`, }}>
        <CardHeader
          title="eTMF Documents"
          titleTypographyProps={{ variant: "h6" }}
          action={
            <Button variant="text" onClick={handleAddNewCategory}>
              <Typography variant="subtitle1" color="primary">
                + Add New
              </Typography>
            </Button>
          }
        />
        <CardContent>
          {documentMeta.map((document, key) => {
            return (
              <Box
                key={key}
                sx={{
                  border: `1px solid ${theme.palette.grey[400]}`,
                  p: 1.5,
                  px: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color={`${theme.palette.text.secondary}`}
                >
                  {document}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", columnGap: 2 }}
                >
                  {docUploadedForSelectedCategory(document) && (
                    <CloudDoneIcon color="success" />
                  )}
                  <IconButton
                    color="secondary"
                    onClick={() => openUploadDocument(document)}
                  >
                    <AttachFileOutlinedIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          {addNewCategory.state && (
            <Box
              sx={{
                border: `1px solid ${theme.palette.grey[400]}`,
                p: 1.5,
                px: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Add Category"
                size="small"
                value={addNewCategory.name}
                onChange={(e) => {
                  setNewCategory((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }));
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
                <IconButton
                  color="secondary"
                  disabled={disableNewUpload}
                  onClick={handleNewDocumentUpload}
                >
                  <AttachFileOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
        </Card>
        {touchedState && errorState && <Typography variant="body1" color={theme.palette.error.main} sx={{ pt:1, pl:2}}>{errorState }</Typography>}
        <DocumentUpload
        open={open}
        handleClose={onClose}
        trialId={trialId}
        onDocUpload={onDocUpload}
        selectedDocType={selectedDocType}
        selectedDocTypeData={selectedDocTypeData}
      />
      <input type="hidden" name={BoxName}/>
    </>
  );
};

export default DocumentsSection;
