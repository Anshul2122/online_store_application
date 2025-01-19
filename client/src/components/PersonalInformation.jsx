import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { api_key, USER_API } from "./../utils/api-routes/contant";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import { Loader2 } from "lucide-react";



export default function ProfileInformation({ user, isLoading }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    gender: user.gender || "",
    email: user.email || "",
    mobile: user.phoneNumber || "",
  });
  const [editDetails, setEditDetails] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.put(`${api_key}/${USER_API}/me`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

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
    setEditDetails(false);
  };

  useEffect(() => {
    if (user) {
      // console.log(user);
      navigate("/profile");
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <button
          className="hover:font-bold"
          disabled={editDetails}
          onClick={() => setEditDetails(!editDetails)}
        >
          Edit
        </button>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            className="w-full p-2 border rounded-md"
            value={formData.firstName}
            disabled={!editDetails}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <Input
            type="text"
            placeholder="Last Name"
            className="w-full p-2 border rounded-md"
            value={formData.lastName}
            disabled={!editDetails}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div>
          <p className="mb-2">Your Gender</p>
          <div className="flex space-x-4">
            <Label className="flex items-center">
              <Input
                type="radio"
                name="gender"
                value="Male"
                className="mr-2"
                disabled={!editDetails}
                checked={formData.gender === "Male"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              Male
            </Label>
            <Label className="flex items-center">
              <Input
                type="radio"
                name="gender"
                value="Female"
                className="mr-2"
                disabled={!editDetails}
                checked={formData.gender === "Female"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              Female
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-600">Email Address</Label>
            </div>
            <Input
              type="email"
              className="w-full p-2 bg-gray-50 border rounded-md"
              value={formData.email}
              disabled={!editDetails}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-gray-600">Mobile Number</Label>
            </div>
            <Input
              type="tel"
              className="w-full p-2 bg-gray-50 border rounded-md"
              value={formData.mobile}
              disabled={!editDetails}
            />
          </div>
        </div>
        {editDetails && (
          <>
            {isLoading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                loading...
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800"
                onClick={handleSubmit}
              >
                save
              </Button>
            )}
          </>
        )}
      </form>
    </>
  );
}
