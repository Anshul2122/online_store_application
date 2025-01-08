
import Wishlist from "./WishList";

const wishlist = [
  {
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljnakjfnakjf",
    price: 7117,
    rating: 3.5,
  },
  {
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 7117,
    desc: "fdadffnkjdnfkjndkfjkdnfkanfkanfkljn",
    rating: 3.4,
  },
  {
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    price: 7117,
    desc: "fdadffnfjkdnfkanfkanfkljn",
    rating: 3.6,
  },
  {
    img: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    desc: "danfkljnakjfnakjf",
    price: 7117,
    rating: 2.1,
  },
];

const MyWishList = () => {
  return (
    <div>
          <h2 className="text-xl font-semibold mb-6 border-b-slate-500">My WishList {"(6) "}</h2>

      <div className="">
        {wishlist.map((item, id) => (
          <Wishlist
            key={id}
            rating={item.rating}
            desc={item.desc}
            price={item.price}
            img={item.img}
          />
        ))}
      </div>
    </div>
  );
}

export default MyWishList