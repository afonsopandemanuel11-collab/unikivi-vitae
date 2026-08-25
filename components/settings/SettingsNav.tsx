"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const GROUPS = [
  {
    label: "GERAL",
    items: [
      { label: "Conta", icon: "manage_accounts", href: "/dashboard/definicoes/conta" },
      { label: "Perfil Publico", icon: "person", href: "/dashboard/definicoes/perfil-publico" },
      { label: "Curriculos", icon: "description", href: "/dashboard/definicoes/curriculos" },
    ],
  },
  {
    label: "AVANCADO",
    items: [
      { label: "Zona de Perigo", icon: "warning", href: "/dashboard/definicoes/zona-de-perigo" },
    ],
  },
];

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <h2 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase px-3 mb-2">
            {group.label}
          </h2>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-surface-container-low text-primary font-medium"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}