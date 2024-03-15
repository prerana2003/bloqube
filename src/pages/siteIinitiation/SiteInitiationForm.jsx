import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import originalConfig from './visitCRF.json';
import { bloqcibeApi, useGetTrialSiteInfoQuery, useSubmitSiteInitAnswersMutation, useUpdateSiteInitAnswersMutation, useUploadInitiationFileMutation, useUploadSignatureMutation, useVerifySiteInitAnswersMutation } from "../../store/slices/apiSlice";
import { useSelector } from "react-redux";
import { base64ToArrayBuffer } from "../../components/common/DocumentUpload";
import { base64ImageToBlob, getUserRole } from "../util";
import _ from 'lodash'
import RightArrow from "../../components/icons/RightArrow";
import DynamicFormEngine from "../dynamicFormEngine";

const SiteInitiationForm = () => {
  const navigate = useNavigate();
  let { trialId, trialSiteId, siteInitStep } = useParams();
  const sponsorId = useSelector((state) => state.auth.sponsorId);
  const [formConfig, setFormConfig] = useState(null);
  // const [formConfig, setFormConfig] = useState(originalConfig.steps.find((_obj) => _obj.key == siteInitStep));
  const [readOnly, setReadOnly] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('');
  const [userSiteTrialRole, setUserSiteTrialRole] = useState();
  const [formAnswers, setFormAnswers] = useState();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [selectedSectionKey, setSelectedSectionKey] = useState();
  const [selectedSubSectionKey, setSelectedSubSectionKey] = useState();
  const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
  const [downloadSignature] =
    bloqcibeApi.endpoints.downloadSignature.useLazyQuery();
  const [getTrialSiteAnswers] = bloqcibeApi.endpoints.getTrialSiteAnswers.useLazyQuery();
  const [submitSiteInittAnswers] = useSubmitSiteInitAnswersMutation();
  const [updateSiteInittAnswers] = useUpdateSiteInitAnswersMutation();
  const [verifySiteInittAnswers] = useVerifySiteInitAnswersMutation();
  const [uploadSignature] = useUploadSignatureMutation();
  const { data: trialSiteData } = useGetTrialSiteInfoQuery({
    sponsorId: sponsorId,
    trialId: trialId,
    siteTrialId: trialSiteId,
  });
  const [stepStatusData, setStepStatusData] = useState([])
  const [uploadInitiationFile]=useUploadInitiationFileMutation()
  const [downloadInitiationFile] = bloqcibeApi.endpoints.downloadInitiationFile.useLazyQuery();

  useEffect(() => {
    (async () => {
      let _config = null;
      if (siteInitStep) {
        const formDetailsData = await getLibraryForm(
          `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/metastatic-melanoma-site-init`
        );
        if (formDetailsData.data) {
          _config = formDetailsData.data.steps.find(
            (_obj) => _obj.key == siteInitStep
          );
          setFormConfig(_config);
        } else if (formDetailsData.error) {
          console.error("UNABLE TO GET FORM DETAILS");
        }
      }
    })();
  }, [siteInitStep]);
  useEffect(() => {
    (async () => {
      if (trialSiteData) {
        const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
        setUserSiteTrialRole(userRole);
        setStepProperty(selectedSectionKey, selectedSubSectionKey)
      }
    })();
  }, [trialSiteData]);

  const onFormChanged = async (sectionKey, subSectionKey) => {
    setReadOnly(false);
    setButtonLabel('');
    setSelectedSectionKey(sectionKey)
    setSelectedSubSectionKey(subSectionKey)
    const _answers = await getTrialSiteAnswers({
      sponsorId: sponsorId,
      trialId: trialId,
      trialSiteId: trialSiteId,
      payload: {
        siteInitiationMasterId: trialSiteData?.siteTrialData?.siteInitiationMaster?.id,
        stepKey: siteInitStep,
        sectionKey: sectionKey,
        subSectionKey: subSectionKey
      }
    })
    setFormAnswers(_answers.data);
    setStepProperty(sectionKey, subSectionKey);
  }
  const setStepProperty = (sectionKey, subSectionKey) => {
    const orderedSteps = _.sortBy(trialSiteData?.siteTrialData?.siteInitiationMaster?.stepStatus, 'order');
    const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
    let buttonLabel = '';
    if(orderedSteps) setStepStatusData(orderedSteps?.find((_obj) => _obj?.stepKey === siteInitStep))
    const siteInitStatus = trialSiteData?.siteTrialData?.status;
    if (siteInitStatus == 'Completed') {
      setReadOnly(true);
      return;
    }
    const stepStatusData = orderedSteps.find((_obj) => _obj.stepKey === siteInitStep);
    if (stepStatusData) {
      const userAccess = JSON.parse(stepStatusData.userAccess);
      let sectionStatus = _.filter(stepStatusData.sectionStatuses, (statusData) => {
        return statusData.sectionKey == sectionKey
      })[0]?.status;
      //If step doesn't have any tab
      if (!sectionStatus) {
        sectionStatus = stepStatusData.status;
      }
      if (sectionStatus == 'Pending') {
        const editAccess = userAccess.edit;
        const isAccess = _.find(editAccess, (access) => {
          return access == userRole;
        })
        if (isAccess) {
          buttonLabel = 'Submit';
        } else {
          setReadOnly(true);
        }
      } else if (sectionStatus == 'Verification_Pending') {
        const verifyAccess = userAccess.verify;
        const editAccess = userAccess.edit;
        let isAccess = _.find(verifyAccess, (access) => {
          return access == userRole;
        })
        const isEditAccess = _.find(editAccess, (access) => {
          return access == userRole;
        })
        if (isAccess) {
          buttonLabel = `Verify`;
        } else if (isEditAccess) {
          buttonLabel = `Update`;
        } else {
          setReadOnly(true);
        }
      } else if (sectionStatus == 'Completed') {
        const editAccess = userAccess.edit;
        const isAccess = _.find(editAccess, (access) => {
          return access == userRole;
        })
        if (isAccess) {
          buttonLabel = 'Update';
        } else {
          setReadOnly(true);
        }
      }
      setButtonLabel(buttonLabel);
    }
  }

  const handleSaveSignature = async (keys, fieldName, setFieldValueFun) => {
    const formData = new FormData();
    formData.append("file", base64ImageToBlob(keys.file));
    formData.append("siteInitiationMasterId", trialSiteData?.siteTrialData?.siteInitiationMaster?.id);
    formData.append("stepKey", keys.stepKey);
    formData.append("sectionKey", keys.sectionKey);
    formData.append("subSectionKey", keys.subSectionKey);
    formData.append("categoryKey", keys.categoryKey);
    formData.append("fieldKey", keys.fieldKey);
    const result = await uploadSignature({
      payload: formData,
      sponsorId: sponsorId,
      trialId: trialId,
      trialSiteId: trialSiteId,
    });
    setFieldValueFun(fieldName, result.data.s3Key);
  }
  const handleDownloadSignature = async (s3Key, setSign) => {
    const result = await downloadSignature({
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
  const handleSave = async (data) => {
    const payload = {
      siteInitiationMasterId: trialSiteData?.siteTrialData?.siteInitiationMaster?.id,
      stepKey: data.stepKey,
      sectionKey: data.sectionKey,
      subSectionKey: data.subSectionKey ? data.subSectionKey : '',
      answers: data.answers
    }
    if (buttonLabel == 'Update') {
      await updateSiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
    } else if (buttonLabel == 'Verify') {
      await verifySiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
    } else {
      await submitSiteInittAnswers({ sponsorId, trialId, trialSiteId, payload })
    }
  }

  const handleUploadFile = async (keys, fieldName, setFieldValueFun) => {
    const formData = new FormData();
    formData.append("file", keys.file);
    formData.append("siteInitiationMasterId", trialSiteData?.siteTrialData?.siteInitiationMaster?.id);
    formData.append("stepKey", keys.stepKey);
    formData.append("sectionKey", keys.sectionKey);
    formData.append("subSectionKey", keys.subSectionKey ? keys.subSectionKey : '');
    formData.append("categoryKey", keys.categoryKey);
    formData.append("fieldKey", keys.fieldKey);
    const result = await uploadInitiationFile({
      payload: formData,
      sponsorId: sponsorId,
      trialId: trialId,
      siteId: trialSiteData?.siteTrialData?.site?.id,
    });
    setFieldValueFun(fieldName, result.data.s3Key);
  }

  const handleDownloadFile = async (s3Key, fileName, setSelectedFile) => {
    const result = await downloadInitiationFile({
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
      console.log("Failed to load file");
    }
  }

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
      {originalConfig && trialSiteData && (
        <DynamicFormEngine
          formConfig={formConfig}
          userSiteTrialRole={userSiteTrialRole}
          readOnly={readOnly}
          buttonLabel={buttonLabel}
          showButton={true}
          onFormChanged={onFormChanged}
          handleSave={(payload) => {
            handleSave(payload);
          }}
          handleSaveSignature={handleSaveSignature}
          handleDownloadSignature={handleDownloadSignature}
          formAnswers={formAnswers}
          handleUploadFile={handleUploadFile}
          handleDownloadFile={handleDownloadFile}
          stepStatusData={ stepStatusData}
        />
      )}
    </>
  );
};

export default SiteInitiationForm;