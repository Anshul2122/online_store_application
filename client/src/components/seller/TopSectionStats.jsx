import { FaArrowUp, FaArrowDown } from "react-icons/fa";



const TopSectionStats = ({
  orders,
  products,
  rating,
}) => {
  const statsData = [
    {
      title: "Total Products Added",
      currentValue: products?.totalProducts || 0,
      thismonth: products?.thisMonthProducts|| 1,
      unit: "",
      
    },
    {
      title: "Total Orders Received",
      currentValue: orders?.totalOrders,
      thismonth: orders?.lastMonthOrders || 1,
      unit: "",
    },
    {
      title: "Revenue Earned",
      currentValue: orders?.totalRevenue,
      thismonth: orders?.totalRevenue,
      unit: "₹",
    },
    {
      title: "Customer Rating",
      currentValue: 4.5,
      thismonth: 1,
      unit: "/5",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {statsData.map((stat, index) => {
        const percentageChange =
          ((stat.currentValue - stat.thismonth) / stat.thismonth) * 100;
        const isPositive = percentageChange >= 0;

        return (
          <div
            key={index}
            className="bg-white shadow-md p-6 rounded-lg flex flex-col border border-gray-200 justify-evenly"
          >
            {/* Title */}
            <h3 className="text-gray-500 text-sm font-medium mb-4">
              {stat.title}
            </h3>

            {/* Current & Previous Values */}
            <div className="flex items-baseline gap-4 flex-col">
              <div className="text-xl font-bold text-black flex items-center">
                {stat.unit === "₹" && <span className="mr-1">{stat.unit}</span>}
                {stat.currentValue}
                {stat.unit === "/5" && <span>{stat.unit}</span>}
              </div>

              {stat.thismonth && (
                <div className="text-sm text-gray-400 flex items-center">
                  ( this month: {stat.thismonth})
                </div>
              )}
            </div>

            {/* Percentage Change */}
            <div
              className={`mt-4 text-sm flex items-center ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {Math.abs(percentageChange).toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopSectionStats;
