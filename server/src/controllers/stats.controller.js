import { TryCatch } from "../utils/TryCatch.js";
import User from "../models/user.model.js"
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const sellerStats = TryCatch(async (req, res) => {
  const sellerId = req.user._id;
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  console.log(firstDayOfMonth);
  

  // Get all products for the seller
  const products = await Product.find({ sellerId });
  const lastMonthProducts = products.filter(
    (p) => p.createdAt < firstDayOfMonth
  );
  const thisMonthProducts = products.filter((p) => {
    return p.createdAt >= firstDayOfMonth;
  });

  // Calculate product stats
  const productStats = {
    totalProducts: products.length,
    lastMonthProducts: lastMonthProducts.length,
    thisMonthProducts: thisMonthProducts.length,
    percentageChange:
      lastMonthProducts.length === 0
        ? 0
        : (
            ((products.length - lastMonthProducts.length) /
              lastMonthProducts.length) *
            100
          ).toFixed(2),
  };

  // Get seller data for orders
  const seller = await User.findById(sellerId);
  const soldOrders = seller.soldOrders || [];

  // Calculate order stats
  const lastMonthOrders = soldOrders.filter(
    (o) => new Date(o.createdAt) < firstDayOfMonth
  );
  const totalRevenue = soldOrders.reduce((sum, order) => {
    const orderRevenue = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return sum + orderRevenue * 0.95; // 95% of revenue (5% commission)
  }, 0);

  const orderStats = {
    totalOrders: soldOrders.length,
    lastMonthOrders: lastMonthOrders.length,
    totalRevenue: totalRevenue.toFixed(2),
    orderPercentageChange:
      lastMonthOrders.length === 0
        ? 0
        : (
            ((soldOrders.length - lastMonthOrders.length) /
              lastMonthOrders.length) *
            100
          ).toFixed(2),
  };

  // Calculate average rating
  let totalRating = 0;
  let reviewCount = 0;
  products.forEach((product) => {
    product.reviews.forEach((review) => {
      totalRating += review.rating;
      reviewCount++;
    });
  });
  const averageRating =
    reviewCount === 0 ? 0 : (totalRating / reviewCount).toFixed(2);

  // Calculate monthly stats
  const monthlyStats = [];

  // Last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1); // Start of the month
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1); // Start of the next month

    // Monthly revenue
    const monthOrders = soldOrders.filter((o) => {
      const orderDate = new Date(o.createdAt); // Ensure `createdAt` field exists
      return orderDate >= date && orderDate < nextMonth;
    });

    const monthRevenue = monthOrders.reduce((sum, order) => {
      const orderRevenue = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return sum + orderRevenue * 0.95;
    }, 0);

    monthlyStats.push({
      _id: { year: date.getFullYear(), month: date.getMonth() + 1 },
      revenue: monthRevenue.toFixed(2),
    });
  }

  // Get low stock products
  const lowStockProducts = await Product.find({sellerId})
    .select("name stock sellingPrice images")
    .sort("stock");

  return res.status(200).json({
    success: true,
    products: productStats,
    orders: orderStats,
    rating: { averageRating },
    monthlyStats,
    lowStockProducts,
  });
});

const adminStats = TryCatch(async (req, res) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all orders
  const orders = await Order.find({}); // Assumes "Order" is your model for orders
  const totalRevenue = orders.reduce((sum, order) => {
    // Ensure order.orderItems is an array
    if (!order.orderItems || !Array.isArray(order.orderItems)) return sum;

    const orderRevenue = order.orderItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
    return sum + orderRevenue;
  }, 0);

  // Calculate admin earnings (10% of total revenue)
  const adminEarnings = (totalRevenue * 0.1).toFixed(2);

  // Order stats
  const lastMonthOrders = orders.filter(
    (order) => new Date(order.createdAt) < firstDayOfMonth
  );
  const orderStats = {
    totalOrders: orders.length,
    lastMonthOrders: lastMonthOrders.length,
    orderPercentageChange:
      lastMonthOrders.length === 0
        ? 0
        : (
            ((orders.length - lastMonthOrders.length) /
              lastMonthOrders.length) *
            100
          ).toFixed(2),
  };

  // Orders pie chart data
  const pieChartData = {
    delivered: orders.filter((order) => order.status === "Delivered").length,
    pending: orders.filter((order) => order.status === "Pending").length,
    outForDelivery: orders.filter(
      (order) => order.status === "Out for Delivery"
    ).length,
    orderConfirmed: orders.filter((order) => order.status === "Order Confirmed")
      .length,
    shipped: orders.filter((order) => order.status === "Shipped").length,
  };

  // Monthly orders and earnings
  const monthlyOrders = [];
  const monthlyEarnings = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= date && orderDate < nextMonth;
    });

    const monthRevenue = monthOrders.reduce((sum, order) => {
      if (!order.orderItems || !Array.isArray(order.orderItems)) return sum;

      const orderRevenue = order.orderItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      );
      return sum + orderRevenue;
    }, 0);

    monthlyOrders.push({
      _id: { year: date.getFullYear(), month: date.getMonth() + 1 },
      ordersPlaced: monthOrders.length,
    });

    monthlyEarnings.push({
      _id: { year: date.getFullYear(), month: date.getMonth() + 1 },
      earnings: (monthRevenue * 0.1).toFixed(2), // Admin earnings
    });
  }

  res.json({
    orders: orderStats,
    adminEarnings: adminEarnings,
    monthlyOrders,
    monthlyEarnings,
    pieChartData,
  });
});




export {sellerStats, adminStats}