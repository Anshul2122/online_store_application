
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phoneNumber: "1234567890",
    address: "123 Main St, Springfield",
    gender: "Male",
    avatar: "https://via.placeholder.com/80",
    role: "Seller", // Role can be 'Seller' or 'Customer'
    productsAdded: [
      { id: 1, name: "Product A" },
      { id: 2, name: "Product B" },
    ], // Only for sellers
    ordersReceived: 15, // Only for sellers
    orderHistory: "/user/1/orders", // Link to user's order history
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phoneNumber: "9876543210",
    address: "456 Elm St, Shelbyville",
    gender: "Female",
    avatar: "https://via.placeholder.com/80",
    role: "Customer",
    orderHistory: "/user/2/orders",
  },
];

const AllUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
      <div className="grid gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border rounded-md shadow-sm bg-gray-50 hover:shadow-md transition"
          >
            {/* User Avatar and Info */}
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="w-20 h-20 object-cover rounded-full border"
              />
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">
                  Phone: {user.phoneNumber}
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-800">Address:</span>{" "}
                {user.address}
              </p>
              <p>
                <span className="font-medium text-gray-800">Gender:</span>{" "}
                {user.gender}
              </p>
              <p>
                <span className="font-medium text-gray-800">Role:</span>{" "}
                {user.role}
              </p>
            </div>

            {/* Conditional Rendering for Sellers */}
            {user.role === "Seller" && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800">Products Added:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {user.productsAdded.map((product, index) => (
                    <li key={index}>
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium text-gray-800">
                    Orders Received:
                  </span>{" "}
                  {user.ordersReceived}
                </p>
              </div>
            )}

            {/* Order History Link */}
            <Button
              onClick={() => navigate("/orders")}
              className="mt-4 px-4 py-2  text-white text-sm font-medium rounded-md transition"
            >
              View Order History
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
