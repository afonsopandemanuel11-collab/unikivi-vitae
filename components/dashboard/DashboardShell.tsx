// components/dashboard/DashboardShell.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface DashboardShellProps {
  children: React.ReactNode;
  profile: {
    id?: string;
    full_name: string;
    photo_url: string | null;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  };
  completionPercent?: number;
}

const navGroups = [
  {
    label: "VISÃO GERAL",
    items: [
      { label: "Dashboard", icon: "grid_view", href: "/dashboard" },
    ],
  },
  {
    label: "MEU PERFIL",
    items: [
      { label: "Dados Pessoais", icon: "person", href: "/dashboard/perfil" },
      { label: "Educação", icon: "school", href: "/dashboard/educacao" },
      { label: "Experiência", icon: "work", href: "/dashboard/experiencia" },
      { label: "Competências", icon: "psychology", href: "/dashboard/competencias" },
      { label: "Projetos", icon: "rocket_launch", href: "/dashboard/projetos" },
      { label: "Prémios", icon: "workspace_premium", href: "/dashboard/premios" },
      { label: "Atividades", icon: "volunteer_activism", href: "/dashboard/atividades" },
      { label: "Certificações", icon: "verified", href: "/dashboard/certificacoes" },
      { label: "Vídeo Pitch", icon: "videocam", href: "/dashboard/video-pitch" },
    ],
  },
  {
    label: "PRODUÇÃO ACADÉMICA E CIENTÍFICA",
    items: [
      { label: "Publicações", icon: "menu_book", href: "/dashboard/publicacoes" },
      { label: "Produção Científica", icon: "biotech", href: "/dashboard/producao-cientifica" },
    ],
  },
  {
    label: "IDENTIDADE ACADÉMICA",
    items: [
      { label: "Identificadores", icon: "badge", href: "/dashboard/identificadores" },
      { label: "Currículos", icon: "description", href: "/dashboard/curriculos" },
      { label: "Perfil Público", icon: "public", href: "/dashboard/perfil-publico" },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { label: "Definições", icon: "settings", href: "/dashboard/definicoes/conta" },
    ],
  },
];

