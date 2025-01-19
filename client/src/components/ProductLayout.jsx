import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import AllProducts from './admin/AllProducts';

const ProductLayout = () => {
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
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/6 bg-white p-6 shadow rounded-lg ">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>

          {/* Price Range Slider */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Price Range
            </h4>
            <div>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm mt-2">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Categories
            </h4>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      onChange={() => setSelectedCategory(category)}
                      checked={selectedCategory === category}
                      className="form-radio text-black"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                </div>
              ))}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    onChange={() => setSelectedCategory("")}
                    checked={selectedCategory === ""}
                    className="form-radio text-black"
                  />
                  <span className="text-sm text-gray-700">All Categories</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <Outlet/>
      </div>
    </div>
  )
}

export default ProductLayout