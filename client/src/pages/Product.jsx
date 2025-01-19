
import ProductDetails from "@/components/ProductDetails";
import RatingsAndReviews from "@/components/RatingsAndReviews";
import { Button } from "@/components/ui/button";
import {setLoading, setUser } from "@/redux/slices/authSlice";
import { setCartItems } from "@/redux/slices/cartSlice";
import { setWishlistItems } from "@/redux/slices/wishlistSlice";
import { api_key, PRODUCT_API, USER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Edit, Heart, Loader2, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setProductDetails } from '@/redux/slices/productSlice';



const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user} = useSelector(store => store.auth);
  const {productDetails} = useSelector(store => store.products);
  const { id } = useParams();
  const [inWishList, setInWishList] = useState(false)
  const [selectedImage, setSelectedImage] = useState("");

  const handleRemoveFromCart = async () => {
    try {
      const res = await axios.post(`${api_key}/${USER_API}/remove-from-cart/${id}`,{},{ withCredentials: true });
      console.log(res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        if (res.data.removed) {
          toast.success(res.data.message)
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }
  }

  const handleAddToCart = async() => {
    try {
      const res = await axios.post(`${api_key}/${USER_API}/add-to-cart/${id}`, {}, { withCredentials: true })
      console.log(res.data);
      const exists = res.data.exists;
      
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        if (!exists) {
          toast.success(res.data.message);
        }
      }
    } catch (error) { 
      console.log("error:", error);
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }
  

  const removeItemfromWishlist = async (id) => { 
    setInWishList(false);
    try {
      const res = await axios.post(`${api_key}/${USER_API}/remove-from-wishlist/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Item removed from wishlist.");
      } 
    } catch (error) {
      console.log("error:", error);
      toast.error("Failed to remove item from wishlist.");
    }
  }

  const moveToWishlist = async () => { 

    setInWishList(true);
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${api_key}/${USER_API}/add-to-wishlist/${id}`, {}, { withCredentials: true })
      console.log("res: ",res.data.user);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
      console.log(user)
      if (res.data.sucess === false) {
        toast.error("res.data.message");
      }
    } catch (error) {
      console.log("error:", error);
      toast.error("yhe rha hu");
      
    } finally{
      dispatch(setLoading(false));
    }
  }
  
  
  const fetchProductById = async () => {
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/product/${id}`);
      if (res.data.success) {
        const product = res.data.product;
        dispatch(setProductDetails(product));
        if (product.images && product.images.length > 0) {
          setSelectedImage(product.images[0]);
        }
      }
    } catch (error) {
      console.log("error:", error);
      toast.error(error.message);
    }; 
  }

  

  useEffect(() => {
    fetchProductById();
  }, [id]);

  
  if (!productDetails) {
    return <div>No product availabel </div>
  }

  return (
    <div className="p-6 bg-gray-200 ">
      <div className="grid md:grid-cols-2 gap-6 bg-gray-700 rounded-lg p-5">
        {/* Left Section: Product Image */}
        <div className="flex justify-center flex-col w-">
          {/*vertical image section */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-4 w-fit">
              {productDetails.images.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setSelectedImage(image)}
                  className={`h-16 md:w-20 md:h-20 border border-gray-300 rounded-lg cursor-pointer ${
                    selectedImage === image
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="pl-24 ">
              <img
                src={selectedImage}
                alt="Product"
                className="border border-gray-300 rounded-lg h-full"
              />
            </div>
          </div>

          {/* Action Buttons */}

          <div className="flex gap-5 mt-10 justify-center">
            {isLoading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : (
              <div className="flex gap-5 mt-10 justify-center">
                {user.role === "seller" &&
                user.storeName === productDetails.storeName ? (
                  // If user is a seller and storeName matches, show the Update Product Info button
                  <Button
                    className="w-fit"
                    onClick={() => navigate(`/product/update/${productDetails._id}`)}
                      >
                        <Edit/>
                    Update Product Info
                  </Button>
                ) : (
                  <>
                    {user.cart.some(
                      (item) =>
                        item._id.toString() === productDetails._id.toString()
                    ) ? (
                      user.cart
                        .filter(
                          (item) =>
                            item._id.toString() === productDetails._id.toString()
                        )
                        .map((item) =>
                          item.quantity > 0 ? (
                            <div
                              key={item._id}
                              className="flex items-center gap-2"
                            >
                              <Button
                                className=""
                                onClick={() => handleRemoveFromCart(item._id)}
                              >
                                -
                              </Button>
                              <Button className="rounded-full bg-gray-700">
                                {item.quantity}
                              </Button>
                              <Button
                                className=""
                                onClick={() => handleAddToCart(item._id)}
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <Button
                              key={item._id}
                              className="bg-white text-black hover:text-white w-fit"
                              onClick={() => handleAddToCart(productDetails._id)}
                            >
                              <ShoppingCart />
                              Add to Cart
                            </Button>
                          )
                        )
                    ) : (
                      <Button
                        className="bg-white text-black hover:text-white w-fit"
                        onClick={() => handleAddToCart(productDetails._id)}
                      >
                        <ShoppingCart />
                        Add to Cart
                      </Button>
                    )}

                    {inWishList ? (
                      <Button className="w-fit" 
                      onClick={() => removeItemfromWishlist(productDetails._id)}>
                    <Trash />
                    Remove from Wishlist
                  </Button>
                    ) : (
                      <Button className="w-fit" 
                        onClick={() => moveToWishlist(productDetails._id)}>
                      <Heart />
                      Add to Wishlist Now
                    </Button>
                    )}
                    
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Right Section: Product Details */}
        <div>
          <ProductDetails product={productDetails} />
        </div>
      </div>
      <div className="rounded-lg mt-5 shadow-lg flex justify-end">
        <RatingsAndReviews product={productDetails} />
      </div>
    </div>
  );
};

export default Product;
