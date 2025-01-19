import { setLastestProduct } from "@/redux/slices/productSlice";
import { api_key, PRODUCT_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const LatestProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {lastesProducts} = useSelector(store=>store.products);
  const percentOff = (product) => {
    return Math.floor((product.originalPrice - product.sellingPrice) / product.originalPrice * 100);
  }
  const fetchProduct = async () => {
    const res = await axios.get(`${api_key}/${PRODUCT_API}/latest`);
    if (res.data.success) {
     
      dispatch(setLastestProduct(res.data.products));
      
    }
  }

  useEffect(() => { fetchProduct() }, []);
    

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Product</h2>
      <div className="grid grid-cols-1 sm:grid:cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lastesProducts.map((product, index) => (
          <div
            key={index}
            className="relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md p-6 cursor-pointer hover:shadow-2xl"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full object-cover h-64"
            />
            <div className="p-4">
              <h3 className="text-xl font-medium">{product.name}</h3>
              <div className="flex items-center mt-2">
                <span className="text-green-600 text-lg font-semibold">
                  ₹ {product.sellingPrice}
                </span>
                <span className="text-gray-500 ml-4 line-through">
                  ₹ {product.originalPrice}
                </span>
              
                <div>
                  <span className="text-green-500 ml-2 text-sm">
                    {percentOff(product)}% off
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LatestProduct