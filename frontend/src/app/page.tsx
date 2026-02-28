import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import FeaturedJobsSection from "./components/FeaturedJobsSection";
import CTASection from "./components/CTASection";
import LatestJobsSection from "./components/LatestJobsSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F8FD]">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <CTASection />
      <FeaturedJobsSection />
      <LatestJobsSection />
      <Footer />
    </main>
  );
}
