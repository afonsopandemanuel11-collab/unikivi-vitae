"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { archiveNews } from "@/app/admin/news/actions";

type NewsItem = { id: string; title: string; category: string; status: string; published_at: string; created_at: string };
const categoryLabel: Record<string, string> = { PLATAFORMA: "Plataforma", COMUNIDADE: "Comunidade", INSTITUCIONAL: "Institucional" };
const statusLabel: Record<string, string> = { DRAFT: "Rascunho", PUBLISHED: "Publicada", ARCHIVED: "Arquivada" };

export default function NewsTable({ items }: { items: NewsItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const filtered = items.filter((item) => (status === "ALL" || item.status === status) && item.title.toLowerCase().includes(query.trim().toLowerCase()));
  function archive(id: string) {
    startTransition(async () => {
      const result = await archiveNews(id);
      if (result.success) router.refresh();
    });
  }
  return <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-[0_10px_30px_rgba(0,17,58,0.04)]">
    <div className="flex flex-col gap-3 border-b border-outline-variant bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-white px-3"><span aria-hidden="true" className="material-symbols-outlined text-outline">search</span><span className="sr-only">Pesquisar notícias</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar por título…" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" /></label>
      <label className="flex items-center gap-2 text-sm text-on-surface-variant"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-outline-variant bg-white px-3 py-2"><option value="ALL">Todos</option><option value="PUBLISHED">Publicadas</option><option value="DRAFT">Rascunhos</option><option value="ARCHIVED">Arquivadas</option></select></label>
    </div>
    {filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-outline-variant bg-white text-xs uppercase tracking-wide text-outline"><tr><th className="px-5 py-4">Título</th><th className="px-5 py-4">Categoria</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4">Data</th><th className="px-5 py-4 text-right">Ações</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-b border-outline-variant/70 last:border-0 hover:bg-surface-container-low/60"><td className="max-w-md px-5 py-4 font-semibold text-primary">{item.title}</td><td className="px-5 py-4 text-on-surface-variant">{categoryLabel[item.category] ?? item.category}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-800" : item.status === "DRAFT" ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}>{statusLabel[item.status] ?? item.status}</span></td><td className="px-5 py-4 text-on-surface-variant">{item.published_at.slice(0, 10)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={`/admin/news/${item.id}/edit`} className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-bold text-primary hover:border-primary">Editar</Link>{item.status !== "ARCHIVED" && <button type="button" onClick={() => archive(item.id)} disabled={pending} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">Arquivar</button>}</div></td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-on-surface-variant">{items.length ? "Nenhuma notícia corresponde aos filtros." : "Ainda não existem notícias registadas."}</p>}
    <p className="border-t border-outline-variant bg-surface-container-low px-5 py-3 text-xs text-on-surface-variant">A mostrar {filtered.length} de {items.length} notícias</p>
  </div>;
}
