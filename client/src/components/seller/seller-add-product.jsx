import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { api_key, SELLER_API } from "@/utils/api-routes/contant";
import toast from "react-hot-toast";
import { setUser } from "@/redux/slices/authSlice";

const SellerAddProduct = () => {
  const { user, isLoading } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      category: "",
      brand: "",
      stock: 0,
      sellingPrice: 1000,
      originalPrice: 1000,
      colors: [],
      sizes: [],
      storeName: user.storeName,
    });
    const [images, setImages] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");


    const handleImageChange = (e) => {
      const filesArray = Array.from(e.target.files); // Convert FileList to an array

      setFormData({ ...formData, images: filesArray }); // Save images in formData if needed
      setImages(filesArray); // Update images state as an array
    };

  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 const handleSubmit = async (e) => {
   e.preventDefault();

   const formDataToSend = new FormData();
   formDataToSend.append("name", formData.name);
   formDataToSend.append("description", formData.description);
   formDataToSend.append("category", formData.category);
   formDataToSend.append("brand", formData.brand);
   formDataToSend.append("stock", formData.stock);
   formDataToSend.append("sellingPrice", formData.sellingPrice);
   formDataToSend.append("originalPrice", formData.originalPrice);
   formDataToSend.append("storeName", formData.storeName);

   // Add colors and sizes
   formData.colors.forEach((color) => formDataToSend.append("colors[]", color));
   formData.sizes.forEach((size) => formDataToSend.append("sizes[]", size));

   // Add images
     for (let i = 0; i < images.length; i++) {
       console.log(images[i]);
       
     formDataToSend.append("images", images[i]);
     }
     
     

   try {
     const res = await axios.post(
       `${api_key}/${SELLER_API}/add-product`,
       formDataToSend,
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
         withCredentials: true,
       }
     );

       if (res.data.success) {
           console.log(res.data);
           dispatch(setUser(res.data.user));
       toast.success("Product added successfully!");
       navigate("/seller/products");
     }
   } catch (error) {
     console.error("Error adding product:", error);
     toast.error("Failed to add product.");
   }
 };


  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Add New Product</h2>

        <div className="space-y-4">
          <div>
            <Label>Product Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label>Selling Price</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div>
              <Label>Original Price</Label>
              <Input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <Label>Product Images (Max 5)</Label>
            <Input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              required
            />
            <div className="mt-2 flex gap-2">
              {images.map((image, index) => (
                <div key={index} className="w-20 h-20">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Colors</Label>
              <div className="flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Add color"
                />
                <Button type="button" onClick={handleAddColor}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label>Sizes</Label>
              <div className="flex gap-2">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Add size"
                />
                <Button type="button" onClick={handleAddSize}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.sizes.map((size, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-fit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SellerAddProduct;