export default function DashboardShell({
  children,
  profile,
  completionPercent = 78,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Erro ao terminar sessão:", err);
      setLoggingOut(false);
    }
  }

  const renderNav = (isMobile = false) => (
    <div className="flex flex-col justify-between min-h-full">
      <div>
        {/* Mobile-only Close Header */}
        {isMobile && (
          <div className="p-4 border-b border-outline-variant/60 flex items-center justify-between lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileDrawerOpen(false)}>
              <Image
                src="/logo.png"
                alt="UNIKIVI Vitae Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain shrink-0"
              />
              <span className="text-lg font-black font-headline-md tracking-tight text-primary">
                UNIKIVI <span className="text-primary/70">Vitae</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              aria-label="Fechar navegação"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        )}

        {/* User Card: Foto + Meu Perfil + % concluído + Otimizar com IA */}
        <div className="p-6 border-b border-outline-variant/60 flex flex-col items-center text-center bg-slate-50/70">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-md bg-surface-container flex items-center justify-center">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center">
                  {profile.full_name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            {profile.status === "ACTIVE" && (
              <span
                className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs"
                title="Ativo"
              />
            )}
          </div>

          <h3 className="font-extrabold text-lg text-primary tracking-tight">
            Meu Perfil
          </h3>
          <span className="text-xs sm:text-sm text-slate-500 font-mono font-semibold mt-0.5 mb-3.5">
            {completionPercent}% concluído
          </span>

          <Link
            href="/dashboard/perfil"
            onClick={() => {
              if (isMobile) setMobileDrawerOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-5 bg-[#0B1736] hover:bg-[#132350] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <span className="text-amber-300 text-base">✨</span>
            <span>Otimizar com IA</span>
          </Link>
        </div>

        {/* Navigation Categories and Items */}
        <nav className="p-4 sm:p-5 space-y-7">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <h2 className="px-3 text-xs font-black text-slate-400 tracking-wider uppercase">
                {group.label}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setMobileDrawerOpen(false);
                        }}
                        className={`flex items-center gap-3.5 px-4 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white font-bold shadow-sm"
                            : "text-slate-700 hover:bg-slate-100 hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {item.icon}
                        </span>
                        <span className="flex-1 text-sm">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Perfil Copilot Action Button */}
          <div className="pt-2 px-1">
            <Link
              href="/dashboard/perfil"
              onClick={() => {
                if (isMobile) setMobileDrawerOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 bg-[#0B1736] hover:bg-[#132350] text-white rounded-xl text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <span className="text-amber-300 text-base">✨</span>
              <span>Perfil Copilot</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Sidebar Bottom Footer: Ajuda & Terminar Sessão */}
      <div className="p-5 border-t border-outline-variant/60 space-y-1 bg-slate-50/50">
        <Link
          href="/sobre"
          onClick={() => {
            if (isMobile) setMobileDrawerOpen(false);
          }}
          className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span>Ajuda</span>
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>{loggingOut ? "A terminar..." : "Sair"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col font-sans">
      {/* ── TOP NAVBAR GLOBAL ── */}
      <header className="bg-white border-b border-outline-variant/80 px-5 sm:px-8 xl:px-10 h-18 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        {/* Logo and Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Abrir navegação"
            className="lg:hidden p-2 rounded-xl text-primary hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="UNIKIVI Vitae Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              priority
            />
            <span className="text-xl sm:text-2xl font-black font-headline-md text-primary tracking-tight">
              UNIKIVI <span className="text-primary/70">Vitae</span>
            </span>
          </Link>
        </div>

        {/* Center Main Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/dashboard"
            className={`text-sm font-bold tracking-wider uppercase transition-colors relative py-6 ${
              pathname === "/dashboard"
                ? "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary font-black"
                : "text-slate-600 hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/pesquisa"
            className="text-sm font-bold tracking-wider uppercase text-slate-600 hover:text-primary transition-colors py-6"
          >
            Pesquisar
          </Link>
          <Link
            href="/pesquisa"
            className="text-sm font-bold tracking-wider uppercase text-slate-600 hover:text-primary transition-colors py-6"
          >
            Rede
          </Link>
          <Link
            href="/dashboard/producao-cientifica"
            className="text-sm font-bold tracking-wider uppercase text-slate-600 hover:text-primary transition-colors py-6"
          >
            Impacto
          </Link>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/perfil"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 text-primary text-xs sm:text-sm font-bold transition-all border border-primary/20"
          >
            <span className="text-amber-400">✨</span>
            <span>Perguntar à IA</span>
          </Link>

          <button
            className="p-2.5 text-slate-500 hover:text-primary rounded-xl hover:bg-slate-100 transition-colors"
            title="Notificações"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>

          <Link
            href="/dashboard/definicoes/conta"
            className="p-2.5 text-slate-500 hover:text-primary rounded-xl hover:bg-slate-100 transition-colors"
            title="Definições da Conta"
          >
            <span className="material-symbols-outlined text-2xl">settings</span>
          </Link>

          <Link
            href="/dashboard/perfil"
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 shadow-xs shrink-0"
            title={profile.full_name}
          >
            {profile.photo_url ? (
              <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {profile.full_name.charAt(0)}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* ── MAIN LAYOUT WITH EXPANSIVE 3-COLUMN STRUCTURE ── */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Desktop Sidebar with Full Navigation Structure & Profile Card */}
        <aside className="hidden lg:flex w-72 xl:w-80 bg-white border-r border-outline-variant/80 shrink-0 flex-col justify-between min-h-[calc(100vh-72px)] overflow-y-auto">
          {renderNav(false)}
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <aside className="relative w-80 max-w-[85vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col z-10 animate-slide-in">
              {renderNav(true)}
            </aside>
          </div>
        )}

        {/* Main Content Area - Unrestricted and Fluid */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 xl:p-12 min-w-0 w-full">
          {children}
        </main>
      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-outline-variant/60 bg-white py-6 px-8 sm:px-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
        <div>
          <span className="font-bold text-primary">UNIKIVI Vitae</span>
          <span className="ml-2">© 2026 Universidade Kimpa Vita. Todos os direitos reservados.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/sobre" className="hover:text-primary">Privacidade</Link>
          <Link href="/sobre" className="hover:text-primary">Termos de Uso</Link>
          <Link href="/sobre" className="hover:text-primary">Suporte Académico</Link>
          <a href="https://unikivi.ao" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Portal da Universidade</a>
        </div>
      </footer>
    </div>
  );
}