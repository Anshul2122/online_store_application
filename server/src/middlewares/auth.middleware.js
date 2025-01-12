import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "../utils/TryCatch.js";
import jwt from "jsonwebtoken"


const isAuthenticated = TryCatch(async (req, res, next) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return next(new ErrorHandler("Unauthorized request", 401));
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken");

    if (!user) {
        return next(new ErrorHandler("invalid access token", 401));
    }

    req.user = user;
    next();
})

const authorizeRoles = (...roles) => {
  
  
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};

export {authorizeRoles, isAuthenticated}