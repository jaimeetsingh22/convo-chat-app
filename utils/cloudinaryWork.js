import { v4 as uuid } from "uuid";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

console.log("Uploading files....");


export async function uploadFilesToCloudinary(files = []) {
  const uploadPromise = files.map((file) => {
    return new Promise((resolve, reject) => {
      const readableStream = new Readable({
        read() {
          this.push(file);
          this.push(null);
        },
      });

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);  // Log and reject the error properly
          }
          resolve(result);
        }
      );

      readableStream.pipe(uploadStream);  // Ensure stream is piped correctly
    });
  });

  try {
    const results = await Promise.all(uploadPromise);
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (error) {
    console.error("Error Uploading files on Cloudinary", error);
    throw new Error("Error Uploading files on Cloudinary");
  }
}
