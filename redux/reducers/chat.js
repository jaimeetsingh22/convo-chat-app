import { NEW_MESSAGE_ALERT } from "@/constants/events";
import { getOrSaveFromStorage } from "@/utils/feature";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
  newMessageAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};
// miscelleneous slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    increamentNotificaton: (state) => {
      state.notificationCount += 1;
    },
    resetNotification: (state) => {
      state.notificationCount = 0;
    },
    setNewMessageAlert: (state, action) => {
      const chatId = action.payload.chatId;
      const index = state.newMessageAlert.findIndex(
        (item) => item.chatId === chatId
      );
      if (index !== -1) {
        state.newMessageAlert[index].count += 1;
      } else {
        state.newMessageAlert.push({
          chatId,
          count: 1,
        });
      }
    },
    removeNewMessageAlert: (state, action) => {
      state.newMessageAlert = state.newMessageAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;
export const {
  increamentNotificaton,
  resetNotification,
  setNotificationCount,
  setNewMessageAlert,
  removeNewMessageAlert,
} = chatSlice.actions;
