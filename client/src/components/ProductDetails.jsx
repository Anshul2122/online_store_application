
import CategorySelector from "./CategorySelector";

const ProductDetails = ({product}) => {

  const percentOff = (product) => {
    return Math.floor(
      ((product.originalPrice - product.sellingPrice) / product.originalPrice) *
        100
    );
  };
  
  return (
    <div className="bg-white rounded-lg p-8 pb-36">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <div className="flex items-center mt-2">
        <span className="text-green-600 text-lg font-semibold">
          ₹{product.sellingPrice}
        </span>
        <span className="text-gray-500 ml-4 line-through">
          ₹{product.originalPrice}
        </span>
        <span className="text-red-500 ml-2 text-sm">
          {percentOff(product)}% off
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2 font-bold">
        {" "}
        <span className="bg-green-500 text-white p-1  rounded-md">
          4.2★
        </span>{" "}
        {product.review_rating}
      </p>
      <span className="text-sm font-medium text-gray-500">
        Category: <span className="text-gray-900">{product.category}</span>
        {product.sizes.length > 0 && (<div>
          <CategorySelector category={product.category} />
        </div>)}
      </span>
      {product.colors.length > 0 && (
        <div className="flex gap-5">
          colors:
          {product?.colors?.map((color, i) => (
            <span key={i}> {color}</span>
          ))}
        </div>
      )}
      {product.sizes.length > 0 && (
        <div className="flex gap-5">
          sizes:
          {product?.sizes?.map((color, i) => (
            <span key={i}> {color}</span>
          ))}
        </div>
      )}
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