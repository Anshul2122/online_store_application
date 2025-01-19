import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LowStockList = ({ data }) => {
  console.log(data);
  const navigate = useNavigate();
  

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
        {data?.length > 0 ? (
          data?.map((product, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                {product?.name || NAN}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {product?.stock || NAN}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  className="px-4 py-2 rounded"
                  onClick={() => navigate(`/product/update/${product._id}`)}
                >
                  Restock
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <div className="text-center">NO LOW STOCK PRODUCT</div>
        )}
      </tbody>
    </table>
  );
};

export default LowStockList;
