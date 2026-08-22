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
];

function getStatusBadge(status: DashboardShellProps["profile"]["status"]) {
  if (status === "ACTIVE") {
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/20 rounded-full text-xs font-medium font-label-sm">
        <span className="material-symbols-outlined text-sm">check_circle</span>
        Verificado
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 px-3 py-1 bg-surface-container text-on-surface-variant border border-outline-variant rounded-full text-xs font-medium font-label-sm">
      <span className="material-symbols-outlined text-sm">cancel</span>
      Nao verificado
    </span>
  );
}

export default function DashboardShell({ children, profile }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-background text-primary">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-outline-variant fixed h-screen overflow-y-auto z-30 flex flex-col justify-between">
        <div>
          <div className="p-8">
            <h1 className="text-xl font-bold font-headline-md tracking-tight text-primary">
              UNIKIVI <span className="text-primary/70">Vitae</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">
              PLATAFORMA ACADEMICA
            </p>
          </div>

          <nav className="px-4 space-y-8">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <h2 className="px-4 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                  {group.label}
                </h2>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                            isActive
                              ? "bg-primary text-white shadow-lg"
                              : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="pt-4 px-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                <span className="text-secondary-container">✨</span>
                Perfil Copilot
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-outline-variant/40 mt-8 mb-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>{loggingOut ? "A terminar sessão..." : "Terminar Sessão"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-12 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-headline-md">
              Ola, {profile.full_name.split(" ")[0]}
            </h2>
            {getStatusBadge(profile.status)}
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-container rounded-full border-2 border-white" />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border-2 border-white shadow-sm">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm font-bold">
                    {profile.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                title="Terminar Sessão"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer ml-1"
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}