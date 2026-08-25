"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const PROFILE_TYPES = [
  { value: "STUDENT", label: "Estudante" },
  { value: "TEACHER", label: "Docente" },
  { value: "RESEARCHER", label: "Investigador" },
  { value: "PROFESSIONAL", label: "Profissional" },
];

export default function FilterSidebar({ areas }: { areas: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const selectedTypes = searchParams.get("tipo")?.split(",").filter(Boolean) ?? [];
  const selectedArea = searchParams.get("area") ?? "";
  const totalActiveFilters = selectedTypes.length + (selectedArea ? 1 : 0);

  function toggleType(value: string) {
    const next = selectedTypes.includes(value)
      ? selectedTypes.filter((t) => t !== value)
      : [...selectedTypes, value];

    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) params.set("tipo", next.join(","));
    else params.delete("tipo");
    params.delete("limit");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setArea(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("area", value);
    else params.delete("area");
    params.delete("limit");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tipo");
    params.delete("area");
    params.delete("limit");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="md:col-span-4 lg:col-span-3 space-y-4">
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-white rounded-2xl border border-outline-variant p-4 shadow-xs">
        <button
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-primary font-bold text-sm"
        >
          <span className="material-symbols-outlined text-secondary">filter_list</span>
          <span>Filtros</span>
          {totalActiveFilters > 0 && (
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {totalActiveFilters}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="text-on-surface-variant hover:text-primary p-1 text-xs font-bold"
        >
          {mobileExpanded ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {/* Filter Body (always visible on >= md, toggleable on < md) */}
      <div
        className={`${
          mobileExpanded ? "block" : "hidden md:block"
        } bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-5 sm:p-6 shadow-sm sticky top-24 space-y-6`}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <h2 className="font-headline-md text-primary font-bold flex items-center gap-2 text-base sm:text-lg">
            <span className="material-symbols-outlined text-secondary">filter_list</span>
            <span>Filtros</span>
          </h2>
          {totalActiveFilters > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] font-bold text-secondary hover:underline cursor-pointer"
            >
              Limpar todos
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Tipo de Perfil */}
          <div>
            <h3 className="font-label-sm text-[11px] font-bold text-on-surface-variant mb-3 uppercase tracking-wider">
              Tipo de Perfil
            </h3>
            <div className="space-y-2">
              {PROFILE_TYPES.map((t) => (
                <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t.value)}
                    onChange={() => toggleType(t.value)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 accent-primary"
                  />
                  <span className="text-on-surface group-hover:text-primary transition-colors font-medium">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Área de Investigação */}
          <div>
            <h3 className="font-label-sm text-[11px] font-bold text-on-surface-variant mb-3 uppercase tracking-wider">
              Área Científica
            </h3>
            <select
              value={selectedArea}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary p-3"
            >
              <option value="">Todas as Áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}