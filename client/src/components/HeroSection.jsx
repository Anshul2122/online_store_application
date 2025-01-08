import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';


const banners = [
  "https://res.cloudinary.com/dhuj3yc6g/image/upload/v1736253141/t12xukkchyjioayjcaip.jpg",
  "https://res.cloudinary.com/dhuj3yc6g/image/upload/v1736253295/y8awfihcv0cdi5z9n2by.jpg",
  "https://images.unsplash.com/photo-1685883785966-502b1a50f268?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvZSUyMHNhbGV8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNhbGV8ZW58MHx8MHx8fDA%3D",
];

const HeroSection = () => {

  const navigate = useNavigate()
    
    const [currentBanner, setCurrentBanner] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 2000); 
      return () => clearInterval(interval);
    }, []);
  return (
    <section className="relative w-full h-[450px] overflow-hidden">
      {/* Banner Image */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentBanner * 100}%)`, // Slide effect
          display: "flex",
        }}
      >
        {banners.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Promotion ${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Text Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
        <h1 className="text-4xl font-bold">
          Big Sale on Your Favorite Products!
        </h1>
        <p className="mt-4 text-lg">Shop now and get up to 50% off</p>
        <Button className="mt-6 px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-700 transition"
        onClick={()=>navigate('/all-products')}  >
          Shop Now
        </Button>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentBanner(i)} // Manual navigation
            className={`w-3 h-3 rounded-full ${
              currentBanner === i ? "bg-black" : "bg-gray-300"
            } cursor-pointer`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
