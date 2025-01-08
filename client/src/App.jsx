
import AuthLayout from './components/auth/layout';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CategoryHeader from './components/CategoryHeader';


const Admin_Home = lazy(() => import("./pages/admin/admin-home"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const Profile = lazy(() => import("./pages/profile"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Home = lazy(() => import("./pages/Home"));
const ProductCategory = lazy(() => import("./pages/ProductCategory"));
const Product = lazy(() => import('./pages/Product'));
const SellerRegister = lazy(() => import('./pages/auth/sellerRegister'));
const SellerHome = lazy(() => import("./pages/Seller-home"));   
const CreateCoupon = lazy(() => import("./pages/admin/CreateCoupon"));
const Cart = lazy(() => import("./pages/Cart"));


function App() {

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Router>
        <Header />
        <CategoryHeader />
        <Suspense>
          <Routes>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="seller-register" element={<SellerRegister />} />
            </Route>
            <Route path="/seller/products" element={<SellerHome />} />
            <Route path="/admin/add-coupon" element={<CreateCoupon/>} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/product/:id" element={<Product />} />
            <Route
              path="/products/categories/:category"
              element={<ProductCategory />}
            />
            <Route path='/admin-home' element={ <Admin_Home/>} />
          </Routes>
        </Suspense>
        <Footer />
        <Toaster position="bottom-right" />
      </Router>
    </div>
  );
}

export default App
