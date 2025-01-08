import { Trash } from "lucide-react";

const Wishlist = ({ img, rating, desc, price }) => {
  return (
    <div className="bg-gray-100 shadow-sm p-6 rounded-md border-s-0 my-4">
      <div className="grid grid-cols-4 justify-around gap-3  items-center p-2">
        <section className="flex flex-row gap-3 mt-3 items-center">
          <img src={img} alt="" width="70px" />
          <span className=" w-full">{desc}</span>
        </section>
        <span className="flex justify-end">rating: {rating}</span>
        <section className="flex flex-col items-end">{price}</section>
        <section className="flex flex-col items-end">
          <span className="hover:text-red-500 text-sm cursor-pointer" onClick={()=>{console.log("delete item button");
          }}>
            <Trash />
          </span>
        </section>
      </div>
    </div>
  );
};

export default Wishlist;
