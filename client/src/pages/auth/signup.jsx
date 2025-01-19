import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setLoading } from "@/redux/slices/authSlice";
import { USER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const api_key = import.meta.env.VITE_BACKEND_URL;
const Signup = () => {

  const [input, setInput] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    // Debugging formData
    try {
      dispatch(setLoading(true));
      
      const res = await axios.post(`${api_key}/${USER_API}/register`, formData, {
        withCredentials: true,
      });
      console.log("response: ", res);
      if (res.data.success) {
        navigate('/auth/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error: ", error);
      error?.res?.data?.message || "An unexpected error occurred!";
      toast.error("Registration failed! Please try again.");
    } finally {
      dispatch(setLoading(false));
    }

    
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate("/auth/login");
    }
  }, [user]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center max-w-7xl max-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-2xl"
        >
          <h1 className="font-bold text-xl mb-5">Register</h1>
          <div className="my-2">
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              name="firstName"
              onChange={changeEventHandler}
            />
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="Enter your last name"
              name="lastName"
              onChange={changeEventHandler}
            />
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
          {isLoading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              loading...
            </Button>
          ) : (
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Sign up
            </Button>
          )}
          <p className="my-2">
            {" "}
            already have account?{" "}
            <span className="text-gray-600 hover:underline  font-extrabold">
              <Link to="/auth/login">login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
