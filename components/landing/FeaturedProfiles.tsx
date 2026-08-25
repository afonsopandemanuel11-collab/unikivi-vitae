import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FeaturedProfiles() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, professional_name, photo_url, position:positions(name), profile_skills(skills(name))")
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(5);

  return (
    <section className="py-section-gap bg-surface overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-primary mb-4 text-3xl md:text-4xl">Profissionais em Destaque</h2>
        <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto">
          Explore perfis de investigadores, docentes e estudantes da nossa comunidade e descubra os seus
          contributos.
        </p>
      </div>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto">
        {(profiles ?? []).map((p: any) => {
          const name = p.professional_name || p.full_name;
          const pos = Array.isArray(p.position) ? p.position[0] : p.position;
          const tags = (p.profile_skills ?? []).map((ps: any) => {
            const skill = Array.isArray(ps.skills) ? ps.skills[0] : ps.skills;
            return skill?.name;
          }).filter(Boolean).slice(0, 2);
          return (
            <Link
              key={p.id}
              href={`/perfil/${p.id}`}
              className="min-w-[300px] md:min-w-[350px] snap-start shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col group"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={p.photo_url || "/images/avatar-placeholder.png"}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border border-outline-variant shadow-sm"
                />
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-primary group-hover:text-surface-tint transition-colors">
                    {name}
                  </h3>
                  {pos?.name && <p className="font-label-sm text-on-surface-variant mt-1">{pos.name}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.map((tag: string) => (
                  <span key={tag} className="bg-surface-container-low text-primary px-3 py-1 rounded-full font-label-sm text-[10px] border border-outline-variant/20">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
        <Link
          href="/pesquisa"
          className="min-w-[300px] md:min-w-[350px] snap-start shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 flex flex-col justify-center items-center text-center group hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">search</span>
          <h3 className="font-headline-md text-lg font-bold text-primary mb-2">Ver Todos os Perfis</h3>
          <p className="font-body-md text-sm text-on-surface-variant">Pesquise em todo o diretório da universidade.</p>
        </Link>
      </div>
    </section>
  );
}