
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "./../utils/TryCatch.js";
import jwt from "jsonwebtoken";

import { redisClient } from './../server.js';
import { invalidateCache } from "../utils/features.js";

const CACHE_KEYS ={
  USER:"user",
  CART:"usercart",
  WISHLIST:"userwishlist"
}

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

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  });
  


  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return next(new ErrorHandler("User registration failed!!"));
  }

  await redisClient.set(`${CACHE_KEYS.USER}${createdUser._id}`, JSON.stringify(createdUser))
  invalidateCache(userAdded);

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

  await redisClient.set(`${CACHE_KEYS.USER}${loggedInUser._id}`, JSON.stringify(loggedInUser));

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

  let cachedUser;
  if(redisClient.exists(`${CACHE_KEYS.USER}${req.user._id}`)){
    cachedUser = await redisClient.get(`${CACHE_KEYS.USER}${req.user._id}`);
  }
  if (cachedUser) {
    return res.status(200).json({
      success: true,
      message: "user fetched successfully!!",
      user: JSON.parse(cachedUser)
    });
  }
  const user = req.user;
  if (!user) {
    return next(new ErrorHandler("Unauthorized request, login first", 401));
  }
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  return res
    .status(200)
    .json({ success: true, message: "user fetched sucessfully!!", user });
});

const updateUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return next(
      new ErrorHandler("User do not exists, create account first", 404)
    );
  }
  const { firstName, lastName, email, phoneNumber, gender, address } = req.body;

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
  if (address) {
    user.address = address;
  }

  await user.save();
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  
  return res
    .status(200)
    .json({ success: true, message: "User updated successfully!!", user });
});

const addToWishlist = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  user.cart.forEach((item) => {
    if (item._id.toString() === productId.toString()) {
      user.cart.remove(item);
    }
  });

  if (user.wishlist.includes(productId)) {
    return res.status(200).json({
    success: true,
    message: "product already exists in wishlist",
    user,
  })
}
  
  user.wishlist.push(productId);
  await user.save();
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  return res
    .status(200)
    .json({ success: true, message: "product added to wishlist", user});
});

const addToCart = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  const productExists = user.cart.find(
    (item) => item._id.toString() === productId.toString()
    );
    let exists = true;

    if (productExists) {
    exists = true;
    productExists.quantity += 1;
  } else {
    // If the product doesn't exist, add it to the cart
      user.cart.push({ _id: productId, quantity: 1 });
      exists = false;
  }

  await user.save();
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  return res
    .status(200)
    .json({ success: true, message: "product added to Cart", user, exists });
});

const removeFromWishlist = TryCatch(async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const initialLength = user.wishlist.length;

  user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);

  if (user.wishlist.length === initialLength) {
    return res
     .status(400)
     .json({ success: false, message: "Product not in wishlist", user });
  }
  
  await user.save();
  await redisClient.set( `${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  return res
    .status(200)
    .json({ success: true, message: "product removed from wishlist", user });
});

const removeFromCart = TryCatch(async (req, res, next) => {
  const productId  = req.params.id;
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  let removed = false 
  user.cart.forEach((item) => {
    if (item.id.toString() === productId.toString()) {
      item.quantity -= 1

      if (item.quantity == 0) {
        user.cart.remove(item);
        removed = true;
      }
    }
  });  

  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);

  await user.save();
  return res
    .status(200)
    .json({ success: true, message:"product removed from cart", user, removed });
});

const getWishListProduct = TryCatch(async (req, res, next) => {
  let cachedWishlist;
  const wishlistKey = `${CACHE_KEYS.WISHLIST}${req.user._id}`;
  const exists = await redisClient.exists(wishlistKey);

  if (exists) {
    cachedWishlist = await redisClient.get(wishlistKey);

    return res.status(200).json({
      success: true,
      message: "Products in wishlist fetched successfully",
      wishlistProducts: JSON.parse(cachedWishlist), // Make sure it was stored as JSON
      total: JSON.parse(cachedWishlist).length,
    });
  }

  // If no cache, fetch from database
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password").populate("wishlist");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Cache the wishlist for future requests
  await redisClient.set(wishlistKey, JSON.stringify(user.wishlist));

  // Return the wishlist data
  return res.status(200).json({
    success: true,
    message: "Products in wishlist fetched successfully",
    wishlistProducts: user.wishlist,
    total: user.wishlist.length,
  });
});


const getCartProduct = TryCatch(async (req, res, next) => {
  let cacheCartProduct;
  const CartKey = `${CACHE_KEYS.CART}${req.user._id}`;
  const exists = await redisClient.exists(CartKey);
  if (exists) {
    cacheCartProduct = await redisClient.get(CartKey);

    return res.status(200).json({
      success: true,
      message: "Products in Cart fetched successfully",
      wishlistProducts: JSON.parse(cacheCartProduct),
      total: JSON.parse(cacheCartProduct).length,
    });
  }
  const userId = req.user._id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const cartProducts = await Promise.all(
    user.cart.map(async (item) => {
      const product = await Product.findById(item._id).select(
        "name description images category brand sellingPrice originalPrice stock"
      );
      return {
        quantity: item.quantity,
        product,
      };
    })
  );
  await redisClient.set(CartKey, JSON.stringify(cartProducts));
  
  return res.status(200).json({
    success: true,
    message: "products fetched successfully",
    cartProducts,
    total: cartProducts.length, // Total number of cart items
  });
});

const removeProductFromCart = TryCatch(async (req, res, next) => {
  console.log("req user", req.user)
  console.log(req.params)
  const productId = req.params.id;
  console.log("productId : ",productId);
  
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  user.cart.forEach((item) => {
    if (item.id.toString() === productId.toString()) {
        user.cart.remove(item);
    }
  });
  await user.save();
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  return res
    .status(200)
    .json({
      success: true,
      message: "product removed from cart",
      user,
    });
})

const moveTowishlistFromCart = TryCatch(async (req, res, next) => {

  const productId = req.params.id;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  const product = await Product.findById(productId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  user.cart.pull(productId);
  user.wishlist.push(productId);
  await user.save();
  await redisClient.set(`${CACHE_KEYS.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);
  return res.json({message:"moved to wishlist", success:true, user});
})

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  updateUser,
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
  getCartProduct,
  getWishListProduct,
  removeProductFromCart,
  moveTowishlistFromCart
};
