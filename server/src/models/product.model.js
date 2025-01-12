import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message: "Selling price cannot be greater than original price",
      },
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 0,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    colors: [String],
    sizes: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
