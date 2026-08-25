// app/registo/page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterWizard from "@/components/auth/RegisterWizard";

export default function RegistoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navbar />

      <main className="flex-1 w-full flex items-center justify-center p-margin-mobile md:p-margin-desktop py-12">
        <RegisterWizard />
      </main>

      <Footer />
    </div>
  );
}