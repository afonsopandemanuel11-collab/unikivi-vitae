import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import PlatformCarousel from "@/components/landing/PlatformCarousel";
import PublicProfilesCarousel from "@/components/landing/PublicProfilesCarousel";
import CurriculumTemplates from "@/components/landing/CurriculumTemplates";
import FeaturedProfiles from "@/components/landing/FeaturedProfiles";
import FeaturedPublications from "@/components/landing/FeaturedPublications";
import ExploreSection from "@/components/landing/ExploreSection";
import NewsSection from "@/components/landing/NewsSection";
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
      <CurriculumTemplates />
      <FeaturedProfiles />
      <FeaturedPublications />
      <ExploreSection />
      <NewsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}