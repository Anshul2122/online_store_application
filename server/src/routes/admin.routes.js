import { Router } from "express";
import {
  getAllUsers,
  getUserByIdByAdmin,
  createCoupon,
  getAllCoupons,
  getCouponById,
} from "../controllers/admin.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getProductInfo } from "../controllers/product.controller.js";
import { adminStats } from "../controllers/stats.controller.js";

const router = Router();

router
  .route("/getAllUsers")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.route("/user/:id")
  .get(isAuthenticated,authorizeRoles("admin"), getUserByIdByAdmin)
router.route("/product/:id").get(getProductInfo);

router.route('/getCoupons').get(isAuthenticated, authorizeRoles("admin"), getAllCoupons)
router.route('/create-coupon').post(isAuthenticated, authorizeRoles("admin"), createCoupon);
router.route('/get-coupon/:id').get(isAuthenticated, getCouponById);

router.route("/my-stats").get(isAuthenticated, authorizeRoles("admin"), adminStats)

export default router;
