import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&w=600&h=400&fit=crop",
    cate: "electronics",
  },
  {
    name: "Fashion",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&w=600&h=400&fit=crop",
    cate: "fashion",
  },
  {
    name: "Home Appliances",
    img: "https://media.istockphoto.com/id/691988470/photo/set-of-kitchen-home-appliances-toaster-kettle-mixer-blender-yogurt-maker-multicooker-grinder.webp?a=1&b=1&s=612x612&w=0&k=20&c=0Wz25gsYD-KBvkz_L5XNcXHqFoyV9WjNzenfB4NF0Lc=",
    cate: "homeAppliances",
  },
  {
    name: "Beauty Products",
    img: "https://images.unsplash.com/photo-1527632911563-ee5b6d53465b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D",
    cate: "beautyProducts",
  },
  {
    name: "Books",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&w=600&h=400&fit=crop",
    cate: "books",
  },
  {
    name: "Sports Equipment",
    img: "https://media.istockphoto.com/id/2101865807/photo/tennis-racket-and-ball-on-the-court-3d-rendering.webp?a=1&b=1&s=612x612&w=0&k=20&c=FAGmU8Ls74LUb8VX27oI-nRGf-whVvK2dECdmCsBj_w=",
    cate:"sports"
  },
];

const FeaturedCategory = () => {
    const navigate = useNavigate();
  return (
    <div className=" w-full">
      <section className="p-6 bg-gray-50">
        <h2 className="text-center text-3xl font-bold">Featured Categories</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative rounded-lg overflow-hidden shadow-lg"
              onClick={() => navigate(`/products/categories/${category.cate}`)}
            >
              <img
                src={category.img}
                alt={category.name}
                className="w-full h-60 object-cover transform group-hover:scale-105 transition-all"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
                {category.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FeaturedCategory