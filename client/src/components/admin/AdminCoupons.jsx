

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const coupons = [
  {
    title: "Flat 15% off on Skechers",
    description: "Flat 15% off on Skechers (Valid till: 11:59 PM, 07 Jan)",
    validTill: "7 Jan, 2025",
    link: "#",
  },
  {
    title: "Flat 13% off on Puma",
    description: "Flat 13% off on Puma (Valid till: 11:59 PM, 07 Jan)",
    validTill: "7 Jan, 2025",
    link: "#",
  },
  {
    title: "Extra 30% OFF",
    description: "Extra 30% OFF (Valid till: 11:59 PM, 31 Jan)",
    validTill: "31 Jan, 2025",
    link: "#",
  },
  {
    title: "Flat 12% off on Women Footwear",
    description:
      "Flat 12% off on Women Footwear (Valid till: 11:59 PM, 07 Jan)",
    validTill: "7 Jan, 2025",
    link: "#",
  },
];

const AdminCoupons = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="flex w-full">
        <h2 className="text-2xl font-bold mb-4 w-full"> Seller Coupon</h2>
        <Button
          className="flex items-end"
          onClick={() => navigate("/admin/add-coupon")}
        >
          Add Item
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
                {coupon.title}
              </h3>
              <p className="text-gray-600 text-sm">{coupon.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-gray-600 text-sm">
                Valid till {coupon.validTill}
              </p>
              <a
                href={coupon.link}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View T&C
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
