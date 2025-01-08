// AdminStatsChart.js

import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "../ui/button";

// Register components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Admin Stats Component
const AdminLineChart = () => {
  const [selectedOption, setSelectedOption] = useState("products");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Example Data for Products and Orders (used for chart)
  const productsData = [
    1200, 1300, 1500, 1400, 1600, 1700, 1800, 1900, 2000, 2200, 2300, 2500,
  ];
  const ordersData = [
    1000, 1100, 1050, 1200, 1150, 1300, 1250, 1400, 1350, 1500, 1450, 1600,
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label:
          selectedOption === "products"
            ? "Monthly Products Added"
            : "Monthly Orders Placed",
        data: selectedOption === "products" ? productsData : ordersData,
        borderColor:
          selectedOption === "products"
            ? "rgb(75, 192, 192)"
            : "rgb(255, 99, 132)",
        backgroundColor:
          selectedOption === "products"
            ? "rgba(75, 192, 192, 0.2)"
            : "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {selectedOption === "products"
          ? "Monthly Products Added"
          : "Monthly Orders Placed"}
      </h3>
      {/* Toggle Buttons */}
      <div className="flex justify-between mb-4">
        <Button
          className={`px-4 py-2 rounded-md ${
            selectedOption === "products"
              ? ""
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedOption("products")}
        >
          Products
        </Button>
        <Button
          className={`px-4 py-2 rounded-md ${
            selectedOption == "orders"
              ? ""
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedOption("orders")}
        >
          Orders
        </Button>
      </div>

      {/* Line Chart */}

      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminLineChart;
