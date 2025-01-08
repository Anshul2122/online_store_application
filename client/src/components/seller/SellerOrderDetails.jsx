
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Order = {
  id: "1",
  img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljnakjfnakjf",
  price: 7117,
  status: "Shipped",
};

const SellerOrderDetails = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Order Confirmed");
  const [isSaving, setIsSaving] = useState(false); // To manage save button state

  // Define the order steps
  const orderSteps = [
    "Order Confirmed",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  useEffect(() => {
    setStatus(Order.status);
  }, [Order.status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate an API call to save the updated status
      // Replace this with your actual API call logic
      console.log(`Saving status "${status}" for Order ID: ${Order.id}`);
      // await axios.put(`/api/orders/${Order.id}`, { status });

      // Simulate a delay for API call
      setTimeout(() => {
        console.log("Status saved successfully!");
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving order status:", error);
      setIsSaving(false);
    }
  };

  const currentStepIndex = orderSteps.indexOf(status);

  return (
    <div className="p-4 border rounded-md shadow-lg bg-white mt-4">
      {/* Product Details */}
      <div className="flex items-center gap-4">
        <img
          src={Order.img}
          className="w-20 h-20 object-cover cursor-pointer"
          onClick={() => navigate(`/product/${Order.id}`)}
          alt="Product"
        />
        <div>
          <h3
            className="font-medium cursor-pointer hover:text-gray-800 hover:underline"
            onClick={() => navigate(`/product/${Order.id}`)}
          >
            {Order.desc}
          </h3>
          <p>Seller: QUALITYWALE</p>
          <p className="font-bold text-lg">₹ {Order.price}</p>
        </div>
      </div>

      {/* Order Progress */}
      <div className="mt-4">
        <h4 className="text-sm text-gray-600">Order Progress</h4>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          {orderSteps.map((step, index) => (
            <span
              key={index}
              className={`${
                index <= currentStepIndex ? "text-black font-bold" : ""
              }`}
            >
              {step}
            </span>
          ))}
        </div>
        <div className="flex items-center mt-2">
          {orderSteps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Circle for each step */}
              <div
                className={`w-4 h-4 ${
                  index <= currentStepIndex
                    ? "bg-gray-800"
                    : "bg-gray-300 border-2 border-gray-300"
                } rounded-full`}
              ></div>
              {index < orderSteps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    index < currentStepIndex ? "bg-gray-800" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm mt-2 text-gray-600">
          {status === "Delivered"
            ? "Your item has been delivered"
            : `Your item is currently ${status.toLowerCase()}`}
        </p>
      </div>

      {/* Seller Action: Change Order Status */}
      <div className="mt-4">
        <h4 className="text-sm text-gray-600">Change Order Status</h4>
        <select
          value={status}
          onChange={handleStatusChange}
          className="mt-2 p-2 border rounded-md w-full"
        >
          {orderSteps.map((step, index) => (
            <option key={index} value={step}>
              {step}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-2">
          Select the current order status to update the progress.
        </p>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className={`mt-4 p-2 w-full rounded-md text-white ${
            isSaving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-700"
          }`}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default SellerOrderDetails;
