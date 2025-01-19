import { useState, useEffect } from "react";
import { api_key, PRODUCT_API, USER_API } from "../utils/api-routes/contant";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import Wishlist from "./WishList";
import { useDispatch, useSelector } from "react-redux";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";

const MyWishList = ({ user, isLoading }) => {
  const {items } = useSelector(store=>store.wishlist);
  const dispatch = useDispatch();
  const fetchMyWishList = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${USER_API}/my-wishlist`, {withCredentials: true});
      if(res.data.success){
        dispatch(setWishlistItems(res.data.wishlistProducts));
      }
    } catch (error) {
      console.log(error);
    } finally{
      dispatch(setLoading(false));
    }
  };
  
  const removeItemfromWishlist = async (id) => { 
    try {
      const res = await axios.post(`${api_key}/${USER_API}/remove-from-wishlist/${id}`,  { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Item removed from wishlist.");
      } 
    } catch (error) {
      console.log("error:", error);
      toast.error("Failed to remove item from wishlist.");
    }
  }

  useEffect(() => {
    fetchMyWishList();
  }, []);


  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 border-b-slate-500">
        My WishList ({`${user?.wishlist?.length || 0}`})
      </h2>

      <div>
        {isLoading ? (
          <p>Loading wishlist...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <Wishlist
              id={item._id}
              name={item.name}
              sellingPrice={item.sellingPrice}
              price={item.originalPrice}
              img={item.images[0]}
              handleRemove={() => removeItemfromWishlist(item._id)}
            />
          ))
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default MyWishList;
