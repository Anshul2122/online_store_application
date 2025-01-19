import AllNotifications from "@/components/AllNotifications";
import Coupons from "@/components/Coupon";
import ManageAddresses from "@/components/ManageAddresses";
import { MenuItems, SubMenuItems } from "@/components/MenuItems";
import MyOrders from "@/components/MyOrders";
import MyWishList from "@/components/MyWishList";
import ProfileInformation from "@/components/PersonalInformation";
import SellerOrder from "@/components/seller/SellerOrder";
import { Folder, Package, Power, Settings, User } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";


const Profile = () => {

  const { isLoading, user } = useSelector(store => store.auth);
    const expaned = true;
    const [activeSubMenu, setActiveSubMenu] = useState("profile");
    const handleSubMenuClick = (subMenu) => {
        setActiveSubMenu(subMenu);
    }


  return (
    <div className="flex min-h-screen bg-gray-100 gap-5 p-4 overflow-x-auto">
      <aside className="w-1/4 bg-white shadow-md p-4 rounded-lg">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-6 h-6  text-black" />
        </div>
        <nav className="mt-4 border-b">
          <MenuItems
            icon={Package}
            text="MY ORDERS"
            cursor="pointer hover:bg-gray-100"
            onClick={() => handleSubMenuClick("MyOrder")}
          />
          <MenuItems icon={Settings} text="ACCOUNT SETTING" />
          {expaned && (
            <>
              <SubMenuItems
                active={activeSubMenu === "profile"}
                text="Profile Information"
                onClick={() => handleSubMenuClick("profile")}
              />
              <SubMenuItems
                active={activeSubMenu === "profile"}
                text="Manage Adressess"
                onClick={() => handleSubMenuClick("addresses")}
              />
            </>
          )}
          <MenuItems text="MY STUFF" icon={Folder} />
          <>
            {user.role === 'seller' && <SubMenuItems
              active={activeSubMenu === "Sold Orders"}
              text="My Sold Orders"
              onClick={() => handleSubMenuClick("Sold Orders")}
            />}
            {user.role === 'admin' && <SubMenuItems
              active={activeSubMenu === "coupons"}
              text="My Coupon"
              onClick={() => handleSubMenuClick("coupons")}
            />}
            <SubMenuItems
              active={activeSubMenu === "wishlist"}
              text="My Wishlist"
              onClick={() => handleSubMenuClick("wishlist")}
            />
          </>
        </nav>
        <MenuItems
          icon={Power}
          text="Logout"
          cursor="pointer hover:bg-gray-100 font-extabold"
        />
      </aside>
      <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6 w-full ">
        {activeSubMenu === "MyOrder" && (
          <MyOrders heading={"My Orders"} user={user} loading={isLoading} />
        )}
        {activeSubMenu === "profile" && (
          <ProfileInformation user={user} loading={isLoading} />
        )}
        {activeSubMenu === "addresses" && (
          <ManageAddresses user={user} loading={isLoading} />
        )}
        {activeSubMenu === "wishlist" && (
          <MyWishList user={user} loading={isLoading} />
        )}
        {activeSubMenu === "Sold Orders" && (
          <SellerOrder user={user} loading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Profile;
