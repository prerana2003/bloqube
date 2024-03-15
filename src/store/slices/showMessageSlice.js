import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'showMessage',
    initialState: {
        showMessage: false,
        message: "",
        messageSeverity:'success'
    },
    reducers: {
        openMessage: (state, action) => {
            state.showMessage = true;
            state.message = action.payload.message;
            state.messageSeverity = action.payload.messageSeverity;
        },
        closeMessage: (state, action) => {
            state.showMessage = false;
            state.message = "";
            state.messageSeverity = "";
        }
    }
})

export default slice.reducer;
export const { openMessage,closeMessage } = slice.actions;
