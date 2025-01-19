import { Router } from "express";
import {
  registerSeller,
  addProduct,
  updateProductData,
  getAllSellerProducts,
  deleteProduct,
} from "../controllers/seller.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { getProductInfo } from "../controllers/product.controller.js";
import { sellerStats } from "../controllers/stats.controller.js";

const router = Router();

router.route("/register").post(isAuthenticated, authorizeRoles("customer"), registerSeller);
router.route("/add-product").post(isAuthenticated, authorizeRoles("seller"), upload.array("images", 5), addProduct);
router
  .route("/product/:id")
  .get(getProductInfo)
  .put( isAuthenticated, authorizeRoles("seller", "admin"), upload.array("images", 5), updateProductData)
  .delete(isAuthenticated, authorizeRoles("seller", "admin"), deleteProduct);
router.route("/my-allProducts").get(isAuthenticated, authorizeRoles("seller"), getAllSellerProducts);

router.route("/my-stats").get(isAuthenticated, authorizeRoles("seller"), sellerStats);

export default router;
