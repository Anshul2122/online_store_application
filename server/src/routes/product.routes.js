import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getAllCategories, getAllProducts, getMyProducts, getProductsByCategory, getProductInfo, latestProduct } from "../controllers/product.controller.js";


const router = Router();

router.route("/latest").get(isAuthenticated, latestProduct);

router.route("/prod/:id").get(isAuthenticated, getProductInfo);

router.route("/my").get(isAuthenticated,authorizeRoles("seller"), getMyProducts );

router.route("/all").get(isAuthenticated, authorizeRoles("admin"), getAllProducts);

router.route("/category/:category").get(isAuthenticated, getProductsByCategory);

router.route("/categories").get(getAllCategories);

export default router;
