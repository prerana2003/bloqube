import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import originalConfig from './visitCRF.json';
import { bloqcibeApi, useAddFieldSubjectEnrollmentMutation, useGetSubjectDetailQuery, useGetTrialSiteInfoQuery, useSaveVisitAnswersMutation, useSubmitSiteInitAnswersMutation, useUpdateSiteInitAnswersMutation, useUploadCRFFileMutation, useUploadSignatureMutation, useUploadVisitSignatureMutation, useVerifySiteInitAnswersMutation } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import { base64ToArrayBuffer } from "../../components/common/DocumentUpload";
import { base64ImageToBlob, createNewFields, getUserRole } from "../util";
import _ from 'lodash'
import RightArrow from "../../components/icons/RightArrow";
import DynamicFormEngine from "../dynamicFormEngine";
import { mergeCustomFields } from "../../util/util";

const SubjectCRFForm = () => {
  const navigate = useNavigate();
  let { trialId, trialSiteId, siteInitStep, crfMasterId, subjectMasterId } = useParams();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [originalFormConfig, setOriginalFormConfig] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  // const [formConfig, setFormConfig] = useState(originalConfig.steps.find((_obj) => _obj.key == siteInitStep));
  const [readOnly, setReadOnly] = useState(false);
  const [userSiteTrialRole, setUserSiteTrialRole] = useState();
  const [formAnswers, setFormAnswers] = useState();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [selectedSectionKey, setSelectedSectionKey] = useState();
  const [selectedSubSectionKey, setSelectedSubSectionKey] = useState();
  const [stepStatusData, setStepStatusData] = useState([])
  const { data: subjectDetailWithSteps } = useGetSubjectDetailQuery(subjectMasterId);
  const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
  const [getEConsentFormConfig, { data: formData }] =
    bloqcibeApi.endpoints.getEConsentFormConfig.useLazyQuery();
  const [downloadVisitSignature] =
    bloqcibeApi.endpoints.downloadVisitSignature.useLazyQuery();
  const [downloadCRFFile] =
    bloqcibeApi.endpoints.downloadCRFFile.useLazyQuery();
  const [getVisitAnswers] = bloqcibeApi.endpoints.getVisitAnswers.useLazyQuery();
  const [getSubjectAnswers] =
  bloqcibeApi.endpoints.getSubjectAnswers.useLazyQuery();
  const [saveVisitAnswers] = useSaveVisitAnswersMutation();
  const [uploadVisitSignature] = useUploadVisitSignatureMutation();
  const [uploadCRFFile] = useUploadCRFFileMutation();
  const { data: trialSiteData } = useGetTrialSiteInfoQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteTrialId: trialSiteId,
  });
  const [siteId, setSiteId] = useState(null);
  const [labelModel, setLabelModel] = useState({
    open: false,
    fieldKey: "",
  });
  const [label, setLabel] = useState("");
  const [addFieldSubjectEnrollment] = useAddFieldSubjectEnrollmentMutation();

  useEffect(() => {
    (async () => {
      if (siteInitStep && trialSiteData) {
        setSiteId(trialSiteData.siteTrialData.siteId);
        const _formDetailsData = await getLibraryForm(
          `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/crf_configuration_forms`
        );
        if (_formDetailsData.data) {
          setOriginalFormConfig(_formDetailsData.data);
        } else if (_formDetailsData.error) {
          console.error("UNABLE TO GET FORM DETAILS");
        }

        const formDetailsData = await getEConsentFormConfig({
          sponsorId,
          trialId,
          siteId: trialSiteData.siteTrialData.siteId,
          documentKey: "crf_configuration_forms",
          payload: {
            subjectMasterId: subjectMasterId
          }
        });
        if (formDetailsData.data) {
          let _tempConfig = { ..._formDetailsData.data };
          const mergedConfig = mergeCustomFields(_tempConfig, formDetailsData.data);
          setFormConfig(
            mergedConfig.steps.find((_obj) => _obj.key === siteInitStep)
          );
        } else if (formDetailsData.error) {
          console.error("UNABLE TO GET FORM DETAILS");
        } else {
          setFormConfig(
            _formDetailsData.data.steps.find((_obj) => _obj.key === siteInitStep)
          );
        }
        await getSubjectAnswers({
          sponsorId,
          trialId,
          siteId:trialSiteData.siteTrialData.siteId,
          payload: {
              subjectMasterId: subjectMasterId,
          },
      });
      }
    })();
  }, [siteInitStep, trialSiteData]);
  useEffect(() => {
    (async () => {
      if (trialSiteData) {
        const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
        setUserSiteTrialRole(userRole);
      }
    })();
  }, [trialSiteData]);
  useEffect(() => {
    (async () => {
      if (subjectDetailWithSteps) {
        setStepProperty(selectedSectionKey, selectedSubSectionKey)
      }
    })();
  }, [subjectDetailWithSteps]);
  const setStepProperty = (sectionKey, subSectionKey) => {
    const stepStatusData = subjectDetailWithSteps?.crfDetail?.stepStatus?.find((_obj) => _obj.stepKey === siteInitStep);
    if (stepStatusData) {
      setStepStatusData(stepStatusData)
      let sectionStatus;
      let sectionStatusObj = _.filter(stepStatusData.sectionStatuses, (statusData) => {
        return statusData.sectionKey == sectionKey
      });

      if (sectionStatusObj && sectionStatusObj.length > 0) {
        if (subSectionKey && sectionStatusObj[0].subSectionStatuses) {
          sectionStatus = _.filter(sectionStatusObj[0].subSectionStatuses, (_statusData) => {
            return _statusData.subSectionKey == subSectionKey
          })[0]?.status;
        } else {
          sectionStatus = sectionStatusObj[0]?.status;
        }
      } else {
        sectionStatus = stepStatusData.status;
      }
      if (sectionStatus == 'Completed') {
        setReadOnly(true);
      }
    }
  }

  const onFormChanged = async (sectionKey, subSectionKey) => {
    setReadOnly(false);
    setSelectedSectionKey(sectionKey)
    setSelectedSubSectionKey(subSectionKey)
    const _answers = await getVisitAnswers({
      sponsorId: sponsorId,
      trialId: trialId,
      siteId: trialSiteData?.siteTrialData?.site?.id,
      payload: {
        crfMasterId: crfMasterId,
        subjectMasterId: subjectMasterId,
        stepKey: siteInitStep,
        sectionKey: sectionKey,
        subSectionKey: subSectionKey
      }
    })
    setFormAnswers(_answers.data);
    setStepProperty(sectionKey, subSectionKey);
  }
  const handleUploadFile = async (keys, fieldName, setFieldValueFun) => {
    const formData = new FormData();
    formData.append("file", keys.file);
    formData.append("crfMasterId", crfMasterId);
    formData.append("stepKey", keys.stepKey);
    formData.append("sectionKey", keys.sectionKey);
    formData.append("subSectionKey", keys.subSectionKey ? keys.subSectionKey : '');
    formData.append("categoryKey", keys.categoryKey);
    formData.append("fieldKey", keys.fieldKey);
    const result = await uploadCRFFile({
      payload: formData,
      sponsorId: sponsorId,
      trialId: trialId,
      siteId: trialSiteData?.siteTrialData?.site?.id,
    });
    setFieldValueFun(fieldName, result.data.s3Key);
  }
  const handleSaveSignature = async (keys, fieldName, setFieldValueFun) => {
    const formData = new FormData();
    formData.append("file", base64ImageToBlob(keys.file));
    formData.append("crfMasterId", crfMasterId);
    formData.append("stepKey", keys.stepKey);
    formData.append("sectionKey", keys.sectionKey);
    formData.append("subSectionKey", keys.subSectionKey ? keys.subSectionKey : '');
    formData.append("categoryKey", keys.categoryKey);
    formData.append("fieldKey", keys.fieldKey);
    const result = await uploadVisitSignature({
      payload: formData,
      sponsorId: sponsorId,
      trialId: trialId,
      siteId: trialSiteData?.siteTrialData?.site?.id,
    });
    setFieldValueFun(fieldName, result.data.s3Key);
  }
  const handleDownloadSignature = async (s3Key, setSign) => {
    const result = await downloadVisitSignature({
      s3Key: s3Key,
    });
    if (result.data) {
      const byteArray = base64ToArrayBuffer(result.data);
      const rr = new Blob([byteArray], { type: "application/octet-stream" });
      const reader = new FileReader();
      reader.readAsDataURL(rr);
      reader.onloadend = function () {
        const base64data = reader.result;
        setSign(base64data);
      };
    } else {
      console.log("Failed to load signature");
    }
  }
  const handleDownloadFile = async (s3Key, fileName, setSelectedFile) => {
    const result = await downloadCRFFile({
      s3Key: s3Key,
    });
    if (result.data) {
      let byteArray = base64ToArrayBuffer(result.data);
      let a = window.document.createElement("a");
      a.href = window.URL.createObjectURL(
        new Blob([byteArray], { type: "application/octet-stream" })
      );
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setSelectedFile && setSelectedFile(new Blob([byteArray], { type: "application/octet-stream" }))
    } else {
      console.log("Failed to load signature");
    }
  }
  const handleSave = async (data) => {
    const payload = {
      crfMasterId: crfMasterId,
      subjectMasterId: subjectMasterId,
      documentKey: '',
      documentVersion: '',
      stepKey: data.stepKey,
      sectionKey: data.sectionKey,
      subSectionKey: data.subSectionKey ? data.subSectionKey : '',
      answers: data.answers
    }
    console.log("data.answers", data.answers);
    await saveVisitAnswers({ sponsorId, trialId, siteId: trialSiteData?.siteTrialData?.site?.id, payload })
  }

  const findObjectByValue = async (obj, targetValue, path = [], keys) => {
    for (const key in obj) {
      if (obj[key] === targetValue) {
        let configFields = obj?.addFields;
        let needLabelField = _.find(configFields, {
          needLabel: true,
        });
        if (configFields && needLabelField && !label) {
          setLabelModel({
            open: true,
            fieldKey: obj.key,
          });
          return null;
        } else if (configFields && needLabelField && label) {
          const attachedLabel = configFields.map((field) => {
            if (field.needLabel === true) {
              return {
                ...field,
                label: label,
              };
            } else {
              return field;
            }
          });
          const newFields = createNewFields(
            attachedLabel,
            obj.fields.length + 1
          );
          const _formConfig = await addFieldSubjectEnrollment({
            sponsorId,
            trialId,
            siteId: siteId,
            payload: {
              documentKey: keys.documentKey,
              stepKey: siteInitStep,
              subjectMasterId: subjectMasterId,
              sectionKey: keys.sectionKey,
              subSectionKey: keys.subSectionKey,
              categoryKey: keys.categoryKey,
              fields: newFields,
            },
          });
          let _tempConfig = { ...originalFormConfig };
          const mergedConfig = mergeCustomFields(_tempConfig, _formConfig.data);
          setFormConfig(
            mergedConfig.steps.find((_obj) => _obj.key === siteInitStep)
          );
          break;
        } else if (configFields) {
          const newFields = createNewFields(
            configFields,
            obj.fields.length + 1
          );
          const _formConfig = await addFieldSubjectEnrollment({
            sponsorId,
            trialId,
            siteId: siteId,
            payload: {
              documentKey: keys.documentKey,
              stepKey: siteInitStep,
              subjectMasterId: subjectMasterId,
              sectionKey: keys.sectionKey,
              subSectionKey: keys.subSectionKey,
              categoryKey: keys.categoryKey,
              fields: newFields,
            },
          });
          let _tempConfig = { ...originalFormConfig };
          const mergedConfig = mergeCustomFields(_tempConfig, _formConfig.data);
          setFormConfig(
            mergedConfig.steps.find((_obj) => _obj.key === siteInitStep)
          );
          break;
        } else {
          console.error("'newFields' key not found ");
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Continue searching in the nested object
        const result = await findObjectByValue(
          obj[key],
          targetValue,
          [...path, key],
          keys
        );
        if (result) {
          return result;
        }
      }
    }
    // Value not found in the current object
    return null;
  };

  const addNewField = (parentKey, keys) => {
    const valChange = JSON.parse(JSON.stringify(formConfig));
    findObjectByValue(valChange, parentKey, [], {
      documentKey: "crf_configuration_forms",
      ...keys,
    });
  };

  return (
    <>
      <Button
        type="text"
        onClick={() => navigate(-1)}
        startIcon={<RightArrow leftArrow />}
      >
        <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
          Back
        </Typography>
      </Button>
      {formConfig && trialSiteData && (
        <DynamicFormEngine
          formConfig={formConfig}
          userSiteTrialRole={userSiteTrialRole}
          //readOnly={readOnly}
          onFormChanged={onFormChanged}
          handleSave={(payload) => {
            handleSave(payload);
          }}
          handleSaveSignature={handleSaveSignature}
          handleUploadFile={handleUploadFile}
          handleDownloadFile={handleDownloadFile}
          handleDownloadSignature={handleDownloadSignature}
          formAnswers={formAnswers}
          AddNewField={addNewField}
          stepStatusData={stepStatusData}
        />
      )}
      <Dialog
        onClose={() => {
          setLabelModel({
            ...labelModel,
            open: false,
          });
        }}
        maxWidth={"sm"}
        open={labelModel.open}
        sx={{
          dialogPaper: {
            minHeight: "80vh",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>Enter label</DialogTitle>
        <DialogContent sx={{ minHeight: "10vh", minWidth: "40vW" }}>
          <TextField
            label="Label"
            value={label}
            sx={{ mt: 2 }}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelModel({ ...labelModel, open: false })}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              addNewField(labelModel.fieldKey);
              setLabelModel({ ...labelModel, open: false, fieldKey: "" });
              setLabel("");
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubjectCRFForm;