import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false,
  loader: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
      state.loader = false;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logoutAdmin: (state) => {
      state.isAdmin = false;
      state.loader = false;
    },
  },
});

export const { setAdmin, setLoader, setError, logoutAdmin } = authSlice.actions;
export default authSlice;











// import { createSlice } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";
// import { adminLogin, getAdmin } from "../thunks/adminAuth";

// const initialState = {
//   isAdmin: false,
//   loader: true,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAdmin: (state) => {
//       state.isAdmin = false;
//       state.loader = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(adminLogin.fulfilled, (state, action) => {
//         state.isAdmin = true;
//         toast.success(action.payload);
//       })
//       .addCase(adminLogin.rejected, (state, action) => {
//         state.isAdmin = false;
//         toast.error(action.error.message);
//       })
//       .addCase(getAdmin.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.isAdmin = true;
//         } else {
//           state.isAdmin = false;
//         }
//       })
//       .addCase(getAdmin.rejected, (state, action) => {
//         state.isAdmin = false;
//       });
//   },
// });

// export default authSlice;
// export const { setAdmin } = authSlice.actions;

