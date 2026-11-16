import Link from "next/link";
import NewsEditor from "@/components/admin/NewsEditor";

export default function NewAdminNewsPage() {
  return <section><div className="mb-7"><Link href="/admin/news" className="text-sm font-semibold text-secondary hover:underline">← Notícias</Link><p className="mb-2 mt-5 font-label-sm text-secondary">EDITORIAL</p><h1 className="text-3xl font-extrabold text-primary">Criar notícia</h1><p className="mt-2 text-on-surface-variant">Prepare o conteúdo e escolha quando deve ficar visível.</p></div><NewsEditor /></section>;
}
