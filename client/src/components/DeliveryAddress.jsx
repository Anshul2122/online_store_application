
const shippingInfo = {
    name: "Anshul Makhija",
    address: "House no. 350 Khurai road number 6, Infront of Hanuman mandir Sagar - 470002, Madhya Pradesh",
    mobile: "6265428774",
}

const DeliveryAddress = () => {
  return (
    <div className="w-full p-4 border rounded-md shadow-lg bg-white h-40">
      <h2 className="text-lg font-bold">Delivery Address</h2>
          <p>{ shippingInfo.name}</p>
      <p>
        {shippingInfo.address}
      </p>
          <p>Phone number: { shippingInfo.mobile}</p>
    </div>
  );
}

export default DeliveryAddress