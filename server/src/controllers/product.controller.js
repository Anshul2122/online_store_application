import Product from "../models/product.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "../utils/TryCatch.js";

const getProductInfo = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler(`Product with ${id} not found`, 404));
  }

  res.status(200).json({
    success: true,
    message: `Product with ${id} fetched successfully`,
    product,
  });
});


const getMyProducts = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  const products = await Product.find({ seller: userId });

  if (!products || products.length === 0) {
    return next(new ErrorHandler(`No products found from ${user.storeName}`, 404));
  }

});

const getAllProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({});

  return res.status(200).json({
    success: true,
    message: "All products fetched successfully",
    products,
  })
});


const latestProduct = TryCatch(async (req, res, next) => { 
  const products = await Product.find().sort({ createdAt: -1 }).limit(6);
  if (!products || products.length === 0) { 
    return next(new ErrorHandler("No products found", 404)); 
  }

  return res.status(200).json({
    success: true,
    message: "Latest products fetched successfully",
    products,
  })
})

const getProductsByCategory = TryCatch(async (req, res, next) => {
  const category = req.params.category;
  const products = await Product.find({ category });
  if (!products || products.length === 0) {
    return next(new ErrorHandler(`No products found in ${category} category`, 404));
  }
  return res.status(200).json({
    success: true,
    message: `Products in ${category} category fetched successfully`,
    total:products.length,
    products,
  })
});


const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  if (!categories || categories.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No categories found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "All categories fetched successfully",
    total: categories.length,
    categories,
  });
})

export { getProductInfo, getAllProducts, latestProduct, getMyProducts, getProductsByCategory, getAllCategories };