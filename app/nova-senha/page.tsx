import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SetNewPasswordForm from "@/components/auth/SetNewPasswordForm";

export default function NewPasswordPage() {
  return <div className="flex min-h-screen flex-col justify-between bg-background"><Navbar /><main className="flex flex-1 items-center justify-center px-5 py-12"><section className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] sm:p-9"><Link href="/login" className="mb-7 inline-flex items-center gap-2"><Image src="/logo.png" alt="UNIKIVI Vitae" width={38} height={38} className="h-9 w-9 object-contain" /><span className="font-bold text-primary">UNIKIVI Vitae</span></Link><h1 className="mb-2 text-2xl font-extrabold text-primary">Criar nova palavra-passe</h1><p className="mb-6 text-sm text-on-surface-variant">Defina uma palavra-passe nova para voltar à sua conta.</p><SetNewPasswordForm /></section></main><Footer /></div>;
}
