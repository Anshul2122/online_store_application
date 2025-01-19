import { Button } from "@/components/ui/button";
import { setLoading } from "@/redux/slices/authSlice";
import { ADMIN_API, api_key } from "@/utils/api-routes/contant";
import axios from "axios";
import { Axis3D, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateCoupon = () => {
  let [code, setCode] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [discount, setDiscount] = useState(1);
  const { isLoading } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true))

    try {
      code = code.toUpperCase();
      const formattedValidFrom = new Date(startDate).toISOString();
      const formattedValidTill = new Date(endDate).toISOString();
      const payload = {
        code,
        startDate: formattedValidFrom,
        endDate: formattedValidTill,
        discount,
      }
      const res = await axios.post(`${api_key}/${ADMIN_API}/create-coupon`,payload, { withCredentials: true });
      if (res.data.success) {
        console.log(res.data);
        
        toast.success("Coupon created successfully")
        navigate(`/admin-home`);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Failed to create coupon. Please try again.");
    } finally {
       dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-96 h-fit border-2 mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="Code"
            className="block text-sm font-medium text-gray-700"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter coupon code"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Valid from
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Valid Till
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Percentage (%)
          </label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter discount percentage"
            min="0"
            required
          />
          {isLoading ? (
            <div>
              <Loader2 />
            </div>
          ) : (
            <Button
              type="submit"
              className={`w-full mt-4  text-white font-medium rounded-md `}
            >
              Create
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCoupon;
