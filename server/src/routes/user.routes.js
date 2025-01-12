import {Router} from 'express';
import {
  deleteUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  addToCart,
  addToWishlist,
  getCartProduct,
  getWishListProduct,
  removeFromCart,
  removeFromWishlist,
} from "../controllers/user.controller.js";
import { upload } from './../middlewares/multer.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { getProductInfo } from '../controllers/product.controller.js';

const router = Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(isAuthenticated, logoutUser);
router.route('/me').get(isAuthenticated, getCurrentUser).put(isAuthenticated, upload.single('avatar'), updateUser).delete(isAuthenticated, deleteUser);
router.route("/add-to-cart/:id").post(isAuthenticated, addToCart);
router.route("/remove-from-cart/:id").post(isAuthenticated, removeFromCart);
router.route("/add-to-wishlist/:id").post(isAuthenticated, addToWishlist);
router.route("/remove-from-wishlist/:id").post(isAuthenticated, removeFromWishlist);
router.route("/my-wishlist").get(isAuthenticated, getWishListProduct);
router.route("/my-cart").get(isAuthenticated, getCartProduct);
router.route("/product/:id").get(getProductInfo);



export default router;