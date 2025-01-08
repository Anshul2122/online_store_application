import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SellerRegister = () => {
  const loading = false;

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", input.name);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);

    console.log(input);
    try {
      let res;

      if (res.data.success) {
        navigate("/");
        toast.success("Success!");
      }
    } catch (error) {
      console.log("error: ", error);
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
          </div>
          {loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              loading...
            </Button>
          ) : (
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Register as Seller
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;
