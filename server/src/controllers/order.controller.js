import Product from "../models/product.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "./../utils/TryCatch.js";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import { stripe } from "../app.js";

const newOrder = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Check if the user's address is complete
  if (
    !user.address?.street ||
    !user.address?.city ||
    !user.address?.state ||
    !user.address?.zip
  ) {
    return next(
      new ErrorHandler("Please complete address details in your profile", 400)
    );
  }

  const { orderItems, couponCode } = req.body;

  // Validate orderItems
  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No items in order", 400));
  }

  let total = 0;
  let subtotal = 0;
  let tax = 0;
  let discount = 0;
  let deliveryCharges = 0;

  // Group order items by seller
  const sellerOrderItems = new Map();
  const processedOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found with ID: ${item.productId}`, 404)
      );
    }
    if (product.stock < item.quantity) {
      return next(
        new ErrorHandler(`Insufficient stock for ${product.name}`, 400)
      );
    }

    const orderItem = {
      name: product.name,
      photo: product.images[0],
      price: product.sellingPrice,
      quantity: item.quantity,
      productId: product._id,
      storeName: product.storeName, // Add seller reference
    };

    processedOrderItems.push(orderItem);

    // Group items by seller
    if (!sellerOrderItems.has(product.sellerId.toString())) {
      sellerOrderItems.set(product.sellerId.toString(), []);
    }
    sellerOrderItems.get(product.sellerId.toString()).push(orderItem);

    // Update product stock
    product.stock -= item.quantity;
    await product.save();

    total += product.sellingPrice * item.quantity;
  }

  // Calculate order financials
  tax = total * 0.05; // Example tax rate

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) { 
      return next(new ErrorHandler("Invalid coupon code", 400));
    }
    
    const today = new Date();
    if (today > coupon.validUntil || coupon.status === 'expired') {
      coupon.status = 'expired';
      await coupon.save();
      return next(new ErrorHandler("Coupon code is expired", 400));
    } 
    if (coupon.validFrom > today) { 
      return next(new ErrorHandler("Coupon code is not valid yet", 400));
    }
    
    discount = (total * coupon.discountPercent) / 100; 
  }

  subtotal = total + tax - discount;

  if (subtotal < 500) {
    deliveryCharges = subtotal * 0.1; // Example delivery charge calculation
  }

  // Create main order
  const order = await Order.create({
    customer: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    },
    orderItems: processedOrderItems,
    status: "Pending",
    totalPrice: parseInt(total.toFixed(2)),
    tax: parseInt(tax.toFixed(2)),
    discount: parseInt(discount.toFixed(2)),
    subtotal: parseInt(subtotal.toFixed(2)),
    deliveryCharges: parseInt(deliveryCharges.toFixed(2)),
    couponCodeUsed: couponCode || null,
  });

  // Update user's orders
  user.orders.push(order._id);
  await user.save();

  // Update each seller's `soldOrders` with their relevant order items
  for (const [sellerId, items] of sellerOrderItems) {
    const seller = await User.findById(sellerId);
    if (seller) {
      // Calculate total quantity of all items for this seller
      const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

      const soldOrder = {
        items: items, // All items for this seller
        total: totalQuantity, // Total quantity
      };

      if (!Array.isArray(seller.soldOrders)) {
        seller.soldOrders = [];
      }
      seller.soldOrders.push(soldOrder);
      await seller.save();
    }
  }

  // Find admin users and update their `adminOrders` array
  const admins = await User.find({ role: "admin" });

  for (const admin of admins) {
    if (!Array.isArray(admin.adminOrders)) {
      admin.adminOrders = [];
    }
    admin.adminOrders.push(order._id); // Add the order ID directly
    await admin.save();
  }

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

const getMyOrders = TryCatch(async (req, res, next) => { 
  const orders = await Order.find({ "customer.email": req.user.email });
  if (!orders) {
    return next(new ErrorHandler("No orders found for this customer", 404));
  }
  return res
   .status(200)
   .json({ success: true, message: "Orders fetched successfully", orders });
})

const getOrderById = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Order fetched successfully", order });
});

const updateOrderStatus = TryCatch(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  order.status = req.body.status;
  await order.save();
  return res
    .status(200)
    .json({ success: true, message: "Order updated successfully", order });
});

const getAllOrders = TryCatch(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: "orderItems.productId",
      select: "name images sellingPrice storeName sellerId",
      populate: {
        path: "sellerId",
        select: "firstName lastName email storeName",
      },
    })
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    count: orders.length,
    orders,
  });
});

const getUserOrderByEmailByAdmin = TryCatch(async (req, res, next) => {
  const email = req.params.email;
  const order = await Order.findOne({ "customer.email": email });
  if (!order) {
    return next(new ErrorHandler("Order not found for this customer", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});


const getOrderByStatus = TryCatch(async (req, res, next) => {
  const {status} = req.query;

  console.log(status);
  
  
  const orders = await Order.find({ status:status });
  if (!orders) {
    return next(new ErrorHandler("No orders found with this status", 404));
  }
  return res
   .status(200)
   .json({ success: true, message: "Orders fetched successfully",count:orders.length, orders });
})




export {
  newOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getUserOrderByEmailByAdmin,
  getMyOrders,
  getOrderByStatus,
};
