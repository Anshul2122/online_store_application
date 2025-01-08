import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Button } from '@/components/ui/button';
import { 
  FaSearch,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { LayoutDashboard, Store } from "lucide-react";

const user = {
  name: "John Doe",
  email: "johndoe@example.com",
  role: "admin",
  login: true,
};

const Header = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const handleInputChange = (e) => {
        setInput(e.target.value);
        console.log(input);
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
          {user.role === "Customer" && (
            <Link to={"/auth/seller-register"} className="flex gap-2 items-center">
              <Store />
              Become a Seller
            </Link>
          )}
          {user.role === "seller" && (
            <Link to={"/seller/products"} className="flex gap-2 items-center">
              <Store />
              Your Store
            </Link>
          )}
          {user.role === "admin" && (
            <Link to={"/admin-home"} className="flex gap-2 items-center">
              <LayoutDashboard />
              dashboard
            </Link>
          )}
          <Link to={"/cart"}>
            <Button>
              {" "}
              <FaShoppingBag />
            </Button>
          </Link>

          {user.login ? (
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
                    <Link to={"/profile"}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={"/orders"}>Orders</Link>
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
}

export default Header