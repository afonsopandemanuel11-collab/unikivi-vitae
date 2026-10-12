"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "Users", icon: "group", href: "/admin/users" },
  { label: "Profiles", icon: "badge", href: "/admin/profiles" },
  { label: "Resumes", icon: "description", href: "/admin/resumes" },
  { label: "Publications", icon: "library_books", href: "/admin/publications" },
  { label: "Projects", icon: "account_tree", href: "/admin/projects" },
  { label: "News", icon: "newspaper", href: "/admin/news" },
  { label: "Moderation", icon: "gavel", href: "/admin/moderation" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-background text-on-background">
      <nav className="h-screen w-64 fixed left-0 top-0 bg-primary flex flex-col py-6 px-4 z-50">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">school</span>
          </div>
          <div>
            <h1 className="font-headline-md text-on-primary font-bold">UNIKIVI Admin</h1>
            <p className="font-label-sm text-on-primary-fixed-variant opacity-80">Management Portal</p>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body-md transition-colors ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold"
                    : "text-on-primary-fixed-variant hover:bg-primary-container"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-4">
          <div className="space-y-1">
            <Link href="/admin/settings" className="flex items-center gap-3 text-on-primary-fixed-variant px-4 py-3 hover:bg-primary-container rounded-lg transition-colors">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-on-primary-fixed-variant px-4 py-3 hover:bg-primary-container rounded-lg transition-colors">
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-gutter">
          <div className="font-headline-md font-extrabold text-primary">UNIKIVI Vitae Admin</div>
        </header>
        <main className="flex-1 p-8 xl:p-12 max-w-container-max mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}