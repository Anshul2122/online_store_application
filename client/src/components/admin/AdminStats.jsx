import AdminCitiesOrders from "./AdminCitiesOrders";
import AdminLineChart from "./AdminLineChart";
import PieChart from "./AdminPieChart";
import AdminTopSection from "./AdminTopSection";


const AdminStats = () => {
  return (
    <div className="p-4">
      {/* Top Section: Key Metrics */}
      <div className="bg-white  p-4 rounded-lg mt-6 ">
        <AdminTopSection />
      </div>

      {/* Middle Section: Sales Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <AdminLineChart />
      </div>

      {/* Next Section: Pie Chart for Order Status */}

      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h2 className="text-2xl font-semibold mb-6">Order Status Summary</h2>
        <PieChart />
      </div>

      {/* Bottom Section: Low Stock Alerts */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <AdminCitiesOrders />
      </div>
    </div>
  );
}

export default AdminStats