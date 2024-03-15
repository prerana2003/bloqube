import { createSlice } from "@reduxjs/toolkit";
import { bloqcibeApi } from "./apiSlice";

const userSlice = createSlice({
    name: "userDetails",
    initialState: {user: {},loggedInUser:{}, locationLat: null, locationLng: null},
    reducers: {
        setUserLocation: (state, action) => {
            state.locationLat = action.payload.locationLatitude;
            state.locationLng = action.payload.locationLongitude;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
          bloqcibeApi.endpoints.getSponsorDetails.matchFulfilled,
          (state, { payload }) => {
            state.user = payload;
          }
        ).addMatcher(
            bloqcibeApi.endpoints.getMeUser.matchFulfilled,
            (state, { payload }) => {
              state.loggedInUser = payload;
            }
          );
    }
})

export default userSlice.reducer
export const { setUserLocation } = userSlice.actions;