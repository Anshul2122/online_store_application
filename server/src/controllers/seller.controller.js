import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/features.js";
import { TryCatch } from "../utils/TryCatch.js";
import { redisClient } from "../server.js";

const CACHE_KEY = {
  USER: "user",
  PRODUCT:"product",
  MYPRODUCTS:"myProducts",
}

const registerSeller = TryCatch(async (req, res, next) => {
  const userId = req.user._id;
  console.log(req.user);
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  if (user.role === "seller" || user.role === "admin") {
    return next(new ErrorHandler("You are already a seller", 400));
  }

  const { storeName, email, password, phoneNumber } = req.body;
  
  if (
    [email, password, phoneNumber, storeName].some((field) => field?.trim() === "")) {
    return next(new ErrorHandler("All fields are required!!", 400));
  } 
  
  if ( user.email !== email || !isPasswordValid || user.phoneNumber !== phoneNumber) {
    return next(new ErrorHandler("Invalid user details", 400));
  }

  user.role = "seller";
  user.storeName = storeName;
  user.save();
  await redisClient.set( `${CACHE_KEY.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated);

  console.log(res.status)
    return res.status(200).json({
      success: true,
      message: "User registered as a seller",
      user,
    });
});

const addProduct = TryCatch(async (req, res, next) => {

  const sellerId = req.user._id;

  const storeName = req.user.storeName;
  const user = await User.findById(sellerId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const {
    name,
    description,
    category,
    brand,
    stock,
    sellingPrice,
    originalPrice,
    colors,
    sizes,
  } = req.body;
  const existingProduct = await Product.findOne({
    name: req.body.name,
    sellerId: req.body.sellerId,
  });

  if (existingProduct) {
    return res.status(400).json({
      error: "Product with this name already exists in your store",
    });
  }


  const productImages = req.files;
  
  if (!productImages || productImages.length === 0) {
    return next(new ErrorHandler("Product images are required", 400));
  }
  const images = [];
  for (let i = 0; i < productImages.length; i++) {
    const imagePath = await uploadOnCloudinary(productImages[i].path);
    images.push(imagePath.url);
    console.log(imagePath.url)
  }

  const createdProduct = await Product.create({
    name,
    description,
    category,
    brand,
    stock,
    sellingPrice,
    originalPrice,
    images,
    colors,
    sizes,
    sellerId: sellerId,
    storeName,
  });

  user.products.push(createdProduct._id);
  await user.save();
  const productsKey = `${CACHE_KEY.PRODUCT}${user._id}`;
  await redisClient.set(`${CACHE_KEY.USER}${user._id}`, JSON.stringify(user));
  invalidateCache(userUpdated, ProductAdded);
  await redisClient.set(productsKey, JSON.stringify(createdProduct));

  res.status(200).json({
    success: true,
    message: "Product added successfully",
    createdProduct,
    user,
  });
});

const updateProductData = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  const user = await User.findById(req.user._id)
  if (!product) {
    return next(new ErrorHandler(`Product with ${id} not found`, 404));
  }
  if (product.sellerId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "this is are not your product, therefore you authorized to update this product",
        403
      )
    );
  }

  const {
    name,
    description,
    category,
    brand,
    stock,
    sellingPrice,
    originalPrice,
    sellerOrg,
    colors,
    sizes,
  } = req.body;


  console.log("req.body : ", req.body);
  console.log("req.file : ", req.files);
  if (req.files) {
    console.log("true");
    for (let i = 0; i < product.images.length; i++) {
      deleteFromCloudinary(product.images[i]);
    }
    const productImages = req.files;
    if (!productImages || productImages.length === 0) {
      return next(new ErrorHandler("Product images are required", 400));
    }
    let images = [];
    for (let i = 0; i < productImages.length; i++) {
      const imagePath = await uploadOnCloudinary(productImages[i].path);
      images.push(imagePath.url);
    }
    product.images = images;
  }

  if (name) {
    product.name = name;
  }
  if (sellerOrg ) {
    product.sellerOrg = sellerOrg;
    req.user.sellerOrg = sellerOrg;
  }
    if (description ) {
    product.description = description;
  }
  if (category ) {
    product.category = category;
  }
  if (brand) {
    product.brand = brand;
  }
    if (stock) {
    product.stock = stock;
  }
  if (sellingPrice) {
    product.sellingPrice = sellingPrice;
  }
  if (originalPrice) {
    product.originalPrice = originalPrice;
  }
  if (colors) {
    product.colors = colors;
  }
  if (sizes) {
    product.sizes = sizes;
  }

  await product.save();
  await user.save();

  const productsKey = `${CACHE_KEY.MYPRODUCTS}${user._id}`;
  await redisClient.set(`${CACHE_KEY.USER}${user._id}`, JSON.stringify(user));
  await redisClient.set(productsKey, JSON.stringify(createdProduct));
  invalidateCache(userUpdated, ProductUpdated);

  

  return res.status(200).json({
    success: true,
    message: `Product with ${id} updated successfully`,
    user,
    product,
  });
});

const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(req.user._id);

  await user.save();
  const product = await Product.findByIdAndDelete(id);
  const productsKey = `${CACHE_KEY.MYPRODUCTS}${user._id}`;
  await redisClient.set(`${CACHE_KEY.USER}${user._id}`, JSON.stringify(user));
  await redisClient.del(productsKey);

  
  invalidateCache(userUpdated, ProductUpdated);
  
  return res.status(200).json({
    success: true,
    message: `Product with ${id} deleted successfully`,
  });
});

const getAllSellerProducts = TryCatch(async (req, res, next) => {
  const sellerId = req.user._id;
  let cachedProducts;
    const productsKey = `${CACHE_KEY.MYPRODUCTS}${sellerId}`;
    const exists = await redisClient.exists(productsKey);
    if(exists){
      cachedProducts = await redisClient.get(productsKey);
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products: JSON.parse(cachedProducts),
      });
    }

  const products = await Product.find( {sellerId: sellerId} );
  if (!products || products.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No products found for this seller",
    });
  }
  await redisClient.set(productsKey, JSON.stringify(products));
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
});

export {
  registerSeller,
  addProduct,
  updateProductData,
  deleteProduct,
  getAllSellerProducts,
};
