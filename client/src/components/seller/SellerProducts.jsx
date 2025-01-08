import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";


const allProducts = [
  {
    _id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    originalPrice: 199.99,
    percentOff: 79,
    image:
      "https://images.pexels.com/photos/8038334/pexels-photo-8038334.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "2",
    name: "Smartwatch",
    price: 149.99,
    percentOff: 79,
    originalPrice: 199.99,
    image:
      "https://images.pexels.com/photos/1334602/pexels-photo-1334602.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "3",
    name: "Gaming Laptop",
    price: 1299.99,
    percentOff: 79,
    originalPrice: 2999.99,
    image:
      "https://images.pexels.com/photos/19012051/pexels-photo-19012051/free-photo-of-modern-gaming-laptop-and-headphones-on-a-desk.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "4",
    name: "T-shirt",
    price: 49.99,
    percentOff: 79,
    originalPrice: 99.99,
    image:
      "https://images.pexels.com/photos/220139/pexels-photo-220139.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "5",
    name: "Bluetooth Speaker",
    price: 59.99,
    percentOff: 79,
    originalPrice: 99.99,
    image:
      "https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const SellerProducts = () => {
  const navigate = useNavigate();
  return (
    <section className="p-6">
      <div className="flex w-full">
        <h2 className="text-2xl font-bold mb-4 w-full"> Products</h2>
        <Button
          className="flex items-end"
          onClick={() => navigate("/product/add")}
        >
          Add Item
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid:cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product, index) => (
          <div
            key={index}
            className="relative bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md p-6 cursor-pointer hover:shadow-2xl"
            onClick={() => navigate(`/product/${index}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-cover h-64"
            />
            <div className="p-4">
              <h3 className="text-xl font-medium">{product.name}</h3>
              <div className="flex items-center mt-2">
                <span className="text-red-600 text-lg font-semibold">
                  ₹{product.price}
                </span>
                <span className="text-gray-500 ml-4 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-500 ml-2 text-sm">
                  {product.percentOff}% off
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Products Here */}
      </div>
    </section>
  );
}

export default SellerProducts