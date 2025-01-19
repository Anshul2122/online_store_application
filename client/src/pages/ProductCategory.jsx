import { setCategoryProducts } from "@/redux/slices/productSlice";
import store from "@/redux/store";
import { api_key, PRODUCT_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ProductCategory = () => {
    const navigate = useNavigate();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const {categoryProducts} = useSelector(store=>store.products);
  const dispatch = useDispatch();

  const percentOff = (product) => {
    return Math.floor(
      ((product.originalPrice - product.sellingPrice) / product.originalPrice) *
        100
    );
  };

  const handleProductClick = (product) => {
    console.log(product);
  }

  const fetchProducts = async (category) => {
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/category/${category}`);
      if (res.data.success) {
        dispatch(setCategoryProducts(res.data.products));
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.res.data.message || "failed to fetch products");
    }
  }

  useEffect(() => {
    fetchProducts(category);
  }, [category]);
    
  if (categoryProducts.length === 0) {
    return (
      <>
        <h1 className="p-5 mt-3 text-center h-[200px]">
          No products found in this category.
        </h1>
      </>
    );
  }
      
  
    return (
      <section className="p-6">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">
    Products in {category} category
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {categoryProducts.map((product, index) => (
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
          <h3 className="text-lg font-medium text-gray-800 truncate">
            {product.name}
          </h3>
          <div className="flex items-center mt-2">
            <span className="text-green-600 text-lg font-semibold">
              ₹{product.sellingPrice}
            </span>
            <span className="text-gray-500 ml-4 line-through text-sm">
              ₹{product.originalPrice}
            </span>
            <span className="text-red-500 ml-2 text-sm">
              {percentOff(product)}% off
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
    );
}

export default ProductCategory