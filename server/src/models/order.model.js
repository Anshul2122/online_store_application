import mongoose from "mongoose";



const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  }
});


const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
      },
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
      default: function () {
        return this.totalPrice * 0.05;
      },
    },
    discount: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryCharges: {
      type: Number,
      required: true,
    },
    couponUsed: {
      code: String,
      discountPercentage: Number,
    },
    percentDiscount: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Order Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
