import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/authSlice";
import axios from "axios";
import { api_key, ORDER_API } from "@/utils/api-routes/contant";
import { setSoldOrders } from "@/redux/slices/orderSlice";
import { useEffect } from "react";

const SellerOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user} = useSelector(store => store.auth);
  const {soldOrder} = useSelector(store => store.orders);

  const fetchSellerOrder = async()=>{
    dispatch(setLoading(true));
    try {
      const res = await axios.get(`${api_key}/${ORDER_API}/getSellerOrder` , {withCredentials: true});
      console.log(res.data);
      if(res.data.success){
        dispatch(setSoldOrders(res.data.soldOrders));
      }
    } catch (error) {
      
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(()=>{
    fetchSellerOrder();
  },[])

  const invoices =soldOrder;
  console.log("Invoices", invoices);
  console.log(user.soldOrders)
  const calculateQuantity = () => {
    let totalQuantities = 0;
    invoices.forEach((invoice) => {
      invoice.items.forEach((product) => {
        totalQuantities += product.quantity;
      });
    });
    return totalQuantities;
  };

  const totalEarnings = () => {
    let totalEarnings = 0;
    invoices.forEach((invoice) => {
      invoice.items.forEach((product) => {
        totalEarnings += product.price - product.price * 0.05;
      });
    });
    return totalEarnings.toFixed(2);
  }
  let i = 1;

  return (
    <div className="p-6 bg-white">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead className="text-center">
              Quantity of Items with Name
            </TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.S_No}>
              <TableCell className="font-medium">{i++}</TableCell>
              <TableCell className="text-center">
                {invoice.items.map((item, index) => (
                  <div key={index}>
                    {item.quantity} x {item.name}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">
                {invoice.items.map((item, index) => (
                  <div key={index}>₹ {(item.price - item.price * 0.05)*item.quantity}</div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1}>Total</TableCell>
            <TableCell className="text-center">{calculateQuantity()} items</TableCell>
            <TableCell className="text-right">₹ {totalEarnings()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default SellerOrder;

