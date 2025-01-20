
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { api_key, ORDER_API } from "@/utils/api-routes/contant";
// import { setCurrOrder, setOrders } from "@/redux/slices/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";


// const SellerOrderDetails = ({ order }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector(store => store.auth);
//   const id = order._id;
//   const navigate = useNavigate();
//   const [status, setStatus] = useState(order.status);
//   const [isSaving, setIsSaving] = useState(false); // To manage save button state

//   // Define the order steps
//   const orderSteps = [
//     "Order Confirmed",
//     "Shipped",
//     "Out for delivery",
//     "Delivered",
//   ];

//   useEffect(() => {
//     setStatus(order.status);
//   }, [order.status]);

//   const handleStatusChange = (e) => {
//     setStatus(e.target.value);
//   };

//   const handleSave = async () => {
//     console.log("hehe", status);
//     try {
//       const res = await axios.put(
//         `${api_key}/${ORDER_API}/order/${id}`,
//         status,
//         {
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         console.log(res.data);
//         dispatch(setCurrOrder(res.data.orders));
//         toast.success("order status updated");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to update order status");
//     }
//   };
  

//   const currentStepIndex = orderSteps.indexOf(status);

//   return (
//     <div className="p-4 border rounded-md shadow-lg bg-white mt-4">

//       {/* Order Progress */}
//       <div className="mt-4">
//         <h4 className="text-sm text-gray-600">Order Progress</h4>
//         <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
//           {orderSteps.map((step, index) => (
//             <span
//               key={index}
//               className={`${
//                 index <= currentStepIndex ? "text-black font-bold" : ""
//               }`}
//             >
//               {step}
//             </span>
//           ))}
//         </div>
//         <div className="flex items-center mt-2">
//           {orderSteps.map((step, index) => (
//             <React.Fragment key={index}>
//               {/* Circle for each step */}
//               <div
//                 className={`w-4 h-4 ${
//                   index <= currentStepIndex
//                     ? "bg-gray-800"
//                     : "bg-gray-300 border-2 border-gray-300"
//                 } rounded-full`}
//               ></div>
//               {index < orderSteps.length - 1 && (
//                 <div
//                   className={`flex-1 h-1 ${
//                     index < currentStepIndex ? "bg-gray-800" : "bg-gray-300"
//                   }`}
//                 ></div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//         <p className="text-sm mt-2 text-gray-600">
//           {status === "Delivered"
//             ? "Your item has been delivered"
//             : `Your item is currently ${status.toLowerCase()}`}
//         </p>
//       </div>

//       {/* Seller Action: Change Order Status */}
//       <div className="mt-4">
//         <h4 className="text-sm text-gray-600">Change Order Status</h4>
//         <select
//           value={status}
//           onChange={handleStatusChange}
//           className="mt-2 p-2 border rounded-md w-full"
//         >
//           {orderSteps.map((step, index) => (
//             <option key={index} value={step}>
//               {step}
//             </option>
//           ))}
//         </select>
//         <p className="text-sm text-gray-500 mt-2">
//           Select the current order status to update the progress.
//         </p>

//         {/* Save Button */}
//         <Button
//           onClick={handleSave}
//           className={`mt-4 p-2 w-full rounded-md text-white ${
//             isSaving
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-black hover:bg-gray-700"
//           }`}
//           disabled={isSaving}
//         >
//           {isSaving ? "Saving..." : "Update"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SellerOrderDetails;
