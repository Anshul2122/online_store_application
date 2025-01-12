import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

export const stripe = new Stripe(process.env.STRIPE_API_KEY);

app.use((req, res, next) => {
  console.log(
    "----------------------------------------------------------------------------------"
  );
  console.log(`Route being hit: ${req.method} ${req.path}`);
  console.log("Req Body", req.body);
  console.log("Req Params", req.params);
  console.log("Req Query", req.query);
  console.log(
    "----------------------------------------------------------------------------------"
  );
  next();
});

// routes import
import UserRoute from "./routes/user.routes.js"
import SellerRoute from "./routes/seller.routes.js"
import AdminRoute from "./routes/admin.routes.js"
import OrderRoute from "./routes/order.routes.js"
import ProductsRoute from "./routes/product.routes.js"

// routes declaration

app.use('/api/v1/users', UserRoute);
app.use("/api/v1/seller", SellerRoute);
app.use('/api/v1/admin', AdminRoute);
app.use("/api/v1/order", OrderRoute);
app.use('/api/v1/product', ProductsRoute);

app.use(errorHandler)

export { app };
