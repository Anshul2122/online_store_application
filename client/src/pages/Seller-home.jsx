import { MenuItems } from "@/components/MenuItems";
import MyOrders from "@/components/MyOrders";
import SellerCoupons from "@/components/admin/AdminCoupons";
import SellerOrder from "@/components/seller/SellerOrder";
import SellerProducts from "@/components/seller/SellerProducts";
import SellerStats from "@/components/seller/SellerStats";
import SellerAddProduct from "@/components/seller/seller-add-product";
import {
  ArchiveRestore,
  ChartNoAxesColumnDecreasing,
  LayoutList,
  Package,
  ScanBarcode,
} from "lucide-react";
import { useState } from "react";

const SellerHome = () => {
  // const navigate = useNavigate();
  const [activeSubMenu, setActiveSubMenu] = useState("stats");
  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu);
  };
  return (
    <div className="flex min-h-screen bg-gray-100 gap-5 p-4 overflow-x-auto">
      <aside className="w-1/6 bg-white shadow-md p-4 rounded-lg mt-10">
        <nav className="mt-2 border-b space-y-8">
          <MenuItems
            icon={Package}
            text="MY ORDERS"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("MyOrder")}
          />
          <MenuItems
            icon={ScanBarcode}
            text="My Products"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("MyProducts")}
          />
          <MenuItems
            icon={LayoutList}
            text="Orders"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("order")}
          />
          <MenuItems
            icon={ChartNoAxesColumnDecreasing}
            text="Statistics"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("stats")}
          />
          <MenuItems
            icon={ArchiveRestore}
            text="Add product"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("AddProducts")}
          />
        </nav>
      </aside>
      <div className="md:col-span-2 bg-gray-100 rounded-lg shadow-sm p-6 w-full ">
        {activeSubMenu === "MyOrder" && <MyOrders />}
        {activeSubMenu === "MyProducts" && <SellerProducts />}
        {activeSubMenu === "order" && <SellerOrder />}
        {activeSubMenu === "stats" && <SellerStats />}
        {activeSubMenu === "AddProducts" && <SellerAddProduct />}
      </div>
    </div>
  );
};

export default SellerHome;
