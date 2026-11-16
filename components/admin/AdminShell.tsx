"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const BASE_NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Users", icon: "group", href: "/admin/users" },
  { label: "Profiles", icon: "badge", href: "/admin/profiles" },
  { label: "Resumes", icon: "description", href: "/admin/resumes" },
  { label: "Publications", icon: "library_books", href: "/admin/publications" },
  { label: "Projects", icon: "account_tree", href: "/admin/projects" },
  { label: "News", icon: "newspaper", href: "/admin/news" },
  { label: "Moderation", icon: "gavel", href: "/admin/moderation" },
];

const routeTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Gestão de Utilizadores",
  "/admin/profiles": "Perfis Institucionais",
  "/admin/resumes": "Currículos",
  "/admin/publications": "Publicações",
  "/admin/projects": "Projetos",
  "/admin/news": "Notícias & Anúncios",
  "/admin/moderation": "Fila de Validação Institucional",
  "/admin/settings": "Definições",
  "/admin/api": "Gerador de Acesso & API Institucional",
};

export default function AdminShell({
  children,
  canManageApi = false,
}: {
  children: React.ReactNode;
  canManageApi?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = canManageApi
    ? [...BASE_NAV_ITEMS, { label: "API & Integrações", icon: "hub", href: "/admin/api" }]
    : BASE_NAV_ITEMS;

  const currentSectionTitle = routeTitles[pathname] ?? "Administração";

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function renderNavContent(mobile = false) {
    return (
      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="mb-6 flex items-center gap-3 px-2">
            <Image src="/logo.png" alt="UNIKIVI Vitae" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
            <div>
              <h1 className="font-headline-md text-base font-bold text-white">UNIKIVI Vitae</h1>
              <p className="font-label-sm text-xs text-primary-fixed-dim/80">Portal de Administração</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Navegação administrativa" className="space-y-1 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => mobile && setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-150 ${
                    active
                      ? "bg-secondary-container font-bold text-on-secondary-container shadow-sm"
                      : "text-primary-fixed-dim/75 hover:bg-primary-container hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[20px]"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body-md text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with AI CTA & Controls */}
        <div className="mt-4 pt-2">
          {/* AI CTA Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="ai-shimmer w-full flex items-center justify-center gap-2 rounded-lg bg-secondary-container px-3.5 py-2.5 font-bold text-on-secondary-container shadow-[0_0_15px_rgba(0,238,252,0.3)] transition-all hover:shadow-[0_0_20px_rgba(0,238,252,0.5)] active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span className="font-label-sm text-xs font-semibold">✨ Perguntar à IA</span>
            </button>
          </div>

          <div className="space-y-1 border-t border-outline-variant/20 pt-3">
            <Link
              href="/dashboard"
              onClick={() => mobile && setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2 text-xs font-medium text-primary-fixed-dim/75 transition-colors hover:bg-primary-container hover:text-white"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Voltar ao meu painel</span>
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                pathname === "/admin/settings"
                  ? "bg-secondary-container font-bold text-on-secondary-container"
                  : "text-primary-fixed-dim/75 hover:bg-primary-container hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-left text-xs font-medium text-primary-fixed-dim/75 transition-colors hover:bg-primary-container hover:text-white disabled:opacity-60"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">logout</span>
              <span>{loggingOut ? "A terminar…" : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background lg:flex">
      {/* SideNavBar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/40 bg-primary px-4 py-6 text-on-primary lg:flex">
        {renderNavContent(false)}
      </aside>

      {/* Main Container */}
      <div className="min-w-0 flex-1 lg:ml-64">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/60 bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              className="rounded-lg p-2 text-primary hover:bg-surface-container lg:hidden"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>

            {/* Search Input in TopNavBar */}
            <div className="relative hidden w-full max-w-xs md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-outline-variant/40 bg-surface-container-low py-1.5 pl-9 pr-4 text-xs font-body-md text-on-surface outline-none transition-all placeholder:text-outline focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary-container"
              />
            </div>

            <div className="ml-2 hidden items-center gap-2 font-headline-md text-base font-extrabold tracking-tight text-primary xl:flex">
              <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
              <span>UNIKIVI Vitae</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Notificações"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary-container"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-white"></span>
            </button>

            <button
              type="button"
              title="Ajuda & Suporte"
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary-container"
            >
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>

            <div className="mx-1 h-6 w-px bg-outline-variant/50"></div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary-container/40 bg-primary-container text-xs font-bold text-secondary-container shadow-sm">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <p className="font-headline-md text-xs font-semibold leading-tight text-primary">
                  Administrador
                </p>
                <p className="font-label-sm text-[10px] text-outline">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="flex h-full w-72 flex-col bg-primary p-6 text-white shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="rounded-lg p-2 hover:bg-primary-container"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{renderNavContent(true)}</div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* AI Assistant Modal Simulator */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setAiModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-primary">Assistente IA UNIKIVI</h3>
                <p className="text-xs text-on-surface-variant">Pergunte sobre métricas, utilizadores ou moderação</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 text-xs text-on-surface-variant">
              💡 Exemplos de perguntas:
              <ul className="mt-2 space-y-1 text-primary">
                <li>• &quot;Quantos investigadores foram registados este mês?&quot;</li>
                <li>• &quot;Quais perfis aguardam validação prioritária?&quot;</li>
                <li>• &quot;Resumo da produção científica indexada recentemente&quot;</li>
              </ul>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Escreva a sua dúvida aqui..."
                className="flex-1 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container"
              />
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-container"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

