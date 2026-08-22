// app/registo/page.tsx
import RegisterWizard from "@/components/auth/RegisterWizard";

export default function RegistoPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-margin-mobile md:p-margin-desktop">
      <RegisterWizard />
    </main>
  );
}