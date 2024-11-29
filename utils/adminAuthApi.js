import axios from "axios";

// export const verifyAdmin = async (secreteKey) => {
//   const config = { withCredentials: true, headers: { "Content-Type": "application/json" } };
//   try {
//     const response = await axios.post("/api/admin/verify", { secreteKey }, config);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error("Error verifying admin:", error.response.data.message);
//     // return error.response.data.message;
//     // throw error; // Rethrow the error if you want to handle it further up the call stack
//   }
// };

export const fetchAdmin = async () => {
  try {
    const response = await axios.get("/api/admin", { withCredentials: true });
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    // console.error("Error fetching admin:", error);
    return error?.response.data.message;
    // throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await axios.get("/api/admin/logout", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error logging out admin:", error);
    return error.response.data.message;
    // throw error;
  }
};