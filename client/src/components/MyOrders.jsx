import Order from "./Order";

const Orders = [
  {
    id: "1",
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljnakjfnakjf",
    price: 7117,
    status: "Order Confirmed",
  },
  {
    id: "2",
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 7117,
    desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljn",
    status: "Out for delivery",
  },
  {
    id: "3",
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 7117,
    desc: "fdadffnfjkdnfkanfkanfkljn",
    status: "Shipped",
  },
  {
    id: "4",
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    desc: "danfkljnakjfnakjf",
    price: 7117,
    status: "Dlivered",
  },
];

const user = {
  name: "abshoa",
  role: "admin",
}
const MyOrders = ({ heading }) => {
  if (user.role === 'admin') {
    heading = "XYZ user orders"
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{ heading}</h2>
      <p className="text-gray-600">View and track your orders</p>

        <div className="">
          {Orders.map((item, id) => (
            <Order key={id}
              id={ id}
              status={item.status}
              desc={item.desc}
              price={item.price}
              img={item.img}
            />
          ))}
        </div>
      </div>
  );
}

export default MyOrders