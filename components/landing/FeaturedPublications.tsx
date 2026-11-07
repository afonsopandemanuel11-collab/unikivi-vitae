// components/landing/FeaturedPublications.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Artigo Científico",
  CONFERENCE: "Conferência",
  BOOK_CHAPTER: "Capítulo de Livro",
  BOOK: "Livro",
  THESIS: "Tese",
  REPORT: "Relatório",
  PREPRINT: "Preprint",
  OTHER: "Outro",
};

const TYPE_COLORS: Record<string, string> = {
  ARTICLE: "bg-violet-100 text-violet-800",
  CONFERENCE: "bg-blue-100 text-blue-800",
  BOOK_CHAPTER: "bg-amber-100 text-amber-800",
  BOOK: "bg-emerald-100 text-emerald-800",
  THESIS: "bg-rose-100 text-rose-800",
  REPORT: "bg-slate-100 text-slate-700",
  PREPRINT: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-700",
};

export default async function FeaturedPublications() {
  const supabase = await createClient();

  const { data: publications } = await supabase
    .from("publications")
    .select("id, title, abstract, publication_type, year, journal, publication_authors(author_order, external_name, profiles(full_name))")
    .eq("status", "PUBLISHED")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  const hasRealData = publications && publications.length > 0;

  const items = hasRealData
    ? publications.map((pub: any) => {
        const authors = [...(pub.publication_authors ?? [])]
          .sort((a: any, b: any) => a.author_order - b.author_order)
          .map((a: any) => {
            const prof = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
            return prof?.full_name ?? a.external_name;
          })
          .filter(Boolean)
          .join(", ");
        return { ...pub, authors };
      })
    : [];

  return (
    <section className="py-section-gap bg-surface-container-low overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-primary mb-4 text-3xl md:text-4xl">Produção Científica em Destaque</h2>
        <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto">
          Descubra as mais recentes investigações, artigos e teses produzidos pela nossa comunidade académica.
        </p>
      </div>

      {!hasRealData ? (
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest px-6 py-10 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-primary/60">auto_stories</span>
            <h3 className="mt-3 font-headline-md text-lg font-bold text-primary">As publicações da comunidade estarão aqui</h3>
            <p className="mt-2 font-body-md text-sm text-on-surface-variant">Ainda não há produção científica pública para destacar. Explore o diretório ou registe o seu perfil académico.</p>
            <Link href="/registo" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90">
              Criar perfil académico <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      ) : (
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto">
        {items.map((pub: any) => (
          <div
            key={pub.id}
            className="min-w-[300px] md:min-w-[400px] snap-start shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all p-6 flex flex-col hover:-translate-y-1 group"
          >
            {/* Type + Year */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${TYPE_COLORS[pub.publication_type] ?? "bg-gray-100 text-gray-700"}`}>
                {TYPE_LABELS[pub.publication_type] ?? pub.publication_type}
              </span>
              {pub.year && (
                <span className="text-xs text-on-surface-variant font-label-sm">{pub.year}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-headline-md text-lg text-primary font-bold mb-3 leading-snug group-hover:text-surface-tint transition-colors line-clamp-3">
              {pub.title}
            </h3>

            {/* Authors */}
            {pub.authors && (
              <p className="text-xs text-on-surface-variant font-semibold mb-3 truncate">
                {pub.authors}
              </p>
            )}

            {/* Abstract */}
            {pub.abstract && (
              <p className="font-body-md text-sm text-on-surface-variant mb-4 line-clamp-3 leading-relaxed flex-1">
                {pub.abstract}
              </p>
            )}

            {/* Journal */}
            {pub.journal && (
              <div className="mt-auto pt-4 border-t border-outline-variant/30">
                <span className="text-xs font-medium text-on-surface-variant italic">{pub.journal}</span>
              </div>
            )}
          </div>
        ))}

        {/* CTA card */}
        <Link
          href="/pesquisa"
          className="min-w-[260px] md:min-w-[300px] snap-start shrink-0 bg-primary rounded-2xl p-6 flex flex-col justify-center items-center text-center group hover:bg-primary/90 transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-5xl text-white/60 mb-4 group-hover:scale-110 transition-transform">
            science
          </span>
          <h3 className="font-headline-md text-lg font-bold text-white mb-2">
            Ver Toda a Produção
          </h3>
          <p className="font-body-md text-sm text-white/70">
            Explore o repositório científico da UNIKIVI.
          </p>
          <div className="mt-6 flex items-center gap-2 text-white font-bold text-sm">
            Explorar
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </Link>
      </div>
      )}

    </section>
  );
}
