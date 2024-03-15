import React, { useEffect, useState } from 'react'
// import originalConfig from './subjectWithdrawal.json';
import { Button, Typography } from '@mui/material';
import RightArrow from '../../components/icons/RightArrow';
import DynamicFormEngine from '../dynamicFormEngine';
import { useSelector } from 'react-redux';
import { bloqcibeApi, useGetTrialSiteInfoQuery, useSaveWithdrawSubAnswersMutation, useUploadSubjectSignatureMutation } from '../../store/slices/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { base64ImageToBlob, getUserRole } from '../util';
import { base64ToArrayBuffer } from '../../components/common/DocumentUpload';

const SubjectWithdrawForm = () => {
    let { trialId, trialSiteId, crfMasterId, subjectMasterId } = useParams();
    const sponsorId = useSelector((state) => state.auth.sponsorId);
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.auth.user);
    const [userSiteTrialRole, setUserSiteTrialRole] = useState();
    const [siteId, setSiteId] = useState(null);
    const [formConfig, setFormConfig] = useState(null);
    // const [formConfig, setFormConfig] = useState(originalConfig.steps.find((_obj) => _obj.key == "Subject_Withdrawal_Form"));
    const [getLibraryForm] = bloqcibeApi.endpoints.getLibraryForm.useLazyQuery();
    const [saveWithdrawSubAnswers] = useSaveWithdrawSubAnswersMutation()
    const [uploadSubjectSignature] = useUploadSubjectSignatureMutation();
    const [downloadSubjectSignature] = bloqcibeApi.endpoints.downloadSubjectSignature.useLazyQuery();
    const { data: trialSiteData } = useGetTrialSiteInfoQuery({
        sponsorId: sponsorId,
        trialId: trialId,
        siteTrialId: trialSiteId,
    });
    
    useEffect(() => {
        (async () => {
          if (trialSiteData) {
            setSiteId(trialSiteData.siteTrialData.siteId);
            const _formDetailsData = await getLibraryForm(
              `${process.env.REACT_APP_API_ENDPOINT_URL}form-library/library/bloqcube/subject-withdrawal-process`
            );
              if (_formDetailsData.data) {
                setFormConfig(
                    _formDetailsData.data.steps.find((_obj) => _obj.key === "Subject_Withdrawal_Form")
                  );
              } else if (_formDetailsData.error){
                  console.log("UNABLE TO GET DYNAMIC FORM");
              }
    
          }
        })();
    }, [trialSiteData]);

    useEffect(() => {
        (async () => {
          if (trialSiteData) {
            const userRole = getUserRole(loggedInUser, trialId, trialSiteData?.siteTrialData?.site?.id);
            setUserSiteTrialRole(userRole);
          }
        })();
      }, [trialSiteData]);
    
    const handleSave = async (data) => {
        const payload = {
          crfMasterId: crfMasterId,
          subjectMasterId: subjectMasterId,
          documentKey: 'subject-withdrawal-process',
          documentVersion: '1.0',
          stepKey: data.stepKey,
          sectionKey: data.sectionKey,
          subSectionKey: data.subSectionKey ? data.subSectionKey : '',
          answers: data.answers
        }
      const res = await saveWithdrawSubAnswers({ sponsorId, trialId, siteId: trialSiteData?.siteTrialData?.site?.id, payload })
      if(res.data) navigate(`/trial/${trialId}/trial-site/${trialSiteId}`)
      }

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

  return (
    <div>
      <Button
        type="text"
        onClick={() => navigate(-1)}
        startIcon={<RightArrow leftArrow />}
      >
        <Typography variant="subtitle1" sx={{ textTransform: "none" }}>
          Back
        </Typography>
      </Button>
      {formConfig  && (
        <DynamicFormEngine
          formConfig={formConfig}
          userSiteTrialRole={userSiteTrialRole}
          handleSave={(payload) => {
            handleSave(payload);
          }}
          handleDownloadSignature={handleDownloadSignature}
          handleSaveSignature={handleSaveSignature}
        //   formAnswers={formAnswers}
        //   stepStatusData={stepStatusData}
        />
      )} 
    </div>
  )
}

export default SubjectWithdrawForm
