import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setLoading, setUser } from "@/redux/slices/authSlice";
import { USER_API } from "@/utils/api-routes/contant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const api_key = import.meta.env.VITE_BACKEND_URL;


const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user } = useSelector(store => store.auth);
  if (user) {
    navigate("/");
    return null;
  }
  


  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    try {
      dispatch(setLoading(true));
      
      let res = await axios.post(`${api_key}/${USER_API}/login`, formData, {
        headers: {
          "Content-Type": "application/json"
        }, withCredentials: true
      }
      ) 

      if (res?.data?.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success("welcome back!");
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Login failed!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
  }, [user]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center max-w-7xl max-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-2xl"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email" // Corrected typo from "eamil" to "email"
              placeholder="Enter your email"
              name="email"
              onChange={changeEventHandler}
            />
            <Label>Password</Label>
            <Input
              type="password" // Lowercased "Password" to "password" to match standard HTML input types
              placeholder="Enter your password"
              name="password"
              onChange={changeEventHandler}
            />
          </div>
          {isLoading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : (
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Login
            </Button>
          )}
          <p className="my-2">
            {" "}
            Create account?{" "}
            <span className="text-gray-600 hover:underline font-extrabold">
              <Link to="/auth/signup">Sign Up</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
