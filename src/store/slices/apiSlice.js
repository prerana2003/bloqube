import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { base64ToArrayBuffer } from "../../components/common/DocumentUpload";
import { setProgress } from "./uploadProgressSlice";
import { openMessage } from "./showMessageSlice";

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (window.location.pathname !== '/login') {
      localStorage.clear();
      window.location.reload("/login");
    }
  }else if (result.error && (result.error.status === 500||result.error.status === 400)) {
      api.dispatch(openMessage({
          message: "Something went wrong!",
          messageSeverity: 'error'
      }))
  } else if (result.error && result.error.status == 'FETCH_ERROR') {
      api.dispatch(openMessage({
          message: "Service not available!",
          messageSeverity: 'error'
      }))
  }
  return result;
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_ENDPOINT_URL,
  // baseUrl: "https://api.dev.bloqcube.com/",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.token?.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Access-Control-Allow-Origin", "*");
    }
    return headers;
  },
});

export const bloqcibeApi = createApi({
  reducerPath: "bloqcibeApi",
  tagTypes: [
    "Trial",
    "TrialDocuments",
    "SiteList",
    "SiteBasicDetail",
    "TrialSiteDetail",
    "SubjectList",
    "FormConfig",
    "EnrollSubjectFormConfig",
    "DepartmentMeta",
    "SubjectWithdrawList",
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "system-admin/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createTrial: builder.mutation({
      query: ({ trialPayload, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial`,
        method: "POST",
        body: trialPayload,
      }),
      invalidatesTags: ["Trial"],
    }),
    getTrialDocuments: builder.query({
      query: ({ trialId, sponsorId, data }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/document/list`,
        method: "POST",
        body: data,
      }),
      providesTags:["TrialDocuments"]
    }),
    getSiteDocuments: builder.query({
      query: ({ trialId, sponsorId, siteId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/document/list`,
        method: "POST",
        body: { siteId: siteId },
      }),
    }),
    uploadDoc: builder.mutation({
      queryFn: async ({ url, formData, trialId, sponsorId }, api) => {
        try {
          const token = api.getState().auth.token?.access_token;
          const result = await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT_URL}trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/document`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              onUploadProgress: (upload) => {
                //Set the progress value to show the progress bar
                let uploadloadProgress = Math.round(
                  (100 * upload.loaded) / upload.total
                );
                //console.log("uploadloadProgress", uploadloadProgress);
                api.dispatch(setProgress(uploadloadProgress));
                //api.dispatch(setUploadProgress(uploadloadProgress));
              },
            }
          );
          return { data: result.data };
        } catch (axiosError) {
          let err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
      },
      invalidatesTags:["TrialDocuments"]
    }),
    createTrialPatch: builder.mutation({
      query: ({ id, trialPayload, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${id}/basic-detail`,
        method: "PATCH",
        body: trialPayload,
      }),
      invalidatesTags: ["Trial"],
    }),
    addSiteMember: builder.mutation({
      query: ({ sponsorId, data }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/user`,
        method: "POST",
        body: data,
      }),
    }),
    assignRole: builder.mutation({
      query: ({ sponsorId, data }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/assign-role`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TrialSiteDetail"],
    }),
    createTrialSitePatch: builder.mutation({
      query: ({ id, siteDetailsPayload, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${id}/site`,
        method: "POST",
        body: siteDetailsPayload,
      }),
      invalidatesTags: ["SiteList"],
    }),
    getTrials: builder.mutation({
      query: ({ filter, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/user-trials`,
        method: "POST",
        body: {
          filter: filter,
        },
      }),
    }),
    getTrialDetails: builder.query({
      query: ({ id, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${id}`,
      }),
      providesTags: (result, error, arg) => {
        return result ? [{ type: "Trial", id: result.id }, "Trial"] : ["Trial"];
      },
    }),
    getOngoingTrials: builder.query({
      query: (sponsorId) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trials/on-going`,
      }),
      providesTags: (result, error, arg) => {
        return result ? [{ type: "Trial", id: result.id }, "Trial"] : ["Trial"];
      },
    }),
    getTrialSiteDetails: builder.query({
      query: ({ trialId, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/sites`,
      }),
      providesTags: ["SiteList"],
    }),
    getSiteBasicDetails: builder.query({
      query: ({ sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/sites`,
      }),
      providesTags: ["SiteBasicDetail"],
    }),
    getSiteMembers: builder.query({
      query: ({ sponsorId, siteId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/site/${siteId}/users`,
      }),
    }),
    getTrialSiteMembers: builder.query({
      query: ({ sponsorId, trialId, siteId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/assign-users`,
      }),
    }),
    deleteTrialDocuments: builder.mutation({
      query: ({ trialId, s3Key, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/delete-document?key=${s3Key}`,
        method: "DELETE",
      }),
      invalidatesTags:["TrialDocuments"]
    }),
    deleteUserRole: builder.mutation({
      query: ({ user_role_id }) => ({
        url: `/trial-mgmt/sponsor/user/${user_role_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TrialSiteDetail"],
    }),
    getDownloadTrialDoc: builder.query({
      queryFn: async ({ trialId, fileName, s3Key, sponsorId }, api) => {
        try {
          const token = api.getState().auth.token?.access_token;
          const response = await axios.get(
            `${process.env.REACT_APP_API_ENDPOINT_URL}trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/download-documnet?key=${s3Key}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          var byteArray = base64ToArrayBuffer(response.data);
          var a = window.document.createElement("a");
          a.href = window.URL.createObjectURL(
            new Blob([byteArray], { type: "application/octet-stream" })
          );
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
        } catch (axiosError) {
          let err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
      },
    }),
    getTrialDocTypes: builder.query({
      query: () => ({
        url: `/trial-mgmt/doctypes`,
      }),
    }),
    updateTrialBankDetail: builder.mutation({
      query: ({ sponsorId, trialId, bankDetails }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/bank-detail/${bankDetails.id}`,
        method: "PATCH",
        body: bankDetails,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Trial", id: arg.trialId },
      ],
    }),
    updateTrialStudyDetail: builder.mutation({
      query: ({ sponsorId, trialId, studyDetail }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/study/${studyDetail.studyDetail.id}`,
        method: "PATCH",
        body: studyDetail,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Trial", id: arg.trialId },
      ],
    }),
    updateTrialPatch: builder.mutation({
      query: ({ id, trialPayload, sponsorId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${id}`,
        method: "PATCH",
        body: trialPayload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Trial", id: arg.trialId },
      ],
    }),
    ///trial-mgmt/sponsor/{sponsorId}/trial/{trialId}/trial-budget
    updateTrialBudgetDetail: builder.mutation({
      query: ({ sponsorId, trialId, budgetDetail }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/trial-budget`,
        method: "PATCH",
        body: budgetDetail,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Trial", id: arg.trialId },
      ],
    }),
    getSiteDocumentMeta: builder.query({
      query: () => ({
        url: "/trial-mgmt/site/doctypes",
      }),
    }),
    markTrialSetupDone: builder.mutation({
      query: ({ sponsorId, trialId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/Created`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Trial", id: arg.trialId },
        "Trial",
      ],
    }),
    getDepartmentMeta: builder.query({
      query: () => ({
        url: "/trial-mgmt/department",
      }),
      providesTags:["DepartmentMeta"]
    }),
    getDynamicDataValues: builder.query({
      query: ({ url }) => ({
        url: url,
      }),
    }),
    createSite: builder.mutation({
      query: ({ sponsorId, siteData }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/site`,
        body: siteData,
        method: "POST",
      }),
      invalidatesTags: ["SiteBasicDetail"],
    }),
    getTrialSiteInfo: builder.query({
      query: ({ sponsorId, trialId, siteTrialId }) => ({
        url: `/trial-mgmt/sponsor/${sponsorId}/trial/${trialId}/site-trial/${siteTrialId}`,
      }),
      providesTags: ["TrialSiteDetail"]
    }),
    getLibraryForm: builder.query({
      query: (path) => ({
        // url: `form-library/library/${path}`,
        url: path,
      }),
      providesTags: ["FormConfig"]
    }),
    uploadSignature: builder.mutation({
      query: ({ sponsorId, trialId, trialSiteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}/signture-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    uploadVisitSignature: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/signture-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    uploadCRFFile: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/document-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    uploadInitiationFile: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/document-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    uploadSubjectProfilePic: builder.mutation({
      query: ({ subjectMasterId, payload }) => ({
        url: `/e-consent/subject/${subjectMasterId}/profile-pic`,
        body: payload,
        method: "POST",
      }),
    }),
    uploadSubjectFile: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/document-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    downloadSignature: builder.query({
      query: ({ s3Key }) => ({
        url: `/trial-mgmt/questionnaire/signture`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadSubjectProfilePic: builder.query({
      query: ({ s3Key }) => ({
        url: `/e-consent/subject/subject/profile-pic`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadVisitSignature: builder.query({
      query: ({ s3Key }) => ({
        url: `/e-consent/crf/signture`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadCRFFile: builder.query({
      query: ({ s3Key }) => ({
        url: `/e-consent/crf/document`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadInitiationFile: builder.query({
      query: ({ s3Key }) => ({
        url: `/trial-mgmt/questionnaire/document`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadSubjectFile: builder.query({
      query: ({ s3Key }) => ({
        url: `/e-consent/subject/document`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    downloadSubjectSignature: builder.query({
      query: ({ s3Key }) => ({
        url: `/e-consent/subject/signture`,
        method: 'GET',
        params: {
          key: s3Key,
        },
      }),
    }),
    submitSiteInitAnswers: builder.mutation({
      query: ({ sponsorId, trialId, trialSiteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}`,
        body: payload,
        method: "POST",
      }),
      invalidatesTags: ["TrialSiteDetail"]
    }),
    updateSiteInitAnswers: builder.mutation({
      query: ({ sponsorId, trialId, trialSiteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}`,
        body: payload,
        method: "PUT",
      }),
      invalidatesTags:["TrialSiteDetail"]
    }),
    verifySiteInitAnswers: builder.mutation({
      query: ({ sponsorId, trialId, trialSiteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}`,
        body: payload,
        method: "PATCH",
      }),
      invalidatesTags:["TrialSiteDetail"]
    }),
    getTrialSiteAnswers: builder.query({
      query: ({ sponsorId, trialId, trialSiteId, payload }) => ({
        url: `/trial-mgmt/questionnaire/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}/site-init-answers`,
        body: payload,
        method: "POST"
      }),
    }),
    getVisitAnswers: builder.query({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/subject-answers`,
        body: payload,
        method: "POST"
      }),
    }),
    getSponsorDetails: builder.query({
      query: (sponsorId)=>({
        url:`/trial-mgmt/sponsor/${sponsorId}`
      })
    }),
    getSponsorLogo: builder.query({
      query: ({ key, sponsorId }) => ({
        url:`/trial-mgmt/sponsor/${sponsorId}/logo/${key}`
      })
    }),
    saveSubjectEnrollInfo: builder.mutation({
      query: ({ trialId, siteId, sponsorId, payload }) => ({
        method:'POST',
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}`,
        body:payload
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubjectList", id: result.id },"SubjectList"
      ],
    }),
    saveVisitAnswers: builder.mutation({
      query: ({ trialId, siteId, sponsorId, payload }) => ({
        method:'POST',
        url: `/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}`,
        body:payload
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubjectList", id: result.id },"SubjectList"
      ],
    }),
    saveWithdrawSubAnswers: builder.mutation({
      query: ({ trialId, siteId, sponsorId, payload }) => ({
        method:'POST',
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/withdrawl`,
        body:payload
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubjectList", id: result.id },"SubjectList","SubjectWithdrawList"
      ],
    }),
    saveComment: builder.mutation({
      query: ({ payload }) => ({
        method:'POST',
        url: `/e-consent/crf/comment`,
        body:payload
      })
    }),
    getSubjectList: builder.query({
      query: ({ sponsorId, trialId, siteId }) => ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/subjects`,
      }),
      providesTags: ["SubjectList"]
    }),
    getWithdrawSubjectList: builder.query({
      query: ({ sponsorId, trialId, siteId }) => ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/withdraw-subjects`,
      }),
      providesTags: ["SubjectWithdrawList"]
    }),
    getSubjectAnswers: builder.query({
      query: ({ sponsorId, trialId, siteId,payload }) => ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/subject-answers`,
        method: "POST",
        body:payload
      }),
    }),
    getComments: builder.query({
      query: ({ sponsorId, trialId, trialSiteId, subjectMasterId, payload }) => ({
        url: `/e-consent/crf/comment/sponsor/${sponsorId}/trial/${trialId}/trial-site/${trialSiteId}/subject/${subjectMasterId}`,
        method: "POST",
        body: payload
      }),
    }),
    getFieldHistory: builder.query({
      query: ({ payload }) => ({
        url: `/e-consent/crf/fieldHistory`,
        method: "POST",
        body: payload
      }),
    }),
    getSubjectFieldHistory: builder.query({
      query: ({ payload }) => ({
        url: `/e-consent/subject/fieldHistory`,
        method: "POST",
        body: payload
      }),
    }),
    uploadSubjectSignature: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/signture-upload`,
        body: payload,
        method: "POST",
      }),
    }),
    getSubjectDetail: builder.query({
      query:(subjectMasterId) => ({
        url: `/e-consent/subject/${subjectMasterId}`
      }),
      providesTags: (result, error, arg) => {
        return result ? [{ type: "SubjectList", id: result.id }, "SubjectList"] : ["SubjectList"];
      },
    }),
    getSubjectDashboardDetail: builder.query({
      query:(subjectMasterId) => ({
        url: `/e-consent/subject/subject/${subjectMasterId}/detail`
      }),
    }),
    addFieldSubjectEnrollment: builder.mutation({
      query: ({ sponsorId, trialId, siteId, payload }) => ({
        url: `/e-consent/subject/${sponsorId}/trial/${trialId}/site/${siteId}/custom-field`,
        body: payload,
        method: "POST",
      }),
      //invalidatesTags:["FormConfig"]
    }),
    generateOTPValue: builder.mutation({
      query: () => ({
        url: `/trial-mgmt/sponsor/generateOTP`,
        body: {},
        method: "POST",
      }),
    }),
    playConsentAudio: builder.mutation({
      queryFn: async ({ payload }, api) => {
        try {
          const token = api.getState().auth.token?.access_token;
          const response = await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT_URL}e-consent/subject/consent/synthesizeSpeech`,
            payload,
            { headers: { Authorization: `Bearer ${token}` }, responseType: 'stream' }
          );
          return {data: response.data };
        } catch (axiosError) {
          let err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
      },
    }),
    resendOTPValue: builder.mutation({
      query: () => ({
        url: `/trial-mgmt/sponsor/resendOTP`,
        body: {},
        method: "POST",
      }),
    }),
    verifyOTPValue: builder.mutation({
      query: ({ payload }) => ({
        url: `/trial-mgmt/sponsor/verifyOTP`,
        body: payload,
        method: "POST",
      }),
    }),
    getEConsentFormConfig: builder.query({
      query:({sponsorId, trialId, siteId,documentKey, payload}) => ({
        url: `/e-consent/subject/${sponsorId}/trial/${trialId}/site/${siteId}/subject-enroll/${documentKey}`,
        body: payload,
        method: "POST",
      }),
      providesTags: ["EnrollSubjectFormConfig"],
    }),
    externalVerifySubject: builder.mutation({
      query:({sponsorId, trialId, siteId, payload })=> ({
        url: `/e-consent/subject/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/verify`,
        body: payload,
        method:"POST"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubjectList", id: result.id },"SubjectList"
      ],
    }),
    externalVerifyCRF: builder.mutation({
      query:({sponsorId, trialId, siteId, payload })=> ({
        url: `/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/verify`,
        body: payload,
        method:"POST"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SubjectList", id: result.id },"SubjectList"
      ],
    }),
    AddDepartmentInMeta: builder.mutation({
      query: (dept) => ({
        url: "/trial-mgmt/department",
        method: "POST",
        body:{title:dept}
      }),
      invalidatesTags:["DepartmentMeta"]
    }),
    getSubjectListByField: builder.mutation({
      query: ({sponsorId,trialId,siteId,payload}) => ({
        url:`/e-consent/crf/sponsor/${sponsorId}/trial/${trialId}/site/${siteId}/subjects`,
        body:payload,
        method:"POST"
      })
    }),
    createSchedule : builder.mutation({
      query: ({trialId,siteId,payload}) => ({
        url:`/trial-mgmt/schedule/trial/${trialId}/site/${siteId}`,
        body:payload,
        method:"POST"
      })
    }),
    getSchedule: builder.mutation({
      query: ({trialId,payload}) => ({
        url:`/trial-mgmt/schedule/trial/${trialId}/events`,
        body:payload,
        method:"POST"
      })
    }),
    addCommentOnScheduleEvent: builder.mutation({
      query: ({scheduleId,payload}) => ({
        url:`/trial-mgmt/schedule/schedule/${scheduleId}/comment`,
        body:payload,
        method:"POST"
      })
    }),
    getOneSchedule: builder.query({
      query: (scheduleId) => ({
        url:`/trial-mgmt/schedule/${scheduleId}`,
        method:"GET"
      })
    }),
    getMeUser: builder.query({
      query: () => ({
      url: `/trial-mgmt/sponsor/users/me`,
        method: "GET"
      })
    }),
    updateSchedule: builder.mutation({
      query: ({scheduleId,trialId,siteId,payload}) => ({
        url : `/trial-mgmt/schedule/trial/${trialId}/site/${siteId}/schedule/${scheduleId}`,
        method: "PUT",
        body : payload
      })
    })
  }),
});

export const {
  useLoginMutation,
  useCreateTrialMutation,
  useUploadDocMutation,
  useCreateTrialPatchMutation,
  useGetTrialsMutation,
  useGetSiteMembersQuery,
  useGetTrialSiteDetailsQuery,
  useGetDownloadTrialDocQuery,
  useGetTrialSiteMembersQuery,
  useUploadSignatureMutation,
  useAssignRoleMutation,
  useAddSiteMemberMutation,
  useDeleteTrialDocumentsMutation,
  useDeleteUserRoleMutation,
  useGetTrialDetailsQuery,
  useUploadSubjectFileMutation,
  useDownloadSubjectFileQuery,
  useGetSubjectDashboardDetailQuery,
  usePlayConsentAudioMutation,
  useDownloadSubjectSignatureQuery,
  useGetTrialDocTypesQuery,
  useDownloadVisitSignatureQuery,
  useGetTrialDocumentsQuery,
  useGetSiteBasicDetailsQuery,
  useDownloadCRFFileQuery,
  useCreateTrialSitePatchMutation,
  useUpdateTrialBankDetailMutation,
  useUpdateTrialStudyDetailMutation,
  useUpdateTrialPatchMutation,
  useUpdateTrialBudgetDetailMutation,
  useGetDynamicDataValuesQuery,
  useGetSiteDocumentMetaQuery,
  useGetSiteDocumentsQuery,
  useMarkTrialSetupDoneMutation,
  useGetOngoingTrialsQuery,
  useGetDepartmentMetaQuery,
  useCreateSiteMutation,
  useGetVisitAnswersQuery,
  useGetTrialSiteInfoQuery,
  useGetLibraryFormQuery,
  useUploadCRFFileMutation,
  useGetCommentsQuery,
  useGetFieldHistoryQuery,
  useGetSubjectFieldHistoryQuery,
  useGenerateOTPValueMutation,
  useVerifyOTPValueMutation,
  useSaveCommentMutation,
  useUploadVisitSignatureMutation,
  useSubmitSiteInitAnswersMutation,
  useGetTrialSiteAnswersQuery,
  useUpdateSiteInitAnswersMutation,
  useVerifySiteInitAnswersMutation,
  useSaveVisitAnswersMutation,
  useGetSponsorDetailsQuery,
  useGetSponsorLogoQuery,
  useSaveSubjectEnrollInfoMutation,
  useGetSubjectListQuery,
  useGetSubjectAnswersQuery,
  useUploadSubjectSignatureMutation,
  useDownloadSubjectProfilePicQuery,
  useUploadSubjectProfilePicMutation,
  useGetSubjectDetailQuery,
  useAddFieldSubjectEnrollmentMutation,
  useGetEConsentFormConfigQuery,
  useUploadInitiationFileMutation,
  useDownloadInitiationFileQuery,
  useExternalVerifySubjectMutation,
  useExternalVerifyCRFMutation,
  useResendOTPValueMutation,
  useAddDepartmentInMetaMutation,
  useSaveWithdrawSubAnswersMutation,
  useGetWithdrawSubjectListQuery,
  useGetSubjectListByFieldMutation,
  useCreateScheduleMutation,
  useGetScheduleMutation,
  useAddCommentOnScheduleEventMutation,
  useGetOneScheduleQuery,
  useGetMeUserQuery,
  useUpdateScheduleMutation
} = bloqcibeApi;
