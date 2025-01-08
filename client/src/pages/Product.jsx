
import ProductDetails from "@/components/ProductDetails";
import RatingsAndReviews from "@/components/RatingsAndReviews";
import { Button } from "@/components/ui/button";
import { PackageCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";



const productItem = {
  img: [
    "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
  name: "prayati Plastic Fridge Container - 1500 ml (Pack of 10, White)",
  price: 454,
  originalPrice: 1521,
  percentOff: 73,
  review_rating: "1,21,106 Ratings & 5,412 Reviews",
  category: "Container",
  description:
    "Perfect Size: This PRAYATI food Storage container is 1500ML, 11.42 x 4.87 x 3.55 inches, suitable for refrigerator, freezer, pantry cabinets and kitchen. Water Drain Tray: Special water drain tray keep vegetables and fruits separately out of drippings, also keeps meat and fish separately out of thaw water. Material?Fridge storage container made from durable 100% food grade PP material. Storage with Lid: Easily organize your fridge kitchen pantry with these handy stackable containers to store fruits, vegetables, meat and so on. Warning: Do not use the food storage container in a microwave or oven. It designed for dust-proof and Keep fresh in fridge.",
};


const Product = () => {

    const [selectedImage, setSelectedImage] = useState(productItem.img[0]);



  return (
    <div className="p-6 bg-gray-200 ">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Section: Product Image */}
        <div className="flex justify-center flex-col">
          {/*vertical image section */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-4 w-fit">
              {productItem.img.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setSelectedImage(image)}
                  onMouseOver={() => setSelectedImage(image)}
                  className={`h-16 md:w-20 md:h-20 border border-gray-300 rounded-lg cursor-pointer ${
                    selectedImage === image
                      ? "border-gray-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="w-fit ">
              <img
                src={selectedImage}
                alt="Product"
                className="border border-gray-300 rounded-lg h-full "
              />
            </div>
          </div>

          {/* Action Buttons */}

          <div className="flex gap-5 mt-10 justify-center">
            <Button className="bg-white text-black hover:text-white w-fit">
              <ShoppingCart />
              Add to Cart
            </Button>
            <Button className="w-fit">
              <PackageCheck />
              Buy Now
            </Button>
          </div>
        </div>
        {/* Right Section: Product Details */}
        <div>
          <ProductDetails product={productItem} />
        </div>
          </div>
          <div className="rounded-lg mt-5 shadow-lg flex justify-end"><RatingsAndReviews/></div>
    </div>
  );
};

export default Product;
