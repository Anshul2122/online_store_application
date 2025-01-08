import { useNavigate } from "react-router-dom";


const categories = [
  {
    category: "electronics",
    name: "Electronics",
  },
  {
    category: "grocery",
    name: "Grocery",
  },
  {
    category: "mobiles",
    name: "Mobiles",
  },
  {
    category: "fashion",
    name: "Fashion",
  },
  {
    category: "books",
    name: "Books",
  },
  {
    category: "homeAppliances",
    name: "Home Appliances",
  }, {
    category: "furniture",
    name: "Furniture",
  },
  {
    category: "beautyProducts",
    name: "Beauty Products",
  },
  {
    category: "toys",
    name: "Toys",
  },
  {
    category: "fitness",
    name: "Fitness",
  }
];
const CategoryHeader = () => {
  const navigate = useNavigate();
  return (
      <div className="w-full px-10 flex justify-evenly py-2 border-b-2">
          {categories.map((categorys, i) => (
              <span key={i} className="font-bold text-sm cursor-pointer hover:underline" onClick={()=>navigate(`/products/categories/${categorys.category}`)}>{categorys.name}</span>
          ))}
    </div>
  )
}

export default CategoryHeader