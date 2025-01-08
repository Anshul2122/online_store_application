const AdminTopSection = () => {
  // Example data for the top section
  const statsData = [
    {
      title: "Users Overview",
      stats: [
        {
          label: "Total Users",
          currentMonth: 13000,
          prevMonth: 12500,
        },
        {
          label: "New Users This Month",
          currentMonth: 500,
          prevMonth: 450,
        },
        {
          label: "New Sellers This Month",
          currentMonth: 500,
          prevMonth: 400,
        },
        {
          label: "Customers",
          currentMonth: 10000,
          prevMonth: 10200,
        },
        {
          label: "Sellers",
          currentMonth: 2500,
          prevMonth: 2300,
        },
      ],
    },
    {
      title: "Products Overview",
      stats: [
        {
          label: "Total Products",
          currentMonth: 50000,
          prevMonth: 48000,
        },
        {
          label: "New Products This Month",
          currentMonth: 2000,
          prevMonth: 1800,
        },
      ],
    },
    {
      title: "Orders Overview",
      stats: [
        {
          label: "Total Orders",
          currentMonth: 150000,
          prevMonth: 145000,
        },
        {
          label: "New Orders This Month",
          currentMonth: 10000,
          prevMonth: 10300,
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsData.map((section, index) => (
        <div key={index} className="bg-white shadow-md p-4 rounded-lg border-2">
          <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
          {section.stats.map((stat, idx) => {
            const percentageChange =
              stat.prevMonth === 0
                ? "N/A"
                : (
                    ((stat.currentMonth - stat.prevMonth) / stat.prevMonth) *
                    100
                  ).toFixed(2); // Calculate percentage change dynamically

            return (
              <p key={idx} className="text-gray-600">
                <span className="font-bold text-xl">
                  {stat.currentMonth.toLocaleString()}
                </span>{" "}
                {stat.label}
                <br />
                <span className="text-sm text-gray-500">
                  Previous Month: {stat.prevMonth.toLocaleString()}
                </span>
                <span
                  className={`ml-2 text-sm ${
                    percentageChange > 0
                      ? "text-green-600"
                      : percentageChange < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  ({percentageChange > 0 ? "+" : ""}
                  {percentageChange}%)
                </span>
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AdminTopSection;
