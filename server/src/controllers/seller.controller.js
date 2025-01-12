import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/features.js";
import { TryCatch } from "../utils/TryCatch.js";

const registerSeller = TryCatch(async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  if (user.role === "seller" || user.role === "admin") {
    return next(new ErrorHandler("You are already a seller", 400));
  }

  const { sellerOrg, email, password, phoneNumber } = req.body;
  if (
    [email, password, phoneNumber, storeName].some((field) => field?.trim() === "")) {
    return next(new ErrorHandler("All fields are required!!", 400));
  }

  const flag = await User.findOne(storeName);
  if (flag) {
    return next(new ErrorHandler("Store name already exists", 400));
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (
    user.email !== email ||
    !isPasswordValid ||
    user.phoneNumber !== phoneNumber
  ) {
    return next(new ErrorHandler("Invalid user details", 400));
  }

  user.role = "seller";
  user.storeName = storeName;
  user.save();

  return res.status(200).json({
    success: true,
    message: "User registered as a seller",
    user,
  });
});

const addProduct = TryCatch(async (req, res, next) => {
  const sellerId = req.user._id;

  const store = req.user.sellerOrg;
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
    price,
    originalPrice,
    colors,
    sizes,
  } = req.body;
  if (colors) {colors = JSON.parse(colors); }
  if (sizes) { sizes = JSON.parse(sizes); }
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
  }

  const createdProduct = await Product.create({
    name,
    description,
    category,
    brand,
    stock,
    price,
    originalPrice,
    images,
    colors,
    sizes,
    sellerId: sellerId,
    storeName: store,
  });

  user.products.push(createdProduct._id);
  await user.save();

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
  if (!product) {
    return next(new ErrorHandler(`Product with ${id} not found`, 404));
  }
  if (!product.seller.equals(req.user._id)) {
    return next(
      new ErrorHandler(
        "this is are not your product, therefore you authorized to update this product",
        403
      )
    );
  }

  let {
    name,
    description,
    category,
    brand,
    stock,
    price,
    originalPrice,
    sellerOrg,
  } = req.body;

  let { colors, sizes } = req.body;
  if (colors) {
    colors = JSON.parse(colors);
    product.colors = colors;
  }
  if (sizes) {
    sizes = JSON.parse(sizes);
    product.sizes = sizes;
  }

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
  if (price) {
    product.price = price;
  }
  if (originalPrice) {
    product.originalPrice = originalPrice;
  }
  product.save();

  return res.status(200).json({
    success: true,
    message: `Product with ${id} updated successfully`,
    product,
  });
});

const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: `Product with ${id} deleted successfully`,
  });
});

const getAllSellerProducts = TryCatch(async (req, res, next) => {
  const sellerId = req.user._id;

  const products = await Product.find({ seller: sellerId });
  if (!products || products.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No products found for this seller",
    });
  }
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
