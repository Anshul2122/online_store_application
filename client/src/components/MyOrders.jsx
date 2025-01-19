import { useEffect, useState } from "react";
import Order from "./Order";
import axios from "axios";
import { api_key, ORDER_API } from "@/utils/api-routes/contant";
import toast from "react-hot-toast";
import { setMyOrders } from "@/redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/authSlice";
import { Loader2 } from 'lucide-react';


const MyOrders = ({ heading }, user, isLoading) => {
  const {myOrders} = useSelector(store=>store.orders);
  const dispatch = useDispatch();

  const fetchOrders = async() => {
    dispatch(setLoading(true))
    try {
      const res = await axios.get(`${api_key}/${ORDER_API}/my`, {
        withCredentials: true,
      });

      if (res.data.success) {
        console.log(res.data)
        dispatch(setMyOrders(res.data.orders));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.res.data.message);
    } finally{
      dispatch(setLoading(false))
    }
  }

  useEffect(()=>{
    fetchOrders();
  },[])


  if (user.role === 'admin') {
    heading = "XYZ user orders"
  }


  return (
    <div>
      
      {isLoading ? (
        <div><Loader2/></div>
      ):(
        <div>
          {!myOrders ? (<div>No Orders yet</div>):(
            <div>
              <h2 className="text-xl font-semibold mb-4">{ heading}</h2>
      <p className="text-gray-600">View and track your orders</p>
      <p>Total orders({ myOrders?.length || 0})</p>

      {myOrders?.length === 0 ? (<div className="flex items-center justify-center  w-full my-10 ">No Orders yet</div>) : (
        <div className="">
        {myOrders.map((item, i) => (
          <Order key={i} order ={myOrders[i]}
          />
        ))}
      </div>
      )}
            </div>
          )}
      

        
      </div>)}
      
      </div>
  );
}

export default MyOrders