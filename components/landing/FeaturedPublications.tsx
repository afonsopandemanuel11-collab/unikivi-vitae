import { createClient } from "@/lib/supabase/server";
const TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Artigo Científico",
  CONFERENCE: "Conferência",
  BOOK_CHAPTER: "Capítulo de Livro",
  BOOK: "Livro",
  THESIS: "Tese de Mestrado/Doutoramento",
  REPORT: "Relatório",
  PREPRINT: "Preprint",
  OTHER: "Outro",
};
function formatMonthYear(year: number | null) {
  return year ? String(year) : "";
}

export default async function FeaturedPublications() {
  const supabase = await createClient();

  const { data: publications } = await supabase
    .from("publications")
    .select("id, title, abstract, publication_type, year, journal, publication_authors(author_order, external_name, profiles(full_name))")
    .eq("status", "PUBLISHED")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section className="py-section-gap bg-surface-container-low overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-primary mb-4 text-3xl md:text-4xl">Produção Científica em Destaque</h2>
        <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto">
          Descubra as mais recentes investigações, artigos e teses produzidos pela nossa comunidade académica.
        </p>
      </div>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto">
        {(publications ?? []).map((pub: any) => {
          const authors = [...(pub.publication_authors ?? [])]
            .sort((a, b) => a.author_order - b.author_order)
            .map((a) => {
              const prof = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
              return prof?.full_name ?? a.external_name;
            })
            .filter(Boolean)
            .join(", ");
          return (
            <div
              key={pub.id}
              className="min-w-[300px] md:min-w-[380px] snap-start shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary-fixed/20 text-on-secondary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {TYPE_LABELS[pub.publication_type] ?? pub.publication_type}
                </span>
                <span className="text-xs text-on-surface-variant font-label-sm">{formatMonthYear(pub.year)}</span>
              </div>
              <h3 className="font-headline-md text-xl text-primary font-bold mb-3">{pub.title}</h3>
              {authors && <p className="font-label-sm text-on-surface-variant mb-4">{authors}</p>}
              {pub.abstract && (
                <p className="font-body-md text-on-surface-variant mb-6 line-clamp-3">{pub.abstract}</p>
              )}
              {pub.journal && (
                <div className="mt-auto pt-4 border-t border-outline-variant/20">
                  <span className="text-xs font-medium text-on-surface-variant">{pub.journal}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}