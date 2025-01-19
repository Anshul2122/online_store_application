import { setLoading } from "@/redux/slices/authSlice";
import { api_key, ORDER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setAllOrders } from "@/redux/slices/orderSlice";

const ORDER_STATUSES = [
  "Order Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const AllOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState({
    orderId: "",
    status: "",
  });
  const [adfasf, setAdfasf] = useState([]);
  const { isLoading } = useSelector((store) => store.auth);
  const {allOrders} = useSelector(store=>store.orders)
  const dispatch = useDispatch();

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusToUpdate({ orderId, status: newStatus });
    setIsAlertOpen(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      const res = await axios.put(
        `${api_key}/${ORDER_API}/order/${statusToUpdate.orderId}`,
        { status: statusToUpdate.status },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAllOrders(res.data.orders));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    } finally {
      setIsAlertOpen(false);
    }
  };

  const fetchAllOrder = async () => {
    dispatch(setLoading(true));
    try {
      const url =
        selectedStatus !== "all"
          ? `${api_key}/${ORDER_API}/all/order-status?status=${selectedStatus}`
          : `${api_key}/${ORDER_API}/all-orders`;

      const res = await axios.get(url, {
        withCredentials: true,
      });
      if (res.data.success) {
        console.log(res.data)
        setAdfasf(res.data.orders);
        dispatch(setAllOrders(res.data.orders));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllOrder();
  }, [selectedStatus]);

  return (
    <div className="p-4">
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the order status to "
              {statusToUpdate.status}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Orders</h1>
            <div className="w-[200px]">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {adfasf.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <div className="grid gap-6">
              {adfasf.map((order, index) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 bg-white shadow-md"
                >
                  <div className="flex flex-wrap justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Order #{index + 1}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Current Status: {order.status}
                      </p>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Customer Details
                    </h3>
                    <p>Name: {order.customer.name}</p>
                    <p>Email: {order.customer.email}</p>
                    <p>Phone: {order.customer.phoneNumber}</p>
                    <p>
                      Address:{" "}
                      {`${order.customer.address.street}, ${order.customer.address.city}, ${order.customer.address.state} - ${order.customer.address.zip}`}
                    </p>
                  </div>

                  <div className="mb-4 border-y-2 py-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Products
                    </h3>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-wrap justify-between items-center border-b pb-2 mb-2"
                        >
                          <div className="flex gap-5">
                            <div>
                              <img
                                src={item.productId.images[0]}
                                alt=""
                                className="w-24 h-16 object-cover rounded"
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {item.productId.name}
                              </p>
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
                    <p>Subtotal: ₹{order.subtotal.toLocaleString()}</p>
                    <p>Tax: ₹{order.tax.toLocaleString()}</p>
                    <p>Discount: ₹{order.discount.toLocaleString()}</p>
                    <p>Delivery Charges: ₹{order.deliveryCharges}</p>
                    <p className="font-bold text-lg">
                      Total: ₹{order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
