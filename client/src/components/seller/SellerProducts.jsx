import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { api_key, PRODUCT_API, SELLER_API } from "@/utils/api-routes/contant";
import { setLoading } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { setProducts } from "@/redux/slices/productSlice";


const SellerProducts = () => {
  const { user, isLoading } = useSelector((store) => store.auth);
  const {products} = useSelector((store) => store.products)
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const percentOff = (sellingPrice, originalPrice) => {
   return Math.floor(((originalPrice - sellingPrice) / originalPrice) * 100);
  }

  const handleDeleteClick = (productId) => {
    
    setProductToDelete(productId); // Set the product to delete
    setShowConfirm(true); // Show confirmation popup
  };

  const confirmDelete = async () => {
    const id = productToDelete;
    dispatch(setLoading(false));
    try {
      const res = await axios.delete(`${api_key}/${SELLER_API}/product/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("product deleted");
        setProductToDelete(null)
        setShowConfirm(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product");
      setShowConfirm(false);
    }
    finally {
      dispatch(setLoading(false));
      setShowConfirm(false);
    }
    
  };

  const cancelDelete = () => {
    console.log("cancelling delete");
    
    setShowConfirm(false); 
    setProductToDelete(null);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/auth/login");
    return null;
  }
  // const [products, setProducts] = useState([]);

  const fetchMyProducts = async () => {
    console.log(user)
    try {
      const res = await axios.get(`${api_key}/${SELLER_API}/my-allProducts`, {
        withCredentials: true,
      });
      if (res.data.success) {
        console.log(products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    fetchMyProducts();
  }, [])
  return (
    <section className="p-6">
      <div className="flex w-full">
        <h2 className="text-2xl font-bold mb-4 w-full"> Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid:cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md p-6 cursor-pointer hover:shadow-2xl"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full object-cover h-64"
              onClick={() => navigate(`/product/${product._id}`)}
            />
            <div className="p-4">
              <h3 className="text-xl font-medium">{product.name}</h3>
              <div className="flex items-center mt-2">
                <span className="text-green-600 text-lg font-semibold">
                  ₹{product.sellingPrice}
                </span>
                <span className="text-gray-500 ml-4 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-500 ml-2 text-sm">
                  {percentOff(product.sellingPrice, product.originalPrice)}% off
                </span>
              </div>
              <span>stock left : {product.stock}</span>
            </div>
            <div className="flex items-center justify-between">
              <Button
                className="relative"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                Update product info?
              </Button>
              <Button
                className="ml-3 mt-1 flex"
                onClick={() => handleDeleteClick(product._id)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}

        {/* Add More Products Here */}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h3 className="text-lg font-medium mb-4">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  confirmDelete(product._id);
                }}
              >
                Yes, Delete
              </Button>
              <Button onClick={cancelDelete}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SellerProducts