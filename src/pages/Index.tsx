import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AnimatedPreview from "@/components/landing/AnimatedPreview";
import Features from "@/components/landing/Features";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <AnimatedPreview />
    <Features />
    <Gallery />
    <Testimonials />
    <Pricing />
    <Footer />
  </main>
);

export default Index;
