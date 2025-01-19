import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = ({ img, name, sellingPrice, price, handleRemove, id }) => {
  
  const percentOff = (originalPrice, sellingPrice) => {
    const discount = (originalPrice - sellingPrice) / originalPrice * 100;
    return `${discount.toFixed(0)}% off`;
  };
  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 shadow-sm p-6 rounded-md border-s-0 my-4 flex justify-between">
      <section className="grid grid-cols-2 gap-10 ">
        <div className="h-28">
          <img src={img} alt="" className="h-28 w-36 cursor-pointer" onClick={()=>navigate(`/product/${id}`)} />
        </div>
        <section className="flex flex-col ">
          <span onClick={()=>navigate(`/product/${id}`)} className="hover:underline hover:font-abold cursor-pointer">{name}</span>
          <span className="text-green-600 text-lg font-semibold">
            ₹{sellingPrice}
          </span>
          <span className="text-gray-500  line-through">₹{price}</span>
          <span className="text-green-600">{percentOff(price, sellingPrice)}</span>
          <section className="flex flex-col items-end"></section>
        </section>
      </section>

      <section>
        <span
          className="hover:text-red-500 text-sm cursor-pointer"
          onClick={handleRemove}
        >
          <Trash />
        </span>
      </section>
    </div>
  );
};

export default Wishlist;
