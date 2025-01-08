import { useState } from "react";

const CategorySelector = ({category} ) => {
  const [selectedOption, setSelectedOption] = useState(
    category === "Container" ? 1500 : "M"
  );

  const options =
    category === "Container"
      ? [1000, 1500, 1800, 2000, 2100, 2200, 2500]
      : ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">
        {category === "Container" ? "Capacity" : "Size"}
      </h2>
      <div className="flex space-x-2 mt-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={`px-3 py-1 rounded border ${
              selectedOption === option
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {option} {category === "Container" ? "ml" : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
