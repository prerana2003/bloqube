import { configureStore } from "@reduxjs/toolkit";
import application from "./reducers/application";
import { bloqcibeApi } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice"
import trialReducer from "./slices/trialSlice";
import uploadProgressReducer from "./slices/uploadProgressSlice"
import logger from 'redux-logger'
import userDetailsSlice from "./slices/userDetailsSlice";
import subjectSlice from "./slices/subjectSlice";
import showMessageSlice from "./slices/showMessageSlice";
import notificationSlice from "./slices/notificationSlice";

const store = configureStore({
  reducer: { 
    [bloqcibeApi.reducerPath]: bloqcibeApi.reducer,
    auth:authSliceReducer,
    trial:trialReducer,
    uploadProgress:uploadProgressReducer,
    application: application ,
    userDetails: userDetailsSlice,
    subject: subjectSlice,
    showMessage: showMessageSlice,
    notifications: notificationSlice
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat([logger,bloqcibeApi.middleware]),
    getDefaultMiddleware().concat([bloqcibeApi.middleware]),
});

const { dispatch } = store;

export { store, dispatch };
