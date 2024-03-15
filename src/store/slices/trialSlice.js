import { createSlice } from "@reduxjs/toolkit";
import { bloqcibeApi } from "./apiSlice";

const slice = createSlice({
  name: "trial",
  initialState: { currentTrial: null, trialUsers: null, currentTrialSites: null,trialSiteDetail:null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        bloqcibeApi.endpoints.createTrial.matchFulfilled,
        (state, { payload }) => {
          state.currentTrial = payload;
        }
      )
      .addMatcher(
        bloqcibeApi.endpoints.getTrialDetails.matchFulfilled,
        (state, { payload }) => {
          state.currentTrial = payload?.trialData;
          state.trialUsers = payload?.trialUsers;
        }
      )
      .addMatcher(
        bloqcibeApi.endpoints.getTrialSiteDetails.matchFulfilled,
        (state, { payload }) => {
          state.currentTrialSites = payload;
        }
      )
      .addMatcher(
        bloqcibeApi.endpoints.getTrialSiteInfo.matchFulfilled,
        (state, {payload}) => {
          state.trialSiteDetail = payload;
        }
      );
  },
});

export default slice.reducer;

export const selectTrial = (state) => state.trial.currentTrial;
