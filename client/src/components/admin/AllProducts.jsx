import { setLoading } from "@/redux/slices/authSlice";
import { setAllProducts } from "@/redux/slices/productSlice";
import { api_key, PRODUCT_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => store.auth);
  const { allProducts } = useSelector((store) => store.products);

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing",
    "Home Appliances",
    "Books",
    "Accessories",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const percentOff = (product) => {
    return Math.floor(
      ((product.originalPrice - product.sellingPrice) / product.originalPrice) *
        100
    );
  };

  const fetchFilteredProducts = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/all`, {
        params: {
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          category: selectedCategory,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAllProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching filtered products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [priceRange, selectedCategory]);

  return (
    <div >
      <div>
        {/* Products */}
        <div className="lg:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <span>Loading...</span>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="flex justify-center items-center h-[60vh]">
              <span>No products found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allProducts.map((product, index) => (
                <div
                  key={index}
                  className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 p-4 cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-red-600 text-lg font-semibold">
                        ₹{product.sellingPrice}
                      </span>
                      <span className="text-gray-500 ml-2 line-through text-sm">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-green-500 ml-2 text-sm">
                        {percentOff(product)}% off
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
