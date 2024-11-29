import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const adminLogin = createAsyncThunk("admin/login", async (secreteKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "api/admin/verify",
      {
        secreteKey,
      },
      config
    );
    return data.message;
  } catch (error) {
    console.log(error.response.data.message);
    throw error.response.data.message;
  }
});
const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const { data } = await axios.get("api/admin", { withCredentials: true });

    return data.admin;
  } catch (error) {
    console.log(error.response.data.message);
    throw error.response.data.message;
  }
});


export { adminLogin, getAdmin,  };
