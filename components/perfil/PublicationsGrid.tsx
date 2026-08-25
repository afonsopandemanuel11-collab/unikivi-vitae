type Publication = {
  id: string;
  title: string;
  abstract: string | null;
  publication_type: string;
  year: number | null;
  journal: string | null;
  doi: string | null;
  url: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Artigo Científico",
  CONFERENCE: "Comunicação em Conferência",
  BOOK_CHAPTER: "Capítulo de Livro",
  BOOK: "Livro",
  THESIS: "Tese",
  REPORT: "Relatório",
  PREPRINT: "Preprint",
  OTHER: "Outro",
};
export default function PublicationsGrid({
  publicationAuthors,
}: {
  publicationAuthors: { publications: Publication | null }[];
}) {
  const publications = publicationAuthors
    .map((pa) => pa.publications)
    .filter((p): p is Publication => p !== null)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  if (publications.length === 0) return null;

  const preview = publications.slice(0, 4);

  return (
    <section>
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
        <h2 className="font-headline-md text-primary flex items-center gap-3 text-xl">
          <span className="material-symbols-outlined">menu_book</span>
          Produção Científica Recente
        </h2>
        {publications.length > 4 && (
          <span className="font-label-sm text-on-surface-variant">Ver Todas ({publications.length})</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {preview.map((pub) => (
          <article
            key={pub.id}
            className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-primary/30 hover:shadow-md transition-all group flex flex-col h-full ${
              pub.publication_type === "BOOK_CHAPTER" || pub.publication_type === "BOOK" ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex-grow">
              <span className="font-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded inline-block mb-3">
                {TYPE_LABELS[pub.publication_type] ?? pub.publication_type}
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors mb-2 leading-snug">
                {pub.title}
              </h3>
              {pub.journal && (
                <p className="font-body-md text-sm text-on-surface-variant italic mb-4">
                  {pub.journal}
                  {pub.year ? `. (${pub.year})` : ""}
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-surface-container-highest mt-auto flex justify-between items-center">
              {pub.doi && <span className="font-label-sm text-on-surface-variant">DOI: {pub.doi}</span>}
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-secondary p-2 rounded-full hover:bg-primary/5 transition-colors"
                  title="Abrir Link"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}