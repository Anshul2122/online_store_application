import FeaturedCategory from "@/components/FeaturedCategory"
import HeroSection from "@/components/HeroSection"
import LatestProduct from "@/components/LatestProduct"


const Home = () => {
  return (
      <div>
      <HeroSection />
      <LatestProduct />
      <FeaturedCategory/>
    </div>
  )
}

export default Home