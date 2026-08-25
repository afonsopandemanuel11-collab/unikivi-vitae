// components/dashboard/DashboardShell.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DashboardShellProps {
  children: React.ReactNode;
  profile: {
    full_name: string;
    photo_url: string | null;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  };
}

const navGroups = [
  {
    label: "VISAO GERAL",
    items: [{ label: "Dashboard", icon: "grid_view", href: "/dashboard" }],
  },
  {
    label: "MEU PERFIL",
    items: [
      { label: "Dados Pessoais", icon: "person", href: "/dashboard/perfil" },
      { label: "Educacao", icon: "school", href: "/dashboard/educacao" },
      { label: "Experiencia", icon: "work", href: "/dashboard/experiencia" },
      { label: "Competencias", icon: "psychology", href: "/dashboard/competencias" },
      { label: "Projetos", icon: "rocket_launch", href: "/dashboard/projetos" },
      { label: "Premios", icon: "workspace_premium", href: "/dashboard/premios" },
      { label: "Atividades", icon: "volunteer_activism", href: "/dashboard/atividades" },
      { label: "Certificacoes", icon: "verified", href: "/dashboard/certificacoes" },
      { label: "Video Pitch", icon: "videocam", href: "/dashboard/video-pitch" },
    ],
  },
  {
    label: "PRODUCAO ACADEMICA E CIENTIFICA",
    items: [
      { label: "Publicacoes", icon: "menu_book", href: "/dashboard/publicacoes" },
      { label: "Producao Cientifica", icon: "biotech", href: "/dashboard/producao-cientifica" },
    ],
  },
  {
    label: "IDENTIDADE ACADEMICA",
    items: [
      { label: "Identificadores", icon: "badge", href: "/dashboard/identificadores" },
      { label: "Curriculos", icon: "description", href: "/dashboard/curriculos" },
      { label: "Perfil Publico", icon: "public", href: "/dashboard/perfil-publico" },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { label: "Definicoes", icon: "settings", href: "/dashboard/definicoes/conta" },
    ],
  },
];

function getStatusBadge(status: DashboardShellProps["profile"]["status"]) {
  if (status === "ACTIVE") {
    return (
      <span className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-full text-[11px] sm:text-xs font-medium font-label-sm shrink-0">
        <span className="material-symbols-outlined text-xs sm:text-sm">check_circle</span>
        <span>Verificado</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-surface-container text-on-surface-variant border border-outline-variant rounded-full text-[11px] sm:text-xs font-medium font-label-sm shrink-0">
      <span className="material-symbols-outlined text-xs sm:text-sm">cancel</span>
      <span>Nao verificado</span>
    </span>
  );
}

export default function DashboardShell({ children, profile }: DashboardShellProps) {
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
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="p-6 lg:p-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-headline-md tracking-tight text-primary">
              UNIKIVI <span className="text-primary/70">Vitae</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
              PLATAFORMA ACADEMICA
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container lg:hidden"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <nav className="px-4 space-y-6 sm:space-y-8">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <h2 className="px-4 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                {group.label}
              </h2>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setMobileDrawerOpen(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-md font-bold"
                            : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-medium"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="pt-2 px-4 pb-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all">
              <span className="text-secondary-container">✨</span>
              <span>Perfil Copilot</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-outline-variant/40 mt-4 mb-2">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">logout</span>
          <span>{loggingOut ? "A terminar sessão..." : "Terminar Sessão"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-primary">
      {/* ── DESKTOP SIDEBAR (visible on >= lg) ── */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-outline-variant fixed h-screen overflow-y-auto z-30 flex-col justify-between">
        {renderNav(false)}
      </aside>

      {/* ── MOBILE / TABLET DRAWER OVERLAY (visible on < lg when open) ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Box */}
          <aside className="relative w-80 max-w-[85vw] bg-white h-full overflow-y-auto shadow-2xl flex flex-col z-10 animate-slide-in">
            {renderNav(true)}
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT (adapted margin and padding) ── */}
      <main className="flex-1 w-full lg:ml-72 min-w-0 flex flex-col">
        {/* Responsive Header */}
        <header className="h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Hamburger button for mobile/tablet */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Abrir menu de navegação"
              className="lg:hidden p-2 rounded-xl text-primary hover:bg-surface-container transition-colors focus:outline-none shrink-0"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl font-bold font-headline-md truncate">
                Ola, {profile.full_name.split(" ")[0]}
              </h2>
            </div>
            <div className="hidden sm:block">
              {getStatusBadge(profile.status)}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            <button
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"
              title="Notificações"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-container rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-outline-variant">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container overflow-hidden border-2 border-white shadow-sm shrink-0">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-xs sm:text-sm font-bold">
                    {profile.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                title="Terminar Sessão"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg sm:text-[22px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Responsive Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}