"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const PROFILE_TYPES = [
  { value: "", label: "Todos os tipos" },
  { value: "STUDENT", label: "Estudante" },
  { value: "TEACHER", label: "Docente" },
  { value: "RESEARCHER", label: "Investigador" },
  { value: "PROFESSIONAL", label: "Profissional" },
  { value: "TALENT", label: "Talento" },
];

export default function SearchBar({ areas }: { areas: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [nome, setNome] = useState(searchParams.get("nome") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  // Debounce: só atualiza o URL 400ms depois de o utilizador parar de escrever
  useEffect(() => {
    const timeout = setTimeout(() => updateParam("nome", nome), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-10">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Pesquisar por nome..."
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all"
        />
      </div>

      <select
        defaultValue={searchParams.get("tipo") ?? ""}
        onChange={(e) => updateParam("tipo", e.target.value)}
        className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md"
      >
        {PROFILE_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("area") ?? ""}
        onChange={(e) => updateParam("area", e.target.value)}
        className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md"
      >
        <option value="">Todas as áreas</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      {isPending && <span className="text-label-sm text-on-surface-variant self-center">A pesquisar...</span>}
    </div>
  );
}