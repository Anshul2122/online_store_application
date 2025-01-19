import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import { api_key, PRODUCT_API, SELLER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProductInfo = () => {
  const { user, isLoading } = useSelector((store) => store.auth);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    stock: 1,
    sellingPrice: 1000,
    originalPrice: 1000,
    colors: [],
    sizes: [],
    storeName: user.storeName || "",
  });

  const [images, setImages] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Fetch product details by ID
  const fetchProductById = async () => {
    try {
      const res = await axios.get(`${api_key}/${PRODUCT_API}/product/${id}`);
      if (res.data.success) {
        const product = res.data.product;
       
        setFormData({
          name: product.name || "",
          description: product.description || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock || 1,
          sellingPrice: product.sellingPrice || 1000,
          originalPrice: product.originalPrice || 1000,
          colors: product.colors || [],
          sizes: product.sizes || [],
          storeName: user.storeName || "",
        });
      }
    } catch (error) {
      console.log("Error fetching product:", error);
      toast.error(error.response?.data?.message || "Failed to fetch product.");
    }
  };

  useEffect(() => {
    fetchProductById();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image changes
  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  // Add color
  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput();
    }
  };

  // Add size
  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput();
    }
  };

  // Submit form
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value)); // Stringify arrays
      } else {
        formDataToSend.append(key, value);
      }
    });

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${api_key}/${SELLER_API}/product/${id}`,
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(setCurrProduct(res.data.product));
        toast.success("Product updated successfully!");
        // navigate(`/product/${id}`); // Optionally navigate to product page
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Update Product Info</h2>

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
                name="sellingPrice"
                value={formData.sellingPrice}
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
            <Label>
              Product Images (Max 5){" "}
              <span className="text-red-500">
                product old images will be removed! if you upload new images
              </span>
            </Label>
            <Input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
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
              Updating Product...
            </>
          ) : (
            "Update Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default UpdateProductInfo;
