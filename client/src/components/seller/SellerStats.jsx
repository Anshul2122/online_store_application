import { useEffect, useState } from "react";
import axios from "axios";
import BarChart from "./BarChart";
import LowStockList from "./LowStockList";
import TopSectionStats from "./TopSectionStats";
import { api_key, SELLER_API } from "@/utils/api-routes/contant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

const SellerStats = () => {
  const { isLoading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [stats, setStats] = useState([]);

  const fetchStats = async () => {
    dispatch(setLoading(true))
      try {
        const response = await axios.get(`${api_key}/${SELLER_API}/my-stats`, { withCredentials: true });
        if (response.data.success) {
          console.log(response.data);
          setStats(response.data);
        }
        console.log("low stocks: ", response.data);
        console.log(stats.monthlyStats)
      } catch (err) {
        console.log(err)
      } finally {
        dispatch(setLoading(false));
      }
  };
  
  useEffect(() => {
    fetchStats()
  }, [])


  return (
    <div className="p-4 bg-gray-100">
      <TopSectionStats
        orders={stats.orders}
        products={stats.products}
        rating={stats.rating}
        monthlyProducts={stats.monthlyProducts}
        monthlyRevneue={stats.monthlyStats}
      /> 
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h3 className="text-2xl font-semibold mb-6">Monthly Sales(₹)</h3>
        <BarChart data={stats.monthlyStats} />
      </div>
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <LowStockList data={stats.lowStockProducts} />
      </div>
    </div>
  );
};

export default SellerStats;
