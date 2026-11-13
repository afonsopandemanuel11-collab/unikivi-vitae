// components/landing/NewsSection.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import NewsImage from "@/components/landing/NewsImage";

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

// Fallback images by category when image_url is null
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  INSTITUCIONAL: "/images/carousel/c (10).jpg",
  COMUNIDADE: "/images/carousel/c (4).jpg",
  PLATAFORMA: "/images/carousel/c (9).jpg",
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
          <div>
            <h2 className="font-headline-lg text-primary text-3xl md:text-4xl">Notícias e Novidades</h2>
            <p className="font-body-lg text-on-surface-variant mt-2 max-w-xl">
              Acompanhe as últimas novidades da Universidade Kimpa Vita.
            </p>
          </div>
          <Link
            href="/sobre"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Ver todas
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {news.map((item) => {
            const imgSrc = item.image_url || CATEGORY_FALLBACK_IMAGES[item.category] || "/images/carousel/c (10).jpg";
            return (
              <article key={item.id} className="flex flex-col group rounded-2xl border border-outline-variant/70 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-video rounded-xl mb-4 overflow-hidden border border-outline-variant/70 bg-surface-container">
                  <NewsImage
                    src={imgSrc}
                    fallbackSrc={CATEGORY_FALLBACK_IMAGES[item.category] || "/images/carousel/c (10).jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="px-2 pb-2 flex flex-1 flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${CATEGORY_STYLES[item.category] ?? "bg-surface-container text-on-surface-variant"}`}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </span>
                  <span className="text-xs text-on-surface-variant font-label-sm">
                    {new Date(item.published_at).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-headline-md text-lg text-primary font-bold mb-2 group-hover:text-surface-tint transition-colors leading-snug">
                  {item.title}
                </h3>

                {item.excerpt && (
                  <p className="font-body-md text-on-surface-variant text-sm line-clamp-2 leading-relaxed flex-1">
                    {item.excerpt}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Ler mais
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
