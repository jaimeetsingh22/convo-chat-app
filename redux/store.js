import { configureStore } from "@reduxjs/toolkit";
import api from "./RTK-query/api/api";
import miscSlice from "./reducers/miscSlice";
import chatSlice from "./reducers/chat";
import authSlice from "./reducers/auth";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
