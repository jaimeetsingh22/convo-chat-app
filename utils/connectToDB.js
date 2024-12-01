import mongoose from "mongoose";

export const connectToDB = async () => {
  if (typeof window !== "undefined") {
    throw new Error("Database connection should only occur on the server.");
  }

  try {
    if (mongoose.connection.readyState) return; // Already connected

    const { connection } = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "convo",
    });
    console.log(`Connected to MongoDB: ${connection.host}`);
  } catch (error) {
    throw new Error(`Error connecting to DB: ${error.message}`);
  }
};
