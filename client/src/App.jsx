import AuthLayout from "./components/auth/layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";

import SellerLayout from "./components/auth/sellerLayouy";
import UpdateProductInfo from "./pages/UpdateProductInfo";
import AllProducts from "./components/admin/AllProducts";
import ProductLayout from "./components/ProductLayout";



const Admin_Home = lazy(() => import("./pages/admin/admin-home"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const Profile = lazy(() => import("./pages/profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Home = lazy(() => import("./pages/Home"));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const Product = lazy(() => import("./pages/Product"));
const SellerRegister = lazy(() => import("./pages/auth/sellerRegister"));
const SellerHome = lazy(() => import("./pages/Seller-home"));
const CreateCoupon = lazy(() => import("./pages/admin/CreateCoupon"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import('./pages/CheckOut'));
const OrderCancel = lazy(() => import('./pages/orderCancel'));
const OrderSuccess = lazy(() => import("./pages/orderSuccess"));



function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Router>
        <Suspense>
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            <Route path="/auth" element={<SellerLayout />}>
              <Route path="seller-register" element={<SellerRegister />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route path="seller/products" element={<SellerHome />} />
              <Route path="admin/add-coupon" element={<CreateCoupon />} />
              <Route path="/" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="product/:id" element={<Product />} />
              <Route path="product/update/:id" element={<UpdateProductInfo />} />
              <Route path='checkout' element={<Checkout />} />
              <Route path="order/cancel/:id" element={<OrderCancel />} />
              <Route path='' element={<ProductLayout/>}>
              <Route path='all-products' element= {<AllProducts/>}/>
              <Route
                path="products/categories/:category"
                element={<ProductCategory />}
              />
            </Route>
              <Route path="order/success/:id" element={<OrderSuccess />} />
              
               {/* 
              success_url: `$${process.env.CORS_ORIGIN}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
              cancel_url: `$${process.env.CORS_ORIGIN}/order/cancel?order_id=${order._id}`, */}
              
              <Route path="admin-home" element={<Admin_Home />} />
            </Route>
            <Route path='/' element={<ProductLayout/>}>

            </Route>
          </Routes>
        </Suspense>
        <Toaster position="bottom-right" />
      </Router>
    </div>
  );
}

export default App;
