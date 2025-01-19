import Product from "../models/product.model.js";
import { ErrorHandler } from "../utils/error.js";
import { TryCatch } from "./../utils/TryCatch.js";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import { stripe } from "../app.js";
import { redisClient } from "../server.js";


const CACHE_KEY={
  ORDER:"order",
  MYORDER:"myorder",
  ORDERBYID:"orderID",
  ALLORDERS:"allorders",
  ORDERBYSTATUS:"orderStatus",
  SELLERORDERS:"sellerOrder",
}


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

  console.log(orderItems);
  

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
      image:product.images[0],
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
  tax = total * 0.01; // Example tax rate

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
    deliveryCharges = subtotal * 0.05; // Example delivery charge calculation
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
    couponUsed: couponCode || null,
  });

  const lineItems = processedOrderItems.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: [item.photo],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));
  if (tax > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: "Tax",
        },
        unit_amount: parseInt(tax * 100),
      },
      quantity: 1,
    });
  }


  if (deliveryCharges > 0) {
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: parseInt(deliveryCharges * 100),
      },
      quantity: 1,
    });
  }


  const discountObject = discount > 0 ? {
    discounts: [{
      coupon: await stripe.coupons.create({
        amount_off: parseInt(discount * 100),
        currency: 'inr',
        duration: "once",
      }),
    }],
  } : {};


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CORS_ORIGIN}/order/success/${order._id}`,
    cancel_url: `${process.env.CORS_ORIGIN}/order/cancel?order_id=${order._id}`,
    customer_email: user.email,
    client_reference_id:order._id.toString(),
    metadata: {
      order_id: order._id.toString(),
    },
   ...discountObject,
  })

  // console.log("session : ",session.url)

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

  await redisClient.set(`${CACHE_KEY.ORDER}${order._id}`, JSON.stringify(order))
  
  invalidateCache(userUpdated, orderAdded, productUpdated);
  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
    paymenturl:session.url,
  });
});

const confrimOrder = TryCatch(async (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if(order.status === 'Order Confirmed'){
    return res.status(200).json({
      success: false,
      message: "Order is confirmed",
      order,
    })
  }

  const user = await User.findById(userId);
  user.cart = [];
  await user.save();


  order.status = "Order Confirmed";
  await order.save();
  order.orderItems.forEach(async(item )=> {
    const product = await Product.findByIdAndUpdate(item.productId);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  })
  await redisClient.set(`${CACHE_KEY.ORDER}${order._id}`, JSON.stringify(order))
  invalidateCache(userUpdated, orderAdded, productUpdated);

  return res.status(200).json({
    success: true,
    message: "Order confirmed",
    order,
  });
})

const getMyOrders = TryCatch(async (req, res, next) => { 
  let cachedMyOrders;
  const myOrderKey = `${CACHE_KEY.MYORDER}${req.user._id}`;

  const exists = await redisClient.exists(myOrderKey);
  console.log("exists", exists)
  const data = await redisClient.get(myOrderKey);
  console.log("data", JSON.parse(data));
  if(exists){
    cachedMyOrders = await redisClient.get(myOrderKey);
    cachedMyOrders = JSON.parse(cachedMyOrders);
    return res.status(200).json({success:true, message:"",orders:cachedMyOrders})
  }
  const orders = await Order.find({ "customer.email": req.user.email });
  if (!orders) {
    return next(new ErrorHandler("No orders found for this customer", 404));
  }
  await redisClient.set(`${myOrderKey}`, JSON.stringify(orders));
  return res
   .status(200)
   .json({ success: true, message: "Orders fetched successfully", orders });
})

const getOrderById = TryCatch(async (req, res, next) => {
  let cachedOrderById;
  const orderIdKey = `${CACHE_KEY.ORDER}${req.params.id}`;
  const exists = redisClient.exists(orderIdKey);
  if(exists){
    cachedOrderById = await redisClient.get(orderIdKey);
    return res.status(200).json({success:true, message:"",cachedOrderById})
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  await redisClient.set(`${CACHE_KEY.ORDER}${order._id}`, JSON.stringify(order))
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
  const orders = await Order.find({})
    .populate({
      path: "orderItems.productId",
      select: "name images sellingPrice storeName sellerId",
      populate: {
        path: "sellerId",
        select: "firstName lastName email storeName",
      },
    })
    .sort({ createdAt: -1 });

    await redisClient.set(`${CACHE_KEY.ORDER}${order._id}`, JSON.stringify(order)).
    invalidateCache(userUpdated, orderAdded, productUpdated);

  return res
    .status(200)
    .json({ success: true, message: "Order updated successfully", orders });
});

const getAllOrders = TryCatch(async (req, res, next) => {
  let cachedAllOrders;
  const allOrdersKey = `${CACHE_KEY.ALLORDERS}`;
  const exists = redisClient.exists(allOrdersKey);
  if(exists){
    cachedAllOrders = await redisClient.get(allOrdersKey);
    cachedAllOrders = JSON.parse(cachedAllOrders);
    return res.status(200).json({success:true, message:"",orders:cachedAllOrders})
  }
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
  await redisClient.set(`${allOrdersKey}`, JSON.stringify(orders))

  return res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    count: orders.length,
    orders,
  });
});

const getUserOrderByEmailByAdmin = TryCatch(async (req, res, next) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  let cachedOrderByEmail;
  const orderByEmailKey = `${CACHE_KEY.MYORDER}${user._id}`;
  const exists = redisClient.exists(orderByEmailKey);
  if(exists){
    cachedOrderByEmail = await redisClient.get(orderByEmailKey);
    return res.status(200).json({success:true, message:"",cachedOrderByEmail})
  }
  const order = await Order.findOne({ "customer.email": email });
  if (!order) {
    return next(new ErrorHandler("Order not found for this customer", 404));
  }
  await redisClient.set(`${orderByEmailKey}`, JSON.stringify(order))
  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});

const getOrderByStatus = TryCatch(async (req, res, next) => {
  const {status} = req.query;

  let cachedOrderByStatus;
  const orderByStatusKey = `${CACHE_KEY.ORDERBYSTATUS}${status}`;
  const exists = redisClient.exists(orderByStatusKey);
  if(exists){
    cachedOrderByStatus = await redisClient.get(orderByStatusKey);
    return res.status(200).json({success:true, message:"",cachedOrderByStatus})
  }
  const orders = await Order.find({ status: status })
    .populate({
      path: "orderItems.productId",
      select: "name images sellingPrice storeName sellerId",
      populate: {
        path: "sellerId",
        select: "firstName lastName email storeName",
      },
    })
    .sort({ createdAt: -1 });
  if (!orders) {
    return next(new ErrorHandler("No orders found with this status", 404));
  }
  await redisClient.set(`${orderByStatusKey}`, JSON.stringify(orders))
  return res
   .status(200)
   .json({ success: true, message: "Orders fetched successfully",count:orders.length, orders });
})

const getSellerOrder = TryCatch(async (req, res, next) => {
  const sellerId = req.params.sellerId;
  let cachedSoldOrders;
  const soldOrderKey = `${CACHE_KEY.SELLERORDERS}${sellerId}`
  const exists = redisClient.exists(soldOrderKey);
  if (exists) {
    cachedSoldOrders = JSON.parse(await redisClient.get(soldOrderKey));
    return res.status(200).json({ success: true, message: "Sold orders fetched from cache", soldOrdes: cachedSoldOrders });
  }
  const seller = await User.findById(sellerId);
  const soldOrdes = seller.soldOrders;
  await redisClient.set(`${soldOrderKey}`, JSON.stringify(soldOrdes));
  return res.status(200).json({ success: true, message: "", soldOrdes})
})



export {
  newOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getUserOrderByEmailByAdmin,
  getMyOrders,
  getOrderByStatus,
  confrimOrder,
  getSellerOrder

};



// const makePayment = TryCatch(async (req, res, next) => {
//   const { amount } = req.body;
//   if (!amount) return next(new ErrorHandler("please provide amount"));
  
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Number(amount)*100,
//     currency: 'inr',
//   });

//   return res.status(201).json({
//     success: true,
//     message: "Payment intent created successfully",
//     clientSecret: paymentIntent.client_secret,
//   })
// });