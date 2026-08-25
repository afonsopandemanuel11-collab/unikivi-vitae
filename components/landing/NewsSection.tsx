import { createClient } from "@/lib/supabase/server";

const CATEGORY_STYLES: Record<string, string> = {
  PLATAFORMA: "bg-secondary-fixed/20 text-on-secondary-fixed",
  COMUNIDADE: "bg-primary-fixed/50 text-on-primary-fixed",
  INSTITUCIONAL: "bg-tertiary-fixed/50 text-on-tertiary-fixed",
};

const CATEGORY_LABELS: Record<string, string> = {
  PLATAFORMA: "Plataforma",
  COMUNIDADE: "Comunidade",
  INSTITUCIONAL: "Institucional",
};

export default async function NewsSection() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("id, title, excerpt, category, image_url, published_at")
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false })
    .limit(3);

  if (!news || news.length === 0) return null;

  return (
    <section className="py-section-gap bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-headline-lg text-primary text-3xl md:text-4xl">Notícias e Novidades</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="flex flex-col group cursor-pointer">
              <div className="aspect-video bg-surface-container rounded-xl mb-4 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-variant" />
                )}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[item.category] ?? "bg-surface-container text-on-surface-variant"}`}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
                <span className="text-xs text-on-surface-variant font-label-sm">
                  {new Date(item.published_at).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
              <h3 className="font-headline-md text-xl text-primary font-bold mb-2 group-hover:text-surface-tint transition-colors">
                {item.title}
              </h3>
              {item.excerpt && <p className="font-body-md text-on-surface-variant line-clamp-2">{item.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}