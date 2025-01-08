import { useNavigate } from "react-router-dom";


const Order = ({ id, img, status, desc, price }) => {
  const naviagte = useNavigate();
    return (
      <div className="bg-white shadow-sm p-6 rounded-md border-2 my-4 cursor-pointer hover:bg-gray-400" onClick={()=>naviagte(`/orders/${id}`)}>
        <p className="bg-gray-300 rounded-lg px-2 text-sm w-fit">
          e-commerce Customer shared this order with you.
        </p>

        <div className="grid grid-cols-3 justify-around gap-3  items-center p-2">
          <section className="flex flex-row gap-3 mt-3 items-center">
            <img src={img} alt="" width="70px" />
            <span className=" w-full">{desc}</span>
          </section>
          <section className="flex flex-col items-end">price: {price}</section>
          <section className="flex flex-col items-end">
            <span>{status}</span>
            {status === "Dlivered" ? <span>Rate and Review</span> : <></>}
          </section>
        </div>
      </div>
    );
}

export default Order