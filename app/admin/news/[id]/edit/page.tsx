import { notFound } from "next/navigation";
import Link from "next/link";
import NewsEditor from "@/components/admin/NewsEditor";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function EditAdminNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("news").select("id, title, excerpt, content, category, image_url, status, published_at").eq("id", id).maybeSingle();
  if (error || !data) notFound();
  return <section><div className="mb-7"><Link href="/admin/news" className="text-sm font-semibold text-secondary hover:underline">← Notícias</Link><p className="mb-2 mt-5 font-label-sm text-secondary">EDITORIAL</p><h1 className="text-3xl font-extrabold text-primary">Editar notícia</h1><p className="mt-2 text-on-surface-variant">Atualize o conteúdo e a publicação.</p></div><NewsEditor news={data} /></section>;
}
