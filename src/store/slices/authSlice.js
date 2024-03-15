import { createSlice } from "@reduxjs/toolkit";
import { bloqcibeApi } from "./apiSlice";
import jwt_decode from "jwt-decode";

let savedToken = localStorage.getItem("token");
if (savedToken) {
  savedToken = JSON.parse(savedToken);
}

const slice = createSlice({
  name: "auth",
  initialState: {
    user: savedToken ? jwt_decode(savedToken.access_token) : null,
    token: savedToken ? savedToken : null,
    subjectLoggedIn: false,
    sponsorId: savedToken
      ? jwt_decode(savedToken.access_token).details[0][0]["sponsorId"]
      : null,
  },
  reducers: {
    setSubjectLoggedIn: (state, action) => {
      state.subjectLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      bloqcibeApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const jwtToken = jwt_decode(payload.access_token);
        // console.log(payload.access_token);
        state.token = payload;
        state.user = jwt_decode(payload.access_token);
        state.subjectLoggedIn = jwtToken.details[0][0]['role'] == 'subject';
        state.sponsorId = jwtToken.details[0][0]["sponsorId"];
        localStorage.setItem("token", JSON.stringify(payload));
      }
    );
  },
});

export default slice.reducer;
export const { setSubjectLoggedIn } = slice.actions;
export const selectCurrentUser = (state) => state.auth.user;
