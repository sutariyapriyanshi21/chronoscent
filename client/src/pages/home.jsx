import HeroSection from "../components/HeroSection";
import FeaturedCollections from "../components/FeaturedCollection";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturedBrands from "../components/FeaturedBrands";
import WhyChooseUs from "../components/WhyChooseUs";
import OfferBanner from "../components/OfferBanner";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";



function Home() {
  return (
    <>
     <HeroSection />
    <FeaturedCollections />
    <FeaturedBrands />
    <FeaturedProducts />
    <WhyChooseUs />
    <OfferBanner />
    <Newsletter />
    <Footer />
    </>
  );
}

export default Home;