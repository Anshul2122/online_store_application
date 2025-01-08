
import CategorySelector from "./CategorySelector";

const ProductDetails = ({ product }) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{product.name}</h1>
      <div className="flex items-center mt-2">
        <span className="text-green-600 text-lg font-semibold">
          ₹{product.price}
        </span>
        <span className="text-gray-500 ml-4 line-through">
          ₹{product.originalPrice}
        </span>
        <span className="text-red-500 ml-2 text-sm">
          {product.percentOff}% off
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2 font-bold">
        {" "}
        <span className="bg-green-500 text-white p-1  rounded-md">4.2★</span>{" "}
        {product.review_rating}
      </p>
      <span className="text-sm font-medium text-gray-500">
        Category: <span className="text-gray-900">{product.category}</span>
        <div>
          <CategorySelector category={product.category} />
        </div>
      </span>
      <p>
        <span className="text-lg font-medium text-gray-500">
          Desciption: <br />
        </span>
        {product.description}
      </p>

      {/* Action Buttons */}
    </div>
  );
}

export default ProductDetails