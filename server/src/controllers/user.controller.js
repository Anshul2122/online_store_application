import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { uploadOnCloudinary } from "../utils/features.js";
import { TryCatch } from "./../utils/TryCatch.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new error();
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("in geneate access and refresh token, error: ", error);
    return;
  }
};

const registerUser = TryCatch(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (
    [firstName, lastName, email, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new ErrorHandler("All fields are required!!", 400));
  }

  const existsingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existsingUser) {
    return next(
      new ErrorHandler("Email or Phone Number already exists!!", 409)
    );
  }

  let avatar = "";

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);
    if (!image) {
      return next(
        new ErrorHandler("Error in image uploading to cloudinary", 500)
      );
      }
      avatar = image.url;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    avatar,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refrehToken"
  );

  if (!createdUser) {
    return next(new ErrorHandler("User registration failed!!"));
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    user: createdUser,
  });
});

const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler());
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid email", 401));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json({
      success: true,
      message: "user logged in successfully!!",
      user: loggedInUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
});

const logoutUser = TryCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res
    .status(200)
    .json({ success: true, message: "User logged out successfully!" });
});

const refreshAccessToken = TryCatch(async (req, res, next) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return next(new ErrorHandler("Unauthorized request", 401));
  }
  const decodeToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodeToken?._id);
  if (!user) {
    return next(new ErrorHandler("Invalid refresh token", 401));
  }
  if (incomingRefreshToken !== user?.refreshToken) {
    return next(new ErrorHandler("Invalid refresh token or expired", 401));
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );
  return response
    .status(200)
    .cookie("accesstoken", accessToken)
    .cookie("refreshtoken", newRefreshToken)
    .json({
      success: true,
      message: "Access token refreshed",
      accessToken,
      newRefreshToken,
    });
});

const getCurrentUser = TryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("Unauthorized request, login first", 401));
  }
  return res
    .status(200)
    .json({ success: true, message: "user fetched sucessfully!!", user });
});

const updateUser = TryCatch(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Unauthorized request, login first", 401));
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    return next(
      new ErrorHandler("User do not exists, create account first", 404)
    );
  }
  const { firstName, lastName, email, phoneNumber, gender, address } = req.body;
  
  let avatar = "";
  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);
    if (!image) {
      return next(
        new ErrorHandler("Error in image uploading to cloudinary", 500)
        );
      }
      avatar = image.url;
  }

  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (email) {
    user.email = email;
  }
  if (phoneNumber) {
    user.phoneNumber = phoneNumber;
  }
  if (gender) {
    user.gender = gender;
  }
  if (avatar) {
    user.avatar = avatar;
  }
  if (address) {
    user.address = address;
  }
  await user.save();
  
  return res
    .status(200)
    .json({ success: true, message: "User updated successfully!!", user });
});

const deleteUser = TryCatch(async (req, res, next) => {
    if (!req.user) {
    return next(new ErrorHandler("Unauthorized request, login first", 401));
    }
    const id = req.user._id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    return res.status(200).clearCookie('accessToken').clearCookie('refreshToken').json({ success: true, message: "user account deleted" });

})

const addToWishlist = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  if (user.wishlist.includes(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Product already in wishlist" });
  }
  user.wishlist.push(productId);
  await user.save();
  const wishlist = user.wishlist;
  return res
    .status(200)
    .json({ success: true, message: "product added to wishlist", wishlist});
});

const addToCart = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  if (user.cart.includes(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Product already in Cart" });
  }
  user.cart.push(productId);
  await user.save();
  const cartItems = user.cart;
  return res
    .status(200)
    .json({ success: true, message: "product added to Cart", cartItems });
});

const removeFromWishlist = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!user.wishlist.includes(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Product not in wishlist" });
  }
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();
  const wishlistItems = user.wishlist;
  return res
    .status(200)
    .json({ success: true, message: "product removed from wishlist", wishlistItems });
});

const removeFromCart = TryCatch(async (req, res, next) => {
  const productId  = req.params.id;
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!user.cart.includes(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Product not in cart" });
  }
  user.cart = user.cart.filter((id) => id.toString() !== productId);
  await user.save();
  const cartItems = user.cart;
  return res
    .status(200)
    .json({ success: true, message: "product removed from cart", cartItems });
});

const getWishListProduct = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  let wishlistProducts= [];
  user.wishlist.forEach(product => {
    wishlistProducts.push(product);
  });
  return res
    .status(200)
    .json({
      success: true,
      message: "products in wishlist fetched successfully",
      wishlistProducts,
    });
});

const getCartProduct = TryCatch(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  let cartProducts = [];

  user.cart.forEach(product => {
    cartProducts.push(product);
  });
  
  return res
    .status(200)
    .json({
      success: true,
      message: "products in cart fetched successfully",
      cartProducts,
    });
});


export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
  getCartProduct,
  getWishListProduct,
};
