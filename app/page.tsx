import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import NewsSection from "@/components/public/NewsSection";
import ProductsSection from "@/components/public/ProductsSection";
import UpcomingSection from "@/components/public/UpcomingSection";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main className="bg-bg-primary min-h-screen">
      <Navbar />
      <HeroSection />
      <NewsSection />
      <ProductsSection />
      <UpcomingSection />
      <Footer />
    </main>
  );
}
