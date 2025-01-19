

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_API, api_key } from "@/utils/api-routes/contant";
import toast from "react-hot-toast";

// const coupons = [
//   {
//     title: "Flat 15% off on Skechers",
//     description: "Flat 15% off on Skechers (Valid till: 11:59 PM, 07 Jan)",
//     validTill: "7 Jan, 2025",
//     link: "#",
//   },
//   {
//     title: "Flat 13% off on Puma",
//     description: "Flat 13% off on Puma (Valid till: 11:59 PM, 07 Jan)",
//     validTill: "7 Jan, 2025",
//     link: "#",
//   },
//   {
//     title: "Extra 30% OFF",
//     description: "Extra 30% OFF (Valid till: 11:59 PM, 31 Jan)",
//     validTill: "31 Jan, 2025",
//     link: "#",
//   },
//   {
//     title: "Flat 12% off on Women Footwear",
//     description:
//       "Flat 12% off on Women Footwear (Valid till: 11:59 PM, 07 Jan)",
//     validTill: "7 Jan, 2025",
//     link: "#",
//   },
// ];

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(store => store.auth);
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${ADMIN_API}/getCoupons`, {
        withCredentials: true,
      });
      if (res.data.success) { 
        setCoupons(res.data.coupons);
      }
    } catch (error) {
      console.log(error);
      toast.error("error in fetching coupon");
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="p-6">
      {isLoading ? (
        <div>Loding...</div>
      ) : (
        <div>
          <div className="flex w-full">
            <h2 className="text-2xl font-bold mb-4 w-full">
              {" "}
              All Coupons ({coupons.length})
            </h2>
            <Button
              className="flex items-end"
              onClick={() => navigate("/admin/add-coupon")}
            >
              create new coupon
            </Button>
          </div>
          <div className="space-y-4">
            {coupons.map((coupon, index) => (
              <div
                key={index}
                className="flex items-start justify-between border border-gray-300 rounded-lg p-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    {coupon.code}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {coupon.status.toUpperCase()}
                  </p>
                  <span>Discount upto {coupon.discount} %</span>
                </div>
                <div className="flex flex-col items-end">
                  {coupons.status === "active" ? (
                    <p className="text-gray-600 text-sm">
                      Valid till: {coupon.endDate.substring(0, 10)}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Exipred : {coupon.endDate.substring(0, 10)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
