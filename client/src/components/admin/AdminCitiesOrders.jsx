
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Admin City Orders Chart Component
const AdminCitiesOrders = () => {
  // Mock data for cities and orders
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const orderCounts = [1200, 1500, 1100, 1000, 950];

  const chartData = {
    labels: cities,
    datasets: [
      {
        label: "Orders Count",
        data: orderCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Top 5 Cities with Most Orders
      </h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default AdminCitiesOrders;
