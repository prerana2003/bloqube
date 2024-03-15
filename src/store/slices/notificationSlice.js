import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash'
const slice = createSlice({
  name: "notifications",
  initialState: { messages: [], count: 0 },
  reducers: {
    onSocketConnect: (state, action) => {
      const orderedMessages = _.orderBy(action.payload.rows, "createdAt","desc");
      state.messages = orderedMessages;
      state.count = action.payload.count;
    },
   onNewNotification: (state, action) => {
      const newMessage = action.payload;
      state.messages = _.orderBy([...state.messages, newMessage], "createdAt", "desc");
      state.count += 1;
    },
    onMessageReadConfirmation:(state, action) => {
      const messages = state.messages;
      const updatedMessages = messages.map((message) => {
        if (message.id === action.payload.id) {
          return action.payload; 
        } else {
          return message; 
        }
      });
      state.messages = updatedMessages;
    }
  },
});

export default slice.reducer;

export const { onSocketConnect, onNewNotification, onMessageReadConfirmation } =
  slice.actions;
