// components/landing/PublicProfilesCarousel.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicProfilesCarousel() {
  const supabase = await createClient();

  const { data: dbProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, professional_name, photo_url, bio, views_count, position:positions(name), profile_skills(skills(name)), education(degree, institution)")
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .order("views_count", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(5);

  const hasRealData = dbProfiles && dbProfiles.length > 0;

  return (
    <section className="overflow-hidden bg-surface-container-lowest py-16 md:py-20">
      <div className="mx-auto mb-10 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
        <h2 className="mb-3 font-headline-lg text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Perfis mais visitados
        </h2>
        <p className="mx-auto max-w-2xl font-body-lg text-sm text-on-surface-variant sm:text-base">
          Conheça os perfis públicos que despertam mais interesse na comunidade académica.
        </p>
      </div>

      <div className="mx-auto flex max-w-container-max snap-x snap-mandatory gap-5 overflow-x-auto px-margin-mobile pb-5 md:gap-6 md:px-margin-desktop">
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
                  className="flex h-[194px] w-[268px] shrink-0 snap-start flex-col rounded-xl border border-outline-variant/70 bg-white p-4 shadow-[0_10px_28px_rgba(0,17,58,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-outline-variant hover:shadow-[0_16px_36px_rgba(0,17,58,0.09)] group"
                >
                  <div className="mb-2 flex min-w-0 items-center gap-3">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={name} className="h-11 w-11 shrink-0 rounded-full border border-outline-variant/70 object-cover" />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-headline-md text-sm font-semibold text-primary transition-colors group-hover:text-surface-tint">
                          {name}
                        </span>
                        <span className="material-symbols-outlined shrink-0 text-sm text-secondary">verified</span>
                      </div>
                      {pos?.name && (
                        <span className="text-xs text-on-surface-variant truncate block mt-0.5">{pos.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-1 flex items-center gap-1 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>{new Intl.NumberFormat("pt-PT").format(p.views_count ?? 0)} visitas</span>
                  </div>

                  {p.bio && (
                    <p className="mb-1.5 line-clamp-2 flex-1 text-[11px] leading-relaxed text-on-surface-variant">{p.bio}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="mb-1.5 flex max-h-5 flex-nowrap gap-1.5 overflow-hidden">
                      {tags.map((tag: string) => (
                        <span key={tag} className="shrink-0 truncate rounded-full border border-outline-variant/40 bg-surface-container px-2 py-0.5 text-[9px] font-semibold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-outline-variant/50 pt-2 text-[11px] text-on-surface-variant">
                    <span>Ver perfil completo</span>
                    <span className="material-symbols-outlined text-base text-primary transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </Link>
              );
            })
          : <div className="flex h-[194px] w-[268px] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-outline-variant/70 bg-white p-5 text-center shadow-[0_10px_28px_rgba(0,17,58,0.05)]">
              <span className="material-symbols-outlined text-4xl text-primary/60">person_search</span>
              <h3 className="mt-3 font-headline-md text-base font-bold text-primary">Perfis em atualização</h3>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">Quando houver perfis públicos, serão apresentados aqui.</p>
            </div>}

        {/* CTA card */}
        <Link
          href="/pesquisa"
          className="flex h-[194px] w-[268px] shrink-0 snap-start flex-col items-center justify-center rounded-xl border border-outline-variant/70 bg-surface-container-low p-5 text-center shadow-[0_10px_28px_rgba(0,17,58,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.025] hover:shadow-[0_16px_36px_rgba(0,17,58,0.08)] group"
        >
          <span className="material-symbols-outlined mb-2.5 text-3xl text-primary/70 transition-transform group-hover:scale-105">
            search
          </span>
          <h3 className="mb-1.5 font-headline-md text-sm font-semibold text-primary">Ver Todos os Perfis</h3>
          <p className="mb-2.5 font-body-md text-[11px] leading-relaxed text-on-surface-variant">
            Pesquise em todo o diretório da UNIKIVI.
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
            Explorar
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
