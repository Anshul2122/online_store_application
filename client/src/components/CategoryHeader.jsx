import { api_key, PRODUCT_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryHeader = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/categories`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.res.data.message || "Failed to fetch categories.");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
      <div className="w-full px-10 flex justify-evenly py-2 border-b-2">
          {categories.map((category, i) => (
              <span key={i} className="font-bold text-sm cursor-pointer hover:underline" onClick={()=>navigate(`/products/categories/${category}`)}>{category}</span>
          ))}
    </div>
  )
}

export default CategoryHeader