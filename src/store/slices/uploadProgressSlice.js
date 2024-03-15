import { createSlice } from "@reduxjs/toolkit";
import { bloqcibeApi } from "./apiSlice";

const slice = createSlice({
    name: "uploadProgress",
    initialState: { progress : -1 },
    reducers: {
      setProgress: (state, action) => {
        let progressVal = action.payload;
        if(progressVal == 100) {
          progressVal = -1;
        }
        state.progress = progressVal;
      },
    },
    
  });
  
  export default slice.reducer;
  
  export const { setProgress } = slice.actions;

  