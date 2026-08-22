// app/sobre/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sobre/AboutHero";
import PurposeSection from "@/components/sobre/PurposeSection";
import TeamSection from "@/components/sobre/TeamSection";

export default function SobrePage() {
  return (
    <main>
      <Navbar />
      <AboutHero />
      <PurposeSection />
      <TeamSection />
      <Footer />
    </main>
  );
}