// components/landing/PublicProfilesCarousel.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_PROFILES = [
  {
    id: "f1",
    initials: "AP",
    name: "Afonso Pande Manuel",
    role: "Investigador · Informática",
    bio: "Especialista em desenvolvimento de software e sistemas de informação académicos.",
    tags: ["Software", "IA"],
    pubs: 8,
    projects: 3,
    verified: true,
    photo_url: null,
  },
  {
    id: "f2",
    initials: "CC",
    name: "Celeste Maquiesse Canga",
    role: "Docente · Ciências Jurídicas",
    bio: "Docência e investigação em Direito Público e Governança Institucional.",
    tags: ["Direito", "Governança"],
    pubs: 12,
    projects: 4,
    verified: true,
    photo_url: null,
  },
  {
    id: "f3",
    initials: "MK",
    name: "Maria Kimpa Vita",
    role: "Investigadora · Economia",
    bio: "Investigação em desenvolvimento económico e políticas públicas em Angola.",
    tags: ["Economia", "Políticas"],
    pubs: 15,
    projects: 6,
    verified: true,
    photo_url: null,
  },
];

export default async function PublicProfilesCarousel() {
  const supabase = await createClient();

  const { data: dbProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, professional_name, photo_url, bio, position:positions(name), profile_skills(skills(name)), education(degree, institution)")
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(5);

  const hasRealData = dbProfiles && dbProfiles.length > 0;

  return (
    <section className="py-section-gap bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-primary text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Profissionais em Destaque
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Explore perfis de investigadores, docentes e estudantes da nossa comunidade.
        </p>
      </div>

      <div className="flex gap-5 overflow-x-auto px-margin-mobile md:px-margin-desktop pb-6 snap-x snap-mandatory max-w-container-max mx-auto">
        {hasRealData
          ? dbProfiles.map((p: any) => {
              const name = p.professional_name || p.full_name;
              const pos = Array.isArray(p.position) ? p.position[0] : p.position;
              const tags = (p.profile_skills ?? [])
                .map((ps: any) => {
                  const skill = Array.isArray(ps.skills) ? ps.skills[0] : ps.skills;
                  return skill?.name;
                })
                .filter(Boolean)
                .slice(0, 3);
              const initials = name
                .split(" ")
                .slice(0, 2)
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();

              return (
                <Link
                  key={p.id}
                  href={`/perfil/${p.id}`}
                  className="min-w-[280px] sm:min-w-[320px] snap-start shrink-0 bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-outline-variant shadow-sm shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-md text-primary font-bold text-base truncate group-hover:text-surface-tint transition-colors">
                          {name}
                        </span>
                        <span className="material-symbols-outlined text-secondary text-base shrink-0">verified</span>
                      </div>
                      {pos?.name && (
                        <span className="text-xs text-on-surface-variant truncate block mt-0.5">{pos.name}</span>
                      )}
                    </div>
                  </div>

                  {p.bio && (
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4 flex-1">{p.bio}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tags.map((tag: string) => (
                        <span key={tag} className="bg-surface-container text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-outline-variant/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50 text-xs text-on-surface-variant">
                    <span>Ver perfil completo</span>
                    <span className="material-symbols-outlined text-primary text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>
              );
            })
          : FALLBACK_PROFILES.map((p) => (
              <div
                key={p.id}
                className="min-w-[280px] sm:min-w-[320px] snap-start shrink-0 bg-white border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {p.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline-md text-primary font-bold text-base truncate">{p.name}</span>
                      {p.verified && <span className="material-symbols-outlined text-secondary text-base shrink-0">verified</span>}
                    </div>
                    <span className="text-xs text-on-surface-variant truncate block mt-0.5">{p.role}</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4 flex-1">{p.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((tag) => (
                    <span key={tag} className="bg-surface-container text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-outline-variant/40">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between pt-3 border-t border-outline-variant/50 text-xs text-on-surface-variant">
                  <span><strong className="text-primary">{p.pubs}</strong> Publicações</span>
                  <span><strong className="text-primary">{p.projects}</strong> Projetos</span>
                </div>
              </div>
            ))}

        {/* CTA card */}
        <Link
          href="/pesquisa"
          className="min-w-[260px] snap-start shrink-0 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col justify-center items-center text-center group hover:border-primary hover:bg-primary/5 transition-all"
        >
          <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">
            search
          </span>
          <h3 className="font-headline-md text-base font-bold text-primary mb-2">Ver Todos os Perfis</h3>
          <p className="font-body-md text-xs text-on-surface-variant mb-4">
            Pesquise em todo o diretório da UNIKIVI.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            Explorar
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
