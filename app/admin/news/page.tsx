import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import NewsTable from "@/components/admin/NewsTable";

export default async function AdminNewsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, category, status, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = data ?? [];
  const published = rows.filter((item) => item.status === "PUBLISHED").length;
  const drafts = rows.filter((item) => item.status === "DRAFT").length;

  return <section>
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="mb-2 font-label-sm text-secondary">COMUNICAÇÃO INSTITUCIONAL</p><h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Notícias e anúncios</h1><p className="mt-2 max-w-2xl text-on-surface-variant">Gira atualizações institucionais e conteúdos da comunidade.</p></div>
      <Link href="/admin/news/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-container"><span aria-hidden="true" className="material-symbols-outlined">add</span>Nova notícia</Link>
    </header>
    <div className="mb-6 grid gap-4 sm:grid-cols-3">{[{ label: "Total listado", value: rows.length, icon: "newspaper" }, { label: "Publicadas", value: published, icon: "task_alt" }, { label: "Rascunhos", value: drafts, icon: "edit_note" }].map((item) => <article key={item.label} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_8px_24px_rgba(0,17,58,0.04)]"><span className="material-symbols-outlined rounded-lg bg-primary-fixed p-2 text-primary">{item.icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-wide text-outline">{item.label}</p><p className="mt-1 text-3xl font-extrabold text-primary">{item.value}</p></article>)}</div>
    {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">Não foi possível carregar as notícias.</div> : <NewsTable items={rows} />}
  </section>;
}
