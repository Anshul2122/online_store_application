import DeliveryAddress from "@/components/DeliveryAddress"
import OrderDetail from "@/components/OrderDetail"
import SellerOrderDetails from "@/components/seller/SellerOrderDetails";
import { Button } from "@/components/ui/button";
import { setCurrOrder, setLoading } from "@/redux/slices/authSlice";
import { api_key, ORDER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


const user = {
  name: "John",
  email: "john@example.com",
  phoneNumber: "4546548463",
  address: "123 Main St, Anytown, USA",
  role: "seller",
};

// const handleStatusChange = async (id, newStatus) => {
//   console.log("hehe", newStatus);
//   try {
//     const res = await axios.put(
//       `${api_key}/${ORDER_API}/order/${id}`,
//       newStatus,
//       {
//         withCredentials: true,
//       }
//     );
//     if (res.data.success) {
//       setAllOrders(res.data.orders);
//       dispatch(setOrders(res.data.orders));
//       toast.success("order status updated");
//     }
//   } catch (error) {
//     console.log(error);
//     toast.error("Failed to update order status");
//   }
// };

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoading, user, currOrder } = useSelector(store => store.auth);
  


  const fetchOrderById = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${ORDER_API}/order/${id}`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setCurrOrder(res.data.order));
        console.log(res.data);
        toast.success("order fetched");
      }
    } catch (error) {
      console.error(error);
      toast.error("failed to fetch order");
    } finally { 
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    fetchOrderById();
  },[])
  
  let index = 0;
  
  return (
    //   <div className="w-full mx-auto p-10 flex flex-col gap-10 bg-gray-100 min-h-screen">
    //       <DeliveryAddress />
    //   {user.role === "user" && <OrderDetail />}
    //   {user.role==='admin' && <SellerOrderDetails/>}
    // </div>
    <div className="p-4">
      {isLoading ? (
        <div>
          <Loader2 />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center">Your Order</h1>
          <div className="grid gap-6">
            <div
              key={currOrder._id}
              className="border rounded-lg p-4 bg-white shadow-md"
            >
              <div className="flex flex-wrap justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(currOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-medium text-green-500`}>
                    Status: {currOrder.status}
                  </p>
                  <div>
                    <Button
                      onClick={() => navigate(`/orders/${currOrder._id}`)}
                    >
                      Change order status
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Customer Details
                </h3>
                <p>Name: {currOrder.customer.name}</p>
                <p>Email: {currOrder.customer.email}</p>
                <p>Phone: {currOrder.customer.phoneNumber}</p>
                <p>
                  Address:{" "}
                  {`${currOrder.customer.address.street}, ${currOrder.customer.address.city}, ${currOrder.customer.address.state} - ${currOrder.customer.address.zip}`}
                </p>
              </div>

              <div className="mb-4 border-y-2">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Products
                </h3>
                <div className="space-y-2">
                  {currOrder.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-wrap justify-between items-center border-b pb-2 mb-2"
                    >
                      <div className="flex gap-5">
                        <div>
                          {/* <img
                                src={item.productId.images[0]}
                                alt=""
                                className="w-24 h-16"
                              /> */}
                        </div>
                        <div>
                          <p className="font-medium">{item.productId.name}</p>
                          <p className="text-sm text-gray-600">
                            Store: {item.storeName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  Order Summary
                </h3>
                <p>Subtotal: ₹{currOrder.subtotal.toLocaleString()}</p>
                <p>Tax: ₹{currOrder.tax.toLocaleString()}</p>
                <p>Discount: ₹{currOrder.discount.toLocaleString()}</p>
                <p>Delivery Charges: ₹{currOrder.deliveryCharges}</p>
                <p className="font-bold text-lg">
                  Total: ₹{currOrder.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          {user.role === "admin" && <SellerOrderDetails order={currOrder} />}
        </div>
      )}
    </div>
  );
}

export default OrderDetails