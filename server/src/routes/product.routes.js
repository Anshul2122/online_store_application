import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getAllCategories, getAllProducts, getMyProducts, getProductsByCategory, getProductInfo, latestProduct,getSingleProductOfCategory  } from "../controllers/product.controller.js";


const router = Router();

router.route("/latest").get( latestProduct);

router.route("/product/:id").get(getProductInfo);

router.route("/my").get(isAuthenticated,authorizeRoles("seller"), getMyProducts );

router.route("/all").get(isAuthenticated, getAllProducts);

router.route("/category/:category").get(getProductsByCategory);

router.route("/categories").get(getAllCategories);

router.route("/single-category-product").get(getSingleProductOfCategory);

export default router;
