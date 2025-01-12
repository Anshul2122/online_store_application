import fs from "fs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "..././.env" });

const connectDB = async () => {
  console.log("Connecting to database...");
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    if (connectionInstance) {
      console.log("connected to database successfully");
    } else {
      console.log("Failed to connect to database");
      process.exit(1);
    }
  } catch (error) {
    console.log("error: ", error);
    process.exit(1);
  }
};




const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has been uploaded successfully
    console.log("file is uploaded on cloudinary!");
    return response;
  } catch (e) {
    console.error(e);
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as upload operation failed
    return null;
  }
};

const deleteFromCloudinary = async (cloudinaryFilePath) => {
  try {
    if (!cloudinaryFilePath) return null;
    const fileName = cloudinaryFilePath.split("/").pop().split(".")[0];
    const response = await cloudinary.uploader.destroy(fileName);
    console.log(response);
    return response;
  } catch (e) {
    console.log("deleteFromCloudinary error: ", e);
    return null;
  }
};

export {connectDB, uploadOnCloudinary, deleteFromCloudinary}
