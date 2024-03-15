import { createSlice } from "@reduxjs/toolkit";
import { bloqcibeApi } from "./apiSlice";
import { AUDIO_LANGUAGES } from "../../util/constants";

const slice = createSlice({
  name: "subject",
  initialState: {
    steps: null,
    details: null,
    dashboardDetails: null,
    consentLanguage: AUDIO_LANGUAGES[0].locale,
    answers: null
  },
  reducers: {
    setSteps: (state, action) => {
      state.steps = action.payload;
    },
    setConsentLanguage: (state, action) => {
      state.consentLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      bloqcibeApi.endpoints.getSubjectDetail.matchFulfilled, (state, { payload }) => {
        state.details = payload
      }
    );
    builder.addMatcher(
      bloqcibeApi.endpoints.getSubjectDashboardDetail.matchFulfilled, (state, { payload }) => {
        state.dashboardDetails = payload
      }
    );
    builder.addMatcher(
      bloqcibeApi.endpoints.getSubjectAnswers.matchFulfilled,
      (state, { payload }) => {
        state.answers = payload
      }
    )
  }
});

export default slice.reducer;
export const { setSteps, setConsentLanguage } = slice.actions;
export const subjectDashboardDetails = (state) => state.subject.dashboardDetails;
