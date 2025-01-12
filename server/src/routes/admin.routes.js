import { Router } from "express";
import {
  getAllUsers,
  getUserByIdByAdmin,
  updateUserByAdmin,
  deleteUserByIdByAdmin,
  createCoupon,
} from "../controllers/admin.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getProductInfo } from "../controllers/product.controller.js";
import { adminStats } from "../controllers/stats.controller.js";

const router = Router();

router
  .route("/getAllUsers")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.route("/user/:id")
  .get(isAuthenticated,authorizeRoles("admin"), getUserByIdByAdmin)
  .put(isAuthenticated,authorizeRoles("admin"), upload.single("avatar"), updateUserByAdmin)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUserByIdByAdmin);
router.route("/product/:id").get(getProductInfo);

router.route('/create-coupon').post(isAuthenticated, authorizeRoles("admin"), createCoupon);

router.route("/my-stats").get(isAuthenticated, authorizeRoles("admin"), adminStats)

export default router;
