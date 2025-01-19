
import Product from "../models/product.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "../utils/TryCatch.js";
import { redisClient } from './../server.js';

const CACHE_KEYS ={
  PRODUCT:"product",
  ALLPRODUCTS:"allProducts",
  SINGLEPRODUCT:"singleProduct",
  MYPRODUCTS:"myProducts",
  LATESTPRODUCT:"latestProduct",
  GETCATEGORYPRODUCT:"getCategoryProduct",
  ALLCATEGORY:"allCategory",
  SINGLECATEGORY:"singleCategory"

}

const getProductInfo = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let cachedProduct;
  const productkey = `${CACHE_KEYS.PRODUCT}${id}`;
  const exists = await redisClient.exists(productkey);

  if(exists){
    cachedProduct = await redisClient.get(productkey);
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: JSON.parse(cachedProduct),
    });
  }

  
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler(`Product with ${id} not found`, 404));
  }

  await redisClient.set(productkey, JSON.stringify(product),);

  res.status(200).json({
    success: true,
    message: `Product with ${id} fetched successfully`,
    product,
  });
});

const getMyProducts = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  let cachedProducts;
  const productsKey = `${CACHE_KEYS.MYPRODUCTS}${userId}`;
  const exists = await redisClient.exists(productsKey);
  if(exists){
    cachedProducts = await redisClient.get(productsKey);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: JSON.parse(cachedProducts),
    });
  }

  const products = await Product.find({ seller: userId });

  if (!products || products.length === 0) {
    return next(new ErrorHandler(`No products found from ${user.storeName}`, 404));
  }

  await redisClient.set(productsKey, JSON.stringify(products));

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  })

});

const getAllProducts = TryCatch(async (req, res, next) => {

  let allCachedProducts;
  const allProductkey = `${CACHE_KEYS.ALLPRODUCTS}`;
  const exists = await redisClient.exists(allProductkey);
  if(exists){
    allCachedProducts = await redisClient.get(allProductkey);
    return res.status(200).json({
      success: true,
      message: "All products fetched successfully",
      products: JSON.parse(allCachedProducts),
    });
  }
  const products = await Product.find({});

  await redisClient.set(allProductkey, JSON.stringify(products));

  return res.status(200).json({
    success: true,
    message: "All products fetched successfully",
    products,
  })
});

const latestProduct = TryCatch(async (req, res, next) => { 

  let cachedLatestProducts;
  const latestProductKey = `${CACHE_KEYS.LATESTPRODUCT}`;
  const exists = await redisClient.exists(latestProductKey);
  if(exists){
    cachedLatestProducts = await redisClient.get(latestProductKey);
    return res.status(200).json({
      success: true,
      message: "Latest products fetched successfully",
      products: JSON.parse(cachedLatestProducts),
    });
  }
  const products = await Product.find().sort({ createdAt: -1 }).limit(6);
  if (!products || products.length === 0) { 
    return next(new ErrorHandler("No products found", 404)); 
  }

  await redisClient.set(latestProductKey, JSON.stringify(products));

  return res.status(200).json({
    success: true,
    message: "Latest products fetched successfully",
    products,
  })
})

const getProductsByCategory = TryCatch(async (req, res, next) => {
  const category = req.params.category;
  let cachedCategoryProducts;
  const categoryProductKey = `${CACHE_KEYS.GETCATEGORYPRODUCT}${req.params.category}`;
  const exists = await redisClient.exists(categoryProductKey);
  if(exists){
    cachedCategoryProducts = await redisClient.get(categoryProductKey);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: JSON.parse(cachedCategoryProducts),
    });
  }
  
  const products = await Product.find({ category });
  if (!products || products.length === 0) {
    return next(new ErrorHandler(`No products found in ${category} category`, 404));
  }
  await redisClient.set(categoryProductKey, JSON.stringify(products));
  return res.status(200).json({
    success: true,
    message: `Products in ${category} category fetched successfully`,
    total:products.length,
    products,
  })
});

const getAllCategories = TryCatch(async (req, res) => {
  let cachedAllCategories;
  const allCategoriesKey = `${CACHE_KEYS.ALLCATEGORY}`;
  const exists = await redisClient.exists(allCategoriesKey);
  if(exists){
    cachedAllCategories = await redisClient.get(allCategoriesKey);
    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      categories: JSON.parse(cachedAllCategories),
    });
  }
  const categories = await Product.distinct("category");
  if (!categories || categories.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No categories found",
    });
  }
  await redisClient.set(allCategoriesKey, JSON.stringify(categories));
  return res.status(200).json({
    success: true,
    message: "All categories fetched successfully",
    total: categories.length,
    categories,
  });
})

const getSingleProductOfCategory = TryCatch(async (req, res)=>{
  let cachedCategoryProducts;
  const categoryProductKey = `${CACHE_KEYS.SINGLECATEGORY}${req.params.category}`;
  const exists = await redisClient.exists(categoryProductKey);
  if(exists){
    cachedCategoryProducts = await redisClient.get(categoryProductKey);
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      products: JSON.parse(cachedCategoryProducts),
    });
  }
  const categories = await Product.distinct("category");
  let products=[];

  for (const category of categories) {
    const product = await Product.find({ category }).limit(1);
    if (product.length) products.push(product[0]); // Push only the first product
  }
  await redisClient.set(`${CACHE_KEYS.SINGLECATEGORY}${req.params.category}`, JSON.stringify(products));
    return res.status(200).json({
      success: true,
      total:products.length,
      products,
    })
})




export { getProductInfo, getAllProducts, latestProduct, getMyProducts, getProductsByCategory, getAllCategories, getSingleProductOfCategory };