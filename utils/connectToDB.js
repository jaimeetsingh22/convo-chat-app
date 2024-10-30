import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    if (mongoose.connections && mongoose.connections[0].readyState) return; // if the connection is alread established then it will not restablished the connection again and again

    const { connection } = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "convo",
    });
    console.log(`connected to MongoDB database: ${connection.host} `)
  } catch (error) {
    throw new Error(`Error to connect DB: ${error}`);
  }
};
