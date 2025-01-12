import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { uploadOnCloudinary } from "../utils/features.js";
import { TryCatch } from "./../utils/TryCatch.js";

const getAllUsers = TryCatch(async (req, res, next) => {
    const admin = req.user.role === 'admin' || false;
    if (!admin) {
        return next(new ErrorHandler("Unauthorized Access, only admin have access for this", 401));
    }
    const users = await User.find({});
    if (!users) {
        return next(new ErrorHandler("No users found", 404));
    }
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
        totalUser:users.length,
        users,
    });
})

const getUserByIdByAdmin = TryCatch(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(
          new ErrorHandler(
            `user with id ${userId} not found !!`,
            404
          )
        );
    }
    res.status(200).json({
        success: true,
        message:   `user with id ${userId} fetched successfully !!`,
        user,
    });
})

const updateUserByAdmin = TryCatch(async (req, res, next) => { 
    const userId = req.params.id;
    const updateFields = { ...req.body };
    delete updateFields._id;
    delete updateFields.password;
    if (updateFields.avatar && updateFields.avatar!=="") {
        const avatarPath = await uploadOnCloudinary(updateFields.avatar);
        updateFields.avatar = avatarPath.url;
    }
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!user) {
        return next(new ErrorHandler(`user with id ${userId} not found !!`, 404));
    }
    res.status(200).json({
        success: true,
        message:   `user with id ${userId} updated successfully!!`,
        user,
    });
})


const deleteUserByIdByAdmin = TryCatch(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return next(new ErrorHandler(`user with id ${userId} not found!!`, 404));
    }
    res.status(200).json({
        success: true,
        message:   `user with id ${userId} deleted successfully!!`,
    });
});


const createCoupon = TryCatch(async (req, res, next) => {
    const { code, discount, startDate, endDate } = req.body;

    if (!code || !discount || !endDate) {
        return next(new ErrorHandler("fields are empty", 400));
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
    
    const coupon = await Coupon.create({ code, discount, startDate: date, endDate: end });
    

    return res.status(200).json({
        success: true,
        message: "Coupon created successfully!!",
        coupon,
    })
})

export {
  getAllUsers,
  getUserByIdByAdmin,
  updateUserByAdmin,
    deleteUserByIdByAdmin,
  createCoupon
};