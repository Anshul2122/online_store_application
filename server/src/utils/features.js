import fs from "fs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { redisClient } from "../server.js";
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


const CACHEKEYS ={
  ALLUSER:"allUser",
  USER:"user",
  COUPON:"createCoupon",
  ALLCOUPON:"allCoupon",

  ORDER:"order",
  MYORDER:"myorder",
  ORDERBYID:"orderID",
  ALLORDERS:"allorders",
  ORDERBYSTATUS:"orderStatus",
  SELLERORDERS:"sellerOrder",

  PRODUCT:"product",
  ALLPRODUCTS:"allProducts",
  SINGLEPRODUCT:"singleProduct",
  MYPRODUCTS:"myProducts",
  LATESTPRODUCT:"latestProduct",
  GETCATEGORYPRODUCT:"getCategoryProduct",
  ALLCATEGORY:"allCategory",
  SINGLECATEGORY:"singleCategory",

  USER:"user",
  CART:"usercart",
  WISHLIST:"userwishlist"
}


export const invalidateCache = async({productAdded, orderAdded, userAdded, userUpdated, productUpdated, orderUpdated,})=>{
  if(userAdded || userUpdated){
    const key = `${CACHEKEYS.ALLUSER}`;
    const exists = await redisClient.exists(key);
    if(exists) await redisClient.del(key);
  }
  if(productAdded || productUpdated){
    const key0 = `${CACHEKEYS.ALLPRODUCTS}`;
    const exists0 = await redisClient.exists(key0);
    if(exists0) await redisClient.del(key0);

    const key1 = `${CACHEKEYS.MYPRODUCTS}`;
    const exists1 = await redisClient.exists(key1);
    if(exists1) await redisClient.del(key1);

    const key2 = `${CACHEKEYS.LATESTPRODUCT}`;
    const exists2 = await redisClient.exists(key2);
    if(exists2) await redisClient.del(key2);

    const key3 = `${CACHEKEYS.GETCATEGORYPRODUCT}`;
    const exists3 = await redisClient.exists(key3);
    if(exists3) await redisClient.del(key3);

    const key4 = `${CACHEKEYS.SINGLEPRODUCT}`;
    const exists4 = await redisClient.exists(key4);
    if(exists4) await redisClient.del(key4);

    const key5 = `${CACHEKEYS.ALLCATEGORY}`;
    const exists5 = await redisClient.exists(key5);
    if(exists5) await redisClient.del(key5);
  }

  if(orderAdded || orderUpdated){

  }
}



export {connectDB, uploadOnCloudinary, deleteFromCloudinary}



