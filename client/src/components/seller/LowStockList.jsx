import { Button } from "../ui/button";

const LowStockList = () => {
  const lowStockProducts = [
    { name: "Product A", stock: 3 },
    { name: "Product B", stock: 2 },
    { name: "Product C", stock: 4 },
  ];

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Product Name</th>
          <th className="border border-gray-300 px-4 py-2">Stock</th>
          <th className="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {lowStockProducts.map((product, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {product.stock}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <Button className="px-4 py-2 rounded">
                Restock
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LowStockList;
