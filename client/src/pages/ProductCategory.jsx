import { useNavigate, useParams } from "react-router-dom";

const latestProducts = [
  {
    _id: "1",
    category: "electronics",
    name: "Wireless Headphones",
    price: 99.99,
    percentOff: 79,
    originalPrice: "399.99",
    image:
      "https://images.pexels.com/photos/8038334/pexels-photo-8038334.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "2",
    category: "electronics",
    name: "Smartwatch",
    price: 149.99,
    percentOff: 79,
    originalPrice: "399.99",
    image:
      "https://images.pexels.com/photos/1334602/pexels-photo-1334602.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "3",
    category: "electronics",
    name: "Gaming Laptop",
    price: 1299.99,
    percentOff: 79,
    originalPrice: "3999.99",
    image:
      "https://images.pexels.com/photos/19012051/pexels-photo-19012051/free-photo-of-modern-gaming-laptop-and-headphones-on-a-desk.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "4",
    category: "fashion",
    name: "T-shirt",
    price: 49.99,
    percentOff: 79,
    originalPrice: "99.99",
    image:
      "https://images.pexels.com/photos/220139/pexels-photo-220139.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    _id: "5",
    category: "electronics",
    name: "Bluetooth Speaker",
    percentOff: 79,
    price: 59.99,
    originalPrice: "199.99",
    image:
      "https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
const ProductCategory = () => {
    const navigate = useNavigate();
    const { category } = useParams();

    const filteredProducts = latestProducts.filter(
        (product)=> product.category === category
    )

    if (filteredProducts == "") { 
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
        <h2 className="text-2xl font-bold mb-4">Latest Product</h2>
        <div className="grid grid-cols-1 sm:grid:cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
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
                  <span className="text-green-600 text-lg font-semibold">
                    ₹{product.price}
                  </span>
                  <span className="text-gray-500 ml-4 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-red-500 ml-2 text-sm">
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

export default ProductCategory