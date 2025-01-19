import { Button } from "@/components/ui/button";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import { setCartItems } from "@/redux/slices/cartSlice";
import { api_key, USER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Heart, Loader2, Minus, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const MyCart = () => {
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((store) => store.auth);
  const {items} = useSelector(store => store.cart);
  const navigate = useNavigate();

  const fetchCartProducts = async () => {

    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${USER_API}/my-cart`, {withCredentials:true});

      if(res.data.success){
        dispatch(setCartItems(res.data.cartProducts));
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      dispatch(setLoading(false));
    }
  }

  const handleCheckout = async() => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    navigate('/checkout')
  }

  const handleRemoveFromCart = async (id) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${api_key}/${USER_API}/remove-from-cart/${id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        await fetchCartProducts();

        if (res.data.removed) {
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    } finally{
      dispatch(setLoading(false));
    }
  };

  const handleAddToCart = async (id) => {
    try {
      const res = await axios.post(
        `${api_key}/${USER_API}/add-to-cart/${id}`,
        {},
        { withCredentials: true }
      );

      console.log(res.data);
      const exists = res.data.exists;

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        await fetchCartProducts();
        if (!exists) {
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveproductFromCart = async (id) => {
    try {
      const res = await axios.post(
        `${api_key}/${USER_API}/remove-product-from-cart/${id}`,
        {},
        { withCredentials: true }
      );

      console.log(res.data);
      const exists = res.data.exists;

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        await fetchCartProducts();
        if (!exists) {
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const moveToWishlist = async (id) => { 
    dispatch(setLoading(true));
      try {
        const res = await axios.post(
          `${api_key}/${USER_API}/movetwlfcart/${id}`,
          {},
          { withCredentials: true }
        );
      console.log("res: ",res.data.user);
      
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        await fetchCartProducts();
        toast.success(res.data.message);
      }
      console.log(user)
      if (res.data.sucess === false) {
        toast.error("res.data.message");
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
      
    }
    finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    fetchCartProducts();
  }, []);


  const totalPrice = items.reduce(
    (total, item) => total + item.product.sellingPrice * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Cart</h2>
          {(!items || items.length === 0) ? (
            <div className="flex items-center justify-center h-64 border-2">
              <p className="text-gray-500 text-center text-lg">
                Your cart is empty!
              </p>
            </div>
          ) : (
            <div>
              {items.map((item, index) => (
                <div
                  key={item.product._id || index}
                  className="flex items-center justify-between bg-white p-4 mb-4 shadow-md rounded-lg"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow pl-4">
                    <h3 className="text-xl font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      ₹{item.product.sellingPrice}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleRemoveFromCart(item.product._id)}
                        className="p-2 rounded-md"
                      >
                        <Minus />
                      </Button>
                      <span className="text-xl">{item.quantity}</span>
                      <Button
                        onClick={() => handleAddToCart(item.product._id)}
                        className="p-2 rounded-md"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="flex space-x-2 gap-4">
                      <Button
                        onClick={() => moveToWishlist(item.product._id)}
                        className="text-red-400 bg-white p-2 rounded-md border-2 hover:bg-red-300 hover:text-white"
                      >
                        <Heart />
                      </Button>
                      <Button
                        onClick={() =>
                          handleRemoveproductFromCart(item.product._id)
                        }
                        className="hover:bg-red-500 hover:text-white text-red-500 bg-white p-2 rounded-md"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between mt-6">
                <h3 className="text-2xl font-semibold">
                  Total: ₹{totalPrice}
                </h3>
                <Button
                  className="bg-gray-800 text-white py-2 px-6 rounded-md"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCart;
