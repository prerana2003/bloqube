import React, { useEffect, useMemo, useState } from "react";
import originalConfig from "./subjectEnrolForms.json";
import DynamicFormEngine from "../dynamicFormEngine";
import {
  bloqcibeApi,
  useAddFieldSubjectEnrollmentMutation,
  useGetSubjectDetailQuery,
  useGetTrialSiteInfoQuery,
  useSaveSubjectEnrollInfoMutation,
  useUploadSubjectFileMutation,
  useUploadSubjectSignatureMutation,
} from "../../store/slices/apiSlice";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  Typography,
  TextField,
  DialogContent,
  DialogActions,
  Box,
  MenuItem,
  Select,
  FormControl,
  Divider,
} from "@mui/material";
import RightArrow from "../../components/icons/RightArrow";
import {
  base64ImageToBlob,
  createNewFields,
  getUserRole,
} from "../util";
import { base64ToArrayBuffer } from "../../components/common/DocumentUpload";
import { mergeCustomFields } from "../../util/util";
import { AUDIO_LANGUAGES } from "../../util/constants";
import { setConsentLanguage } from "../../store/slices/subjectSlice";
import { selectCurrentUser } from "../../store/slices/authSlice";

const EnrollSubject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { trialId, trialSiteId, siteInitStep, subjectMasterId } = useParams();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const user = useSelector(selectCurrentUser);
  const subjectLoggedIn = useSelector((state) => state.auth.subjectLoggedIn);
  const [originalFormConfig, setOriginalFormConfig] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  // const [formConfig, setFormConfig] = useState(
  //   originalConfig.steps.find((_obj) => _obj.key == siteInitStep)
  // );
  const [siteId, setSiteId] = useState(null);
  const [userSiteTrialRole, setUserSiteTrialRole] = useState();
  const loggedInUser = useSelector((state) => state.auth.user);
  const consentLanguage = useSelector((state) => state.subject.consentLanguage);
  const [downloadSubjectSignature] =
    bloqcibeApi.endpoints.downloadSubjectSignature.useLazyQuery();
  const [getEConsentFormConfig, { data: formData }] =
    bloqcibeApi.endpoints.getEConsentFormConfig.useLazyQuery();
  const [uploadSubjectSignature] = useUploadSubjectSignatureMutation();
  const [addFieldSubjectEnrollment] = useAddFieldSubjectEnrollmentMutation();
  const [uploadSubjectFile] = useUploadSubjectFileMutation();
  const [getSubjectDashboardDetail] =
    bloqcibeApi.endpoints.getSubjectDashboardDetail.useLazyQuery();
  const [downloadSubjectFile] =
    bloqcibeApi.endpoints.downloadSubjectFile.useLazyQuery();
  const [getSubjectDetail, { data: subjectDetailWithSteps }] = bloqcibeApi.endpoints.getSubjectDetail.useLazyQuery();
  const { data: trialSiteinfo } = useGetTrialSiteInfoQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteTrialId: trialSiteId,
  });
  const [formAnswers, setFormAnswers] = useState();
  const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
  const [getSubjectAnswers] =
    bloqcibeApi.endpoints.getSubjectAnswers.useLazyQuery();
  const [saveSubjectEnrollInfo] = useSaveSubjectEnrollInfoMutation();
  const [signatureData, setSignatureData] = useState([]);
  const [labelModel, setLabelModel] = useState({
    open: false,
    fieldKey: "",
  });
  const [label, setLabel] = useState("");

  useEffect(() => {
    (async () => {
      if (subjectMasterId) {
      await getSubjectDetail(subjectMasterId);
    }
  })()
}, [subjectMasterId]);

  useEffect(() => {
    (async () => {
      setSignatureData([]);
      const formDetailsData = await getLibraryForm(
        `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/subject_enrollment_forms`
      );
      if (formDetailsData.data) {
        setOriginalFormConfig(formDetailsData.data);
      } else if (formDetailsData.error) {
        console.error("UNABLE TO GET FORM DETAILS");
      }
    })();
  }, [siteInitStep]);
  useEffect(() => {
    (async () => {
      if (trialSiteinfo) {
        setSiteId(trialSiteinfo.siteTrialData.siteId);
        const userRole = getUserRole(
          loggedInUser,
          trialId,
          trialSiteinfo?.siteTrialData?.site?.id
        );
        setUserSiteTrialRole(userRole);
        if (subjectMasterId) {
          const _answers = await getSubjectAnswers({
            sponsorId,
            trialId,
            siteId: trialSiteinfo.siteTrialData.siteId,
            payload: {
              subjectMasterId: subjectMasterId,
              stepKey: siteInitStep,
            },
          });
          //const valChange = JSON.parse(JSON.stringify(formConfig));
          //setFormConfig(valChange);
          setFormAnswers(_answers.data);
        }
      }
    })();
  }, [trialSiteinfo]);

  useEffect(() => {
    (async () => {
      if (siteId && originalFormConfig) {
        const formDetailsData = await getEConsentFormConfig({
          sponsorId,
          trialId,
          siteId,
          documentKey: "subject_enrollment_forms",
          payload: {
            subjectMasterId: subjectMasterId
          }
        });
        if (formDetailsData.data) {
          let _tempConfig = { ...originalFormConfig };
          const mergedConfig = mergeCustomFields(_tempConfig, formDetailsData.data);
          setFormConfig(
            mergedConfig.steps.find((_obj) => _obj.key === siteInitStep)
          );
        } else if (formDetailsData.error) {
          console.error("UNABLE TO GET FORM DETAILS");
        } else {
          setFormConfig(
            originalFormConfig.steps.find((_obj) => _obj.key === siteInitStep)
          );
        }
      }
    })();
  }, [siteId, originalFormConfig]);


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
            siteId: trialSiteinfo.siteTrialData.siteId,
            payload: {
              documentKey: keys.documentKey,
              stepKey: siteInitStep,
              sectionKey: keys.sectionKey,
              subSectionKey: keys.subSectionKey,
              categoryKey: keys.categoryKey,
              subjectMasterId: subjectMasterId,
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
            siteId: trialSiteinfo.siteTrialData.siteId,
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
      documentKey: originalFormConfig?.documentKey,
      ...keys,
    });
  };

  const handleSave = async (payload) => {
    const data = payload;
    if (subjectMasterId) {
      data.subjectMasterId = subjectMasterId;
    }

    data.documentKey = originalFormConfig.documentKey;
    data.documentVersion = originalFormConfig.documentVersion;
    data.crfDocumentKey = trialSiteinfo?.siteTrialData?.trial?.crfForm;
    data.crfDocumentVersion = "1.0";
    const result = await saveSubjectEnrollInfo({
      trialId: trialId,
      siteId: siteId,
      sponsorId: sponsorId,
      payload: data,
    }).then(async (responce) => {
      if (!subjectMasterId) {
        _.forEach(signatureData, (signChild, index) => {
          const formData = new FormData();
          _.forEach(signChild, (value, key) => {
            if (key === "file") {
              formData.append(key, base64ImageToBlob(value));
            } else {
              formData.append(key, value);
            }
          });
          formData.append("subjectMasterId", responce.data?.subjectMasterId);
          
          const result = uploadSubjectSignature({
            trialId: trialId,
            siteId: siteId,
            sponsorId: sponsorId,
            payload: formData,
          })
            .then((res) => {
              console.log("SIGN UPLOADED SUCESSFULLy", res);
              if (res.data) navigate(-1);
            })
            .catch((error) => {
              console.log("FAILED SIGN UPLOAD", error);
            });
        });
      }
      if(subjectLoggedIn) {
        getSubjectDashboardDetail(user.details[0][0]['userId']);
      }
    });
  };

  const handleSaveSignature = async (keys, fieldName, setFieldValueFun) => {
    if (subjectMasterId) {
      const formData = new FormData();
      formData.append("subjectMasterId", subjectMasterId);
      formData.append("file", base64ImageToBlob(keys.file));
      formData.append("stepKey", keys.stepKey);
      formData.append("sectionKey", keys.sectionKey);
      formData.append("subSectionKey", keys.subSectionKey);
      formData.append("categoryKey", keys.categoryKey);
      formData.append("fieldKey", keys.fieldKey);
      const result = await uploadSubjectSignature({
        payload: formData,
        sponsorId: sponsorId,
        trialId: trialId,
        siteId: siteId,
      });
      setFieldValueFun(fieldName, result.data.s3Key);
    } else {
      const _signData = {
        file: keys.file,
        stepKey: keys.stepKey,
        sectionKey: keys.sectionKey,
        subSectionKey: keys.subSectionKey,
        categoryKey: keys.categoryKey,
        fieldKey: keys.fieldKey,
      };
      const _SignatureData = [...signatureData];
      _SignatureData.push(_signData);
      setSignatureData(_SignatureData);
      setFieldValueFun(fieldName, "testSign");
    }
  };
  const handleDownloadSignature = async (s3Key, setSign) => {
    const result = await downloadSubjectSignature({
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
  };
  const handleUploadFile = async (keys, fieldName, setFieldValueFun) => {
    const formData = new FormData();
    formData.append("file", keys.file);
    formData.append("subjectMasterId", subjectMasterId);
    formData.append("stepKey", keys.stepKey);
    formData.append("sectionKey", keys.sectionKey);
    formData.append("subSectionKey", keys.subSectionKey ? keys.subSectionKey : '');
    formData.append("categoryKey", keys.categoryKey);
    formData.append("fieldKey", keys.fieldKey);
    const result = await uploadSubjectFile({
      payload: formData,
      sponsorId: sponsorId,
      trialId: trialId,
      siteId: siteId,
    });
    setFieldValueFun(fieldName, result.data.s3Key, true);
  }
  const handleDownloadFile = async (s3Key, fileName, setSelectedFile) => {
    const result = await downloadSubjectFile({
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
  const handleLanguageChange = (e) => {
    dispatch(setConsentLanguage(e.target.value))
  }

  const selectedFormStatus = useMemo(() => {
    if (siteInitStep && subjectDetailWithSteps) {
      const steps = _.sortBy(subjectDetailWithSteps?.stepStatus, 'order');
      const statusData = steps.find((_obj) => _obj.stepKey === siteInitStep);
      return statusData?.status;
    }
    return null
  }, [siteInitStep, subjectDetailWithSteps])
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
      {subjectLoggedIn &&
        <><Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
          <Typography sx={{ fontWeight: 600, color: '#2196f3' }}>Audio Language</Typography>
          <Box sx={{ width: '55%' }}>
            <FormControl fullWidth>
              <Select
                value={consentLanguage}
                onChange={handleLanguageChange}
              >
                {AUDIO_LANGUAGES.map((option) => {
                  return (
                    <MenuItem key={option.locale} value={option.locale}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
          <Divider sx={{ marginY: 2 }} /></>
      }
      {formConfig && (
        <DynamicFormEngine
          hideTab
          formConfig={formConfig}
          AddNewField={addNewField}
          userSiteTrialRole={userSiteTrialRole}
          handleUploadFile={handleUploadFile}
          handleDownloadFile={handleDownloadFile}
          handleSave={(payload) => {
            handleSave(payload);
          }}
          {...(subjectLoggedIn && { showSkeleton: selectedFormStatus == 'Completed' })}
          onFormChanged={() => { }}
          handleSaveSignature={handleSaveSignature}
          handleDownloadSignature={handleDownloadSignature}
          formAnswers={formAnswers}
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

export default EnrollSubject;
