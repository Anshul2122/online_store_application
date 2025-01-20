import { Router } from "express";
import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  getOrderById,
  newOrder,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
  getOrderByStatus,
  getUserOrderByEmailByAdmin,
  confrimOrder,
  getSellerOrder
} from "../controllers/order.controller.js";

const router = Router();

router.route("/new-order").post(isAuthenticated, newOrder);
router.route("/confirm-order/:id").post(isAuthenticated, confrimOrder)
router.route("/my").get(isAuthenticated, getMyOrders);
router.route("/order/:id").get(isAuthenticated, getOrderById).put(isAuthenticated, authorizeRoles("admin"), updateOrderStatus).delete(isAuthenticated, authorizeRoles("admin"), );
router.route("/all-orders").get(isAuthenticated, authorizeRoles("admin"), getAllOrders)
router.route("/all/order-status").get(isAuthenticated, authorizeRoles("admin"), getOrderByStatus);
router.route("/all/user-orders/:email").get(isAuthenticated, authorizeRoles("admin"), getUserOrderByEmailByAdmin)
router.route("/getSellerOrder").get(isAuthenticated, authorizeRoles("seller"), getSellerOrder)



export default router;
