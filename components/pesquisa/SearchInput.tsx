"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [nome, setNome] = useState(searchParams.get("nome") ?? "");

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (nome) params.set("nome", nome);
    else params.delete("nome");
    params.delete("limit");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4 shadow-[0_10px_20px_rgba(0,0,0,0.04)] flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <span className="material-symbols-outlined text-outline ml-2 mr-3 text-2xl">search</span>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Pesquisar por nome, área, instituição ou palavra-chave..."
        className="w-full bg-transparent border-none font-body-md text-on-surface focus:ring-0 p-0 placeholder-on-surface-variant/50 h-10"
      />
      <button
        onClick={handleSearch}
        className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm hover:bg-primary-container hover:text-on-primary-container transition-colors ml-4 whitespace-nowrap"
      >
        Procurar
      </button>
    </div>
  );
}