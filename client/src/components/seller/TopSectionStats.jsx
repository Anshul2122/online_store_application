import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const statsData = [
  {
    title: "Total Products Added",
    currentValue: 124,
    previousValue: 110,
    unit: "",
  },
  {
    title: "Total Orders Received",
    currentValue: 512,
    previousValue: 478,
    unit: "",
  },
  {
    title: "Revenue Earned",
    currentValue: 124000,
    previousValue: 100000,
    unit: "₹",
  },
  {
    title: "Customer Rating",
    currentValue: 4.5,
    previousValue: 4.2,
    unit: "/5",
  },
];

const TopSectionStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {statsData.map((stat, index) => {
        const percentageChange =
          ((stat.currentValue - stat.previousValue) / stat.previousValue) * 100;
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
            <div className="flex items-baseline gap-4">
              <div className="text-xl font-bold text-black flex items-center">
                {stat.unit === "₹" && <span className="mr-1">{stat.unit}</span>}
                {stat.currentValue}
                {stat.unit === "/5" && <span>{stat.unit}</span>}
              </div>

              {stat.previousValue && (
                <div className="text-sm text-gray-400 flex items-center">
                            (prev : { " "}
            
                  {stat.previousValue})
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
