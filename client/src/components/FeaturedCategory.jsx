import { setSingleProductOfEachCategory } from "@/redux/slices/productSlice";
import { api_key, PRODUCT_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const FeaturedCategory = () => {
  const dispatch = useDispatch();
  const {singleProductOfeachCategory} = useSelector(store=>store.products);
  const navigate = useNavigate();
  const fetchCategoriesProducts = async() => {
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/single-category-product`);
      if (res.data.success) {
        dispatch(setSingleProductOfEachCategory(res.data.products));
      }
    } catch (err) { 
      console.error(err);
      toast.error(err.res.data.message ||"Failed to fetch categories.");
    }
  }
  useEffect(() => {
    fetchCategoriesProducts();
  }, []);
  const flattenedProducts = singleProductOfeachCategory.flat();

  return (
    <div className="w-full">
      <section className="p-6 bg-gray-50">
        <h2 className="text-center text-3xl font-bold">Featured Categories</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {flattenedProducts.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-lg overflow-hidden shadow-lg"
              onClick={() => navigate(`/products/categories/${product.category}`)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-60 object-cover transform group-hover:scale-105 transition-all"
              />
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white bg-black bg-opacity-50 rounded px-2 py-1">
                {product.category}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FeaturedCategory