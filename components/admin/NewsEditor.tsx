"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createNews, updateNews } from "@/app/admin/news/actions";

type NewsRecord = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  status: string;
  published_at: string;
};

const categoryLabels: Record<string, string> = {
  PLATAFORMA: "Plataforma",
  COMUNIDADE: "Comunidade",
  INSTITUCIONAL: "Institucional",
};

export default function NewsEditor({ news }: { news?: NewsRecord }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(news);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = news ? await updateNews(news.id, data) : await createNews(data);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/admin/news");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5 rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sm:p-7">
        <label className="block"><span className="mb-2 block text-sm font-bold text-primary">Título</span><input name="title" required maxLength={180} defaultValue={news?.title ?? ""} placeholder="Escreva um título claro e informativo" className="w-full rounded-xl border border-outline-variant px-4 py-3 text-lg outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold text-primary">Resumo</span><textarea name="excerpt" maxLength={280} rows={3} defaultValue={news?.excerpt ?? ""} placeholder="Uma breve apresentação para a página inicial" className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm leading-6 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold text-primary">Conteúdo</span><textarea name="content" maxLength={50000} rows={16} defaultValue={news?.content ?? ""} placeholder="Escreva o conteúdo da notícia…" className="w-full resize-y rounded-xl border border-outline-variant px-4 py-3 text-sm leading-6 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
      </div>
      <aside className="h-fit space-y-5 rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sm:p-6">
        <div><p className="font-label-sm text-outline">ESTADO</p><label className="mt-2 block"><span className="sr-only">Estado da notícia</span><select name="status" defaultValue={news?.status ?? "DRAFT"} className="w-full rounded-xl border border-outline-variant bg-white px-3 py-3 text-sm"><option value="DRAFT">Rascunho</option><option value="PUBLISHED">Publicada</option><option value="ARCHIVED">Arquivada</option></select></label></div>
        <div><p className="font-label-sm text-outline">CATEGORIA</p><label className="mt-2 block"><span className="sr-only">Categoria</span><select name="category" defaultValue={news?.category ?? "INSTITUCIONAL"} className="w-full rounded-xl border border-outline-variant bg-white px-3 py-3 text-sm">{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <label className="block"><span className="mb-2 block text-sm font-bold text-primary">Data de publicação</span><input type="date" name="published_at" defaultValue={news?.published_at.slice(0, 10) ?? ""} className="w-full rounded-xl border border-outline-variant px-3 py-3 text-sm" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold text-primary">Imagem de capa</span><input type="url" name="image_url" defaultValue={news?.image_url ?? ""} placeholder="https://…" className="w-full rounded-xl border border-outline-variant px-3 py-3 text-sm outline-none focus:border-secondary" /><span className="mt-1.5 block text-xs leading-5 text-on-surface-variant">Use um endereço HTTPS público para a imagem.</span></label>
        <div className="border-t border-outline-variant pt-4"><button disabled={pending} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-container disabled:opacity-60">{pending ? "A guardar…" : editing ? "Guardar notícia" : "Criar notícia"}</button><button type="button" onClick={() => router.push("/admin/news")} className="mt-2 w-full rounded-xl border border-outline-variant px-4 py-3 text-sm font-semibold text-primary hover:bg-surface-container-low">Cancelar</button></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      </aside>
    </form>
  );
}
