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
    <section className="overflow-hidden bg-surface-container-low py-16 md:py-20">
      <div className="mx-auto mb-10 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
        <h2 className="mb-3 font-headline-lg text-2xl text-primary sm:text-3xl">Produção Científica em Destaque</h2>
        <p className="mx-auto max-w-3xl font-body-lg text-sm text-on-surface-variant sm:text-base">
          Descubra as mais recentes investigações, artigos e teses produzidos pela nossa comunidade académica.
        </p>
      </div>

      {!hasRealData ? (
        <div className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
          <div className="rounded-xl border border-outline-variant/70 bg-white px-6 py-10 text-center shadow-[0_12px_32px_rgba(0,17,58,0.05)]">
            <span className="material-symbols-outlined text-4xl text-primary/60">auto_stories</span>
            <h3 className="mt-3 font-headline-md text-lg font-bold text-primary">As publicações da comunidade estarão aqui</h3>
            <p className="mt-2 font-body-md text-sm text-on-surface-variant">Ainda não há produção científica pública para destacar. Explore o diretório ou registe o seu perfil académico.</p>
            <Link href="/registo" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90">
              Criar perfil académico <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      ) : (
      <div className="mx-auto flex max-w-container-max snap-x snap-mandatory gap-5 overflow-x-auto px-margin-mobile pb-5 md:gap-6 md:px-margin-desktop">
        {items.map((pub: any) => (
          <div
            key={pub.id}
            className="flex min-h-[230px] w-[min(88vw,920px)] shrink-0 snap-start flex-col rounded-xl border border-outline-variant/70 bg-white p-6 shadow-[0_12px_32px_rgba(0,17,58,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-[0_18px_40px_rgba(0,17,58,0.09)] sm:p-8 group"
          >
            {/* Type + Year */}
            <div className="mb-5 flex items-center gap-2.5">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[pub.publication_type] ?? "bg-gray-100 text-gray-700"}`}>
                {TYPE_LABELS[pub.publication_type] ?? pub.publication_type}
              </span>
              {pub.year && (
                <span className="font-label-sm text-xs text-on-surface-variant">{pub.year}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="mb-3 line-clamp-3 font-headline-md text-xl font-semibold leading-snug text-primary transition-colors group-hover:text-surface-tint sm:text-2xl">
              {pub.title}
            </h3>

            {/* Authors */}
            {pub.authors && (
              <p className="mb-3 truncate text-sm font-medium text-on-surface-variant">
                {pub.authors}
              </p>
            )}

            {/* Abstract */}
            {pub.abstract && (
              <p className="mb-4 line-clamp-3 flex-1 font-body-md text-sm leading-relaxed text-on-surface-variant sm:text-base">
                {pub.abstract}
              </p>
            )}

            {/* Journal */}
            {pub.journal && (
              <div className="mt-auto border-t border-outline-variant/50 pt-4">
                <span className="text-xs font-medium italic leading-relaxed text-on-surface-variant">{pub.journal}</span>
              </div>
            )}
          </div>
        ))}

        {/* CTA card */}
        <Link
          href="/pesquisa"
          className="flex min-h-[230px] w-[min(76vw,340px)] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-outline-variant/70 bg-white p-6 text-center shadow-[0_12px_32px_rgba(0,17,58,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(0,17,58,0.09)] group"
        >
          <span className="material-symbols-outlined mb-4 text-4xl text-primary/65 transition-transform group-hover:scale-105">
            science
          </span>
          <h3 className="mb-2 font-headline-md text-base font-semibold text-primary">
            Ver Toda a Produção
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Explore o repositório científico da UNIKIVI.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
            Explorar
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </Link>
      </div>
      )}

    </section>
  );
}
