
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "./utils/features.js";
import {app} from "./app.js"


// export const envMode = process.env.NODE_ENV || "PRODUCTION";
// export const adminKey = process.env.ADMIN_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { createClient } from 'redis';

export const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


