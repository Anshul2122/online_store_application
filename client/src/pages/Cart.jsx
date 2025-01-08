// components/MyCartPage.js
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Trash } from "lucide-react";
import React, { useState } from "react";

const MyCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 100,
      imageUrl: "https://via.placeholder.com/200",
      quantity: 1,
    },
    {
      id: 2,
      name: "Product 2",
      price: 150,
      imageUrl: "https://via.placeholder.com/200",
      quantity: 2,
    },
  ]);

  // Update quantity or remove item if quantity is 0
  const updateQuantity = (id, quantity) => {
    setCartItems((prevItems) =>
      quantity > 0
        ? prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        : prevItems.filter((item) => item.id !== id)
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Move item to wishlist
  const moveToWishlist = (id) => {
    toast.message('item moved to wishlist')
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Cart</h2>
      {cartItems.length === 0 ? (
        // Center the text when the cart is empty
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center text-lg">
            Your cart is empty!
          </p>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 mb-4 shadow-md rounded-lg"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-grow pl-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className=" p-2 rounded-md"
                  >
                    <Minus />
                  </Button>
                  <span className="text-xl">{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className=" p-2 rounded-md"
                  >
                    <Plus />
                  </Button>
                </div>
                <div className="flex space-x-2 gap-4">
                  <Button
                    onClick={() => moveToWishlist(item.id)}
                    className=" text-red-400 bg-white p-2 rounded-md border-2 hover:bg-red-300 hover:text-white"
                  >
                    <Heart />
                  </Button>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    className="hover:bg-red-500 hover:text-white text-red-500 bg-white p-2 rounded-md"
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-6">
            <h3 className="text-2xl font-semibold">
              Total Price: ${totalPrice}
            </h3>
            <Button className="bg-gray-800 text-white py-2 px-6 rounded-md">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;
