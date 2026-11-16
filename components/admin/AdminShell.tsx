"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const BASE_NAV_ITEMS = [
  { label: "Visão geral", icon: "dashboard", href: "/admin" },
  { label: "Utilizadores", icon: "group", href: "/admin/users" },
  { label: "Perfis", icon: "badge", href: "/admin/profiles" },
  { label: "Currículos", icon: "description", href: "/admin/resumes" },
  { label: "Publicações", icon: "library_books", href: "/admin/publications" },
  { label: "Projetos", icon: "account_tree", href: "/admin/projects" },
  { label: "Notícias", icon: "newspaper", href: "/admin/news" },
  { label: "Validação", icon: "gavel", href: "/admin/moderation" },
];

const routeTitles: Record<string, string> = {
  "/admin": "Visão geral",
  "/admin/users": "Gestão de utilizadores",
  "/admin/profiles": "Perfis institucionais",
  "/admin/resumes": "Currículos",
  "/admin/publications": "Publicações",
  "/admin/projects": "Projetos",
  "/admin/news": "Notícias e comunicados",
  "/admin/moderation": "Fila de validação",
  "/admin/settings": "Definições",
  "/admin/api": "API e integrações",
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
  const navItems = canManageApi
    ? [...BASE_NAV_ITEMS, { label: "API e integrações", icon: "api", href: "/admin/api" }]
    : BASE_NAV_ITEMS;
  const title = routeTitles[pathname] ?? "Administração";

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function navigation(mobile = false) {
    return (
      <>
        <div className="mb-8 flex items-center gap-3 px-2">
          <Image src="/logo.png" alt="" width={42} height={42} className="h-10 w-10 rounded-xl bg-white object-contain p-1" />
          <div>
            <p className="font-headline-md text-lg font-bold text-white">UNIKIVI Admin</p>
            <p className="text-xs text-blue-200/80">Portal de gestão</p>
          </div>
        </div>
        <nav aria-label="Navegação administrativa" className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors ${active ? "bg-secondary-container font-bold text-on-secondary-container" : "text-blue-100/75 hover:bg-primary-container hover:text-white"}`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-5 border-t border-white/15 pt-4">
          <Link href="/admin/settings" onClick={() => mobile && setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors ${pathname === "/admin/settings" ? "bg-secondary-container font-bold text-on-secondary-container" : "text-blue-100/75 hover:bg-primary-container hover:text-white"}`}>
            <span aria-hidden="true" className="material-symbols-outlined text-xl">settings</span>Definições
          </Link>
          <button type="button" onClick={handleLogout} disabled={loggingOut} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm text-blue-100/75 transition-colors hover:bg-primary-container hover:text-white disabled:opacity-60">
            <span aria-hidden="true" className="material-symbols-outlined text-xl">logout</span>{loggingOut ? "A terminar sessão…" : "Terminar sessão"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-primary px-4 py-6 lg:flex">
        {navigation()}
      </aside>
      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} className="rounded-lg p-2 text-primary hover:bg-surface-container lg:hidden">
              <span aria-hidden="true" className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
            <div><p className="hidden text-[11px] font-bold uppercase tracking-[0.14em] text-outline sm:block">UNIKIVI Vitae</p><h1 className="font-headline-md text-base font-bold text-primary sm:text-lg">{title}</h1></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant sm:gap-3">
            <span className="hidden rounded-full bg-surface-container-low px-3 py-2 sm:inline-flex sm:items-center sm:gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Área administrativa</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-primary"><span aria-hidden="true" className="material-symbols-outlined">admin_panel_settings</span></span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-primary p-5 text-white lg:hidden"><div className="mb-5 flex justify-end"><button type="button" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="rounded-lg p-2 hover:bg-primary-container"><span aria-hidden="true" className="material-symbols-outlined">close</span></button></div><div className="flex h-[calc(100%-3rem)] flex-col">{navigation(true)}</div></div>}
    </div>
  );
}
