"use client";

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

  const selectedTypes = searchParams.get("tipo")?.split(",").filter(Boolean) ?? [];

  function toggleType(value: string) {
    const next = selectedTypes.includes(value)
      ? selectedTypes.filter((t) => t !== value)
      : [...selectedTypes, value];

    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) params.set("tipo", next.join(","));
    else params.delete("tipo");
    params.delete("limit"); // recomeça a paginação sempre que o filtro muda
    router.push(`${pathname}?${params.toString()}`);
  }

  function setArea(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("area", value);
    else params.delete("area");
    params.delete("limit");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="md:col-span-3 space-y-6">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sticky top-24">
        <h2 className="font-headline-md text-primary mb-6 flex items-center gap-2 text-xl">
          <span className="material-symbols-outlined">filter_list</span>
          Filtros
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">
              Tipo de Perfil
            </h3>
            <div className="space-y-2">
              {PROFILE_TYPES.map((t) => (
                <label key={t.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t.value)}
                    onChange={() => toggleType(t.value)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">Área</h3>
            <select
              defaultValue={searchParams.get("area") ?? ""}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-surface border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-primary focus:border-primary p-2.5"
            >
              <option value="">Todas as Áreas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}