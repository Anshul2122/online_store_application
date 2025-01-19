import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { api_key, ORDER_API } from "@/utils/api-routes/contant";
import toast from "react-hot-toast";
import { setCartItems } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = useParams();
    // const orderId = searchParams.get("order_id");
    console.log(id)

    const updateOrderStatus = async() => {
      try {
        const res = await axios.post(`${api_key}/${ORDER_API}/confirm-order/${id}`,{}, {withCredentials: true});
        console.log(res.data);
        if (res.data.success) {
          dispatch(setCartItems([]));
          toast.success(res.data.message);
        } else if(res.data.success == false && res.status === 200){
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
      } 
    }

    useEffect(() => {
        updateOrderStatus();
    },[])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-sm text-gray-500 mb-6">Order ID: {id}</p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/orders")}>View Orders</Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
