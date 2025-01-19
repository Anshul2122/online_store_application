import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_key, USER_API } from "@/utils/api-routes/contant";
import { Loader2 } from "lucide-react";

const ManageAddresses = ({user, isLoading}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    zip: user?.address?.zip || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    landmark: user?.address?.landmark || "",
    alternatePhone: user?.address?.alternatePhone || "",
    locality: user?.address?.locality || "",
  });

  console.log("formData", formData);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        address: {
          zip: formData.zip,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          locality: formData.locality,
          landmark: formData.landmark,
          alternatePhone: formData.alternatePhone,
        },
      };
      console.log(payload);
      
      dispatch(setLoading(true));
      const res = await axios.put(`${api_key}/${USER_API}/me`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log(res.data);
      
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(res.data.user));
        navigate("/profile");
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      // console.log(user);
      navigate("/profile");
    }
  }, [user]);
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-lb mx-auto rounded-md shadow-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              first Name
            </Label>
            <Input
              type="text"
              name="firstName"
              value={user.firstName}
              disabled={true}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              type="text"
              name="mobile"
              value={user.phoneNumber}
              disabled={true}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your mobile number"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              disabled={true}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Pincode
            </Label>
            <Input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pincode"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Street
            </Label>
            <Input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter locality"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Locality
            </Label>
            <Input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter locality"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              City/District/Town
            </Label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter city"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              State
            </Label>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Landmark (optional)
            </Label>
            <Input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter landmark"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Alternate Phone (optional)
            </Label>
            <Input
              type="text"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter alternate phone"
            />
          </div>
        </div>
        {isLoading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin mt-4" />
            loading...
          </Button>
        ) : (
          <Button type="submit" className="mt-4">
            save
          </Button>
        )}
      </form>
    </div>
  );
};

export default ManageAddresses;
