import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { LayoutDashboard, Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API } from "@/utils/api-routes/contant";
import toast from "react-hot-toast";
import { setUser } from "@/redux/slices/authSlice";

const api_key = import.meta.env.VITE_BACKEND_URL;

let itemInCart;

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const {items} = useSelector(store=>store.cart);
  if (!user) {
    navigate("/auth/login");
  }
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const handleInputChange = (e) => {
    setInput(e.target.value);
    console.log(input);
  };

  const handelLogout = async () => {
    dispatch(setUser(null));
        navigate("/auth/login");
    
    try {
      const res = await axios.post(`${api_key}/${USER_API}/logout`, {
      },{withCredentials: true,
      });
      if (res.data.success) {
        console.log("ye chal rha hai pata nhi kyyu??");
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <nav className="h-14 w-full border-b-2 flex items-center p-4 justify-between">
      <h1
        className="font-extrabold text-2xl cursor-pointer hover:underline"
        onClick={() => navigate("/")}
      >
        E-commerce
      </h1>
      <span className="w-[600px] h-10 flex items-center p-4 gap-1">
        <Input
          type="text"
          placeholder="searh items...."
          onChange={handleInputChange}
        />{" "}
        <FaSearch />
      </span>
      <div className="flex gap-5 items-center ">
        {user?.role === "customer" && (
          <Link
            to={"/auth/seller-register"}
            className="flex gap-2 items-center"
          >
            <Store />
            Become a Seller
          </Link>
        )}
        {user?.role === "seller" && (
          <Link to={"/seller/products"} className="flex gap-2 items-center">
            <Store />
            Your Store
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to={"/admin-home"} className="flex gap-2 items-center">
            <LayoutDashboard />
            dashboard
          </Link>
        )}
        {user?.role !== "admin" && (
          <Link to={"/cart"}>
            <Button>
              {" "}
              <FaShoppingBag />
            </Button>
            {items.length > 0 && (
              <span className="absolute top-[1px] right-[80px] bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  <FaUser />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="font-bold">
                  User
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link
                    to={"/profile"}
                    className="cursor-pointer hover:font-bold"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to={"/orders"}
                    className="cursor-pointer hover:font-bold"
                  >
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handelLogout}
                  className="cursor-pointer hover:font-bold"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/auth/login")}>Login</Button>
            <Button onClick={() => navigate("/auth/signup")}>Sign Up</Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
