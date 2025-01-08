import DeliveryAddress from "@/components/DeliveryAddress"
import OrderDetail from "@/components/OrderDetail"
import SellerOrderDetails from "@/components/seller/SellerOrderDetails";


const user = {
  name: "John",
  email: "john@example.com",
  phoneNumber: "4546548463",
  address: "123 Main St, Anytown, USA",
  role: "seller",
};

const OrderDetails = () => {
  return (
      <div className="w-full mx-auto p-10 flex flex-col gap-10 bg-gray-100 min-h-screen">
          <DeliveryAddress />
      {user.role === "user" && <OrderDetail />}
      {(user.role==='seller' || user.role==='admin') && <SellerOrderDetails/>}
    </div>
  )
}

export default OrderDetails