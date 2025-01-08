
import { MenuItems } from "@/components/MenuItems";

import {
  BadgePercent,
  ChartNoAxesColumnDecreasing,
  LayoutList,
  User,
} from "lucide-react";
import { useState } from "react";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AllProducts from "@/components/admin/AllProducts";
import AllOrders from "@/components/admin/AllOrders";
import AdminStats from "@/components/admin/AdminStats";
import AllUsers from "@/components/admin/AllUsers";

const Admin_Home = () => {
  const [activeSubMenu, setActiveSubMenu] = useState("stats");
  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu);
  };
  return (
    <div className="flex min-h-screen bg-gray-100 gap-5 p-4 overflow-x-auto">
      <aside className="w-1/4 bg-white shadow-md p-4 rounded-lg">
        <nav className="mt-4 border-b">
          <MenuItems
            icon={LayoutList}
            text="All Products"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("allproducts")}
          />
          <MenuItems
            icon={BadgePercent}
            text="Coupons"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("coupons")}
          />
          <MenuItems
            icon={ChartNoAxesColumnDecreasing}
            text="Statistics"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("stats")}
          />

          <MenuItems
            icon={User}
            text="All Users"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("users")}
          />
          <MenuItems
            icon={LayoutList}
            text="All Orders"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("orders")}
          />
        </nav>
      </aside>
      <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 w-full ">
        {activeSubMenu === "allproducts" && <AllProducts />}
        {activeSubMenu === "orders" && <AllOrders />}
        {activeSubMenu === "coupons" && <AdminCoupons />}
        {activeSubMenu === "stats" && <AdminStats />}
        {activeSubMenu === "users" && <AllUsers />}
      </div>
    </div>
  );
};

export default Admin_Home;
