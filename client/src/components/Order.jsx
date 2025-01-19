import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Order = ({order }) => {

  let index = 0;
  const naviagte = useNavigate();
  const {isLoading} = useSelector(store=>store.auth);
    return (
      <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div>
            <div className="grid gap-6">
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
                                src={item.image}
                                alt=""
                                className="w-24 h-16 object-cover rounded"
                              />
                            </div>
                            <div>
                              <p className="font-medium hover:font-bold hover:underline" onClick={()=>naviagte(`/product/${id}`)}>
                                {item.name}
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
            </div>
        </div>
      )}
    </div>
    );
}

export default Order