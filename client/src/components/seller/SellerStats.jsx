
import BarChart from "./BarChart"; // For Sales Chart
import PieChart from "./PieChart"; // For Order Status Chart
import LowStockList from "./LowStockList"; // For Stock Alerts
import TopSectionStats from "./TopSectionStats";

const SellerStats = () => {
  return (
    <div className="p-4 bg-gray-100">
      {/* Top Section: Key Metrics */}

      <TopSectionStats />

      {/* Middle Section: Sales Bar Chart */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h3 className="text-2xl font-semibold mb-6">Monthly/Weekly Sales</h3>
        <BarChart />
      </div>

      {/* Next Section: Pie Chart for Order Status */}

      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h2 className="text-2xl font-semibold mb-6">Order Status Summary</h2>
        <PieChart />
      </div>

      {/* Bottom Section: Low Stock Alerts */}
      <div className="bg-white shadow-md p-4 rounded-lg mt-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <LowStockList />
      </div>
    </div>
  );
};

export default SellerStats;
