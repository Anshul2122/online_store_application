import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Order = {
  id: "1",
  img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljnakjfnakjf",
  price: 7117,
  status: "Shipped",
};

const OrderDetail = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(Order.status);

  useEffect(() => {
    setStatus(Order.status);
  }, [Order.status]);

  // Define the order steps
  const orderSteps = [
    "Order Confirmed",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];
  const currentStepIndex = orderSteps.indexOf(status);

  return (
    <div className="p-4 border rounded-md shadow-lg bg-white mt-4">
      <div className="flex items-center gap-4">
        <img
          src={Order.img}
          className="w-20 h-20 object-cover cursor-pointer"
          onClick={() => navigate(`/product/${Order.id}`)}
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
    </div>
  );
};

export default OrderDetail;
