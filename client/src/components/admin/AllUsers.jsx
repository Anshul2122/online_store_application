
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { setLoading } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ADMIN_API, api_key } from "@/utils/api-routes/contant";
import axios from "axios";


const AllUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(store => store.auth);
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${ADMIN_API}/getAllUsers`, { withCredentials: true });
      if (res.data.success) {
        setAllUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to fetch all users");
    } finally { 
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4 bg-white shadow-md rounded-lg">
      {isLoading ? (
        <div>
          <Loader2 />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
          <div className="grid gap-6">
            {allUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-md shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                {/* User Avatar and Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      user.avatar ||
                      `https://as1.ftcdn.net/jpg/09/64/89/18/1000_F_964891898_SuTIP6H2AVZkBuUG2cIpP9nvdixORKpM.jpg`
                    }
                    alt={`${user.firstName}'s avatar`}
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                  <div>
                    <h3 className="text-lg font-medium">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      Phone: {user.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-800">City:</span>{" "}
                    {user.address?.city}
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
                    <h4 className="font-medium text-gray-800">
                      Products Added:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {user.products.map((product, index) => (
                        <li key={index}>
                          <Link to={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium text-gray-800">
                        Orders Received:
                      </span>{" "}
                      {user.soldOrders}
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
      )}
    </div>
  );
};

export default AllUsers;
