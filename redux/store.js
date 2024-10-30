import { configureStore } from "@reduxjs/toolkit";
import api from "./RTK-query/api/api";
import miscSlice from "./reducers/miscSlice";

const store = configureStore({
  reducer: {
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
