import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { uploadOnCloudinary } from "../utils/features.js";
import { TryCatch } from "./../utils/TryCatch.js";

import { redisClient } from "../server.js";

const CACHE_KEYS ={
  ALLUSER:"allUser",
  USER:"user",
  COUPON:"createCoupon",
  ALLCOUPON:"allCoupon",
}

const getAllUsers = TryCatch(async (req, res, next) => {
  let cachedAllUsers;
  const allUsersKey = `${CACHE_KEYS.ALLUSER}`;
  const exists = await redisClient.exists(allUsersKey);
  if (exists) {
    cachedAllUsers = await redisClient.get(allUsersKey);
    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      totalUser: JSON.parse(cachedAllUsers).length,
      users: JSON.parse(cachedAllUsers),
    });
  }

  const admin = req.user.role === "admin" || false;
  if (!admin) {
    return next(
      new ErrorHandler(
        "Unauthorized Access, only admin have access for this",
        401
      )
    );
  }
  const users = await User.find({});
  if (!users) {
    return next(new ErrorHandler("No users found", 404));
  }
  await redisClient.set(`${CACHE_KEYS.ALLUSER}`, JSON.stringify(users));
  if (users.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No users found",
      totalUser: 0,
      users,
    });
  }
  res.status(200).json({
    success: true,
    message: "All users fetched successfully!!",
    totalUser: users.length,
    users,
  });
});

const getUserByIdByAdmin = TryCatch(async (req, res, next) => {
  let cachedUser;
  const userId = req.params.id;
  const userKey = `${CACHE_KEYS.USER}${userId}`;
  const exists = await redisClient.exists(userKey);
  if (exists) {
    cachedUser = await redisClient.get(userKey);
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: JSON.parse(cachedUser),
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler(`user with id ${userId} not found !!`, 404));
  }
  await redisClient.set(`${CACHE_KEYS.USER}${userId}`, JSON.stringify(user));
  res.status(200).json({
    success: true,
    message: `user with id ${userId} fetched successfully !!`,
    user,
  });
});


const createCoupon = TryCatch(async (req, res, next) => {
    let { code, discount, startDate, endDate } = req.body;
  if (!code ) {
    return next(new ErrorHandler(" code fields are empty", 400));
    }
    else if (!discount) {
        return next(new ErrorHandler("discount fields are empty", 400));
  } else if (!endDate) {
      return next(new ErrorHandler("end date fields are empty", 400));
    }
  const codeExists = await Coupon.findOne({ code });
  if (codeExists) {
    return next(new ErrorHandler("coupon with this code already exists", 400));
  }
  let date;
  if (startDate) {
    date = new Date(startDate);
  }
  let end = new Date(endDate);

  if (end < date) {
    return next(new ErrorHandler("start date can't be after end date", 400));
  }

  const coupon = await Coupon.create({
    code,
    discount,
    startDate: date,
    endDate: end,
  });
  const createdCoupon = await Coupon.findById(coupon._id);;
  await redisClient.set(`${CACHE_KEYS.CREATECOUPON}${createdCoupon._id}`);
  return res.status(200).json({
    success: true,
    message: "Coupon created successfully!!",
    coupon,
  });
});

const getAllCoupons = TryCatch(async (req, res, next) => {

  let cachedAllCoupons;
  const allCouponKey = `${CACHE_KEYS.ALLCOUPON}`;
  const exists = await redisClient.exists(allCouponKey);
  if (exists) {
    cachedAllCoupons = await redisClient.get(allCouponKey);
    return res.status(200).json({
      success: true,
      message: "All coupons fetched successfully",
      totalCoupon: JSON.parse(cachedAllCoupons).length,
      coupons: JSON.parse(cachedAllCoupons),
    });
  }
  const coupons = await Coupon.find({});
   await redisClient.set(`${CACHE_KEYS.ALLCOUPON}`, JSON.stringify(coupons)); 
  return res.status(200).json({
    success: true,
    message: "All coupons fetched successfully!",
    totalCoupon: coupons.length,
    coupons,
  });
});

const getCouponById = TryCatch(async (req, res, next) => {
  let cachedCoupon;
  const couponId = req.params.id;
  const couponKey = `${CACHE_KEYS.CREATECOUPON}${couponId}`;
  const exists = await redisClient.exists(couponKey);
  if (exists) {
    cachedCoupon = await redisClient.get(couponKey);
    return res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      coupon: JSON.parse(cachedCoupon),
    });
  }
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorHandler(`coupon with id ${couponId} not found!!`, 404));
  }
  await redisClient.set(`${CACHE_KEYS.CREATECOUPON}${couponId}`, JSON.stringify(coupon));
  res.status(200).json({
    success: true,
    message: `Coupon with id ${couponId} fetched successfully!!`,
    coupon,
  });
})

export {
  getAllUsers,
  getUserByIdByAdmin,
  createCoupon,
  getAllCoupons,
  getCouponById
};
