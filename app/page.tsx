import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import PlatformCarousel from "@/components/landing/PlatformCarousel";
import PublicProfilesCarousel from "@/components/landing/PublicProfilesCarousel";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <PlatformCarousel />
      <PublicProfilesCarousel />
      <CtaSection />
      <Footer />
    </main>
  );
}