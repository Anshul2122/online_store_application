import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { api_key, SELLER_API } from  "../../utils/api-routes/contant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/authSlice";

const SellerRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    storeName: "",
    email: user?.email || "",
    password:  "",
    phoneNumber: user?.phoneNumber || "",
  });



  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("storeName", input.storeName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    console.log(formData);

    try {
      console.log(input);
      
      dispatch(setLoading(true));
      const res = await axios.post(
        `${api_key}/${SELLER_API}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("res: ",res.data);
      
        if (res.data.success) {
          navigate("/seller/products");
          toast.success("you registered as seller!");
         }
        
      } catch (error) {
        console.log("error: ", error);
        toast.error(`${error}`);
    } finally {
      dispatch(setLoading(false));
      }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center max-w-7xl max-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-2xl"
        >
          <h1 className="font-bold text-xl mb-5">Register As Seller</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="eamil"
              placeholder="Enter your email"
              name="email"
              onChange={changeEventHandler}
            />
            <Label>Password</Label>
            <Input
              type="Password"
              placeholder="Enter your password"
              name="password"
              onChange={changeEventHandler}
            />
            <Label>Phone </Label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              name="phoneNumber"
              onChange={changeEventHandler}
            />
            <Label>Store Name</Label>
            <Input
              type="text"
              placeholder="Enter your store name"
              name="storeName"
              onChange={changeEventHandler}
            />
          </div>
          {isLoading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              loading...
            </Button>
          ) : (
            <Button type="submit" className="bg-black hover:bg-gray-800 mb-2">
              Register as Seller
            </Button>
          )}
          <br />
          <span
            className="font-semibold mt-1 text-gray-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            go back home?
          </span>
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;
