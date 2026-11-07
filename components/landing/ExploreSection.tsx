// components/landing/ExploreSection.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ExploreSection() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, professional_name, photo_url, position:positions(name)")
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(4);

  const displayProfiles = profiles ?? [];

  // Fallback static names if DB empty
  return (
    <section className="py-section-gap bg-primary-container relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-fixed-dim opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left text */}
        <div className="md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-white/10 text-on-primary-container/80 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 mb-6">
            Diretório Académico
          </span>
          <h2 className="font-headline-lg text-on-primary-container mb-4 text-3xl md:text-4xl">
            Explore a UNIKIVI Vitae
          </h2>
          <p className="font-body-lg text-on-primary-container/80 mb-8 max-w-lg mx-auto md:mx-0">
            Descubra investigadores, projetos e especialistas através do nosso diretório público.
            Uma rede de conhecimento à sua disposição.
          </p>
          <Link
            href="/pesquisa"
            className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-xl">travel_explore</span>
            Explorar plataforma
          </Link>
        </div>

        {/* Right — Profile cards mockup */}
        <div className="md:w-1/2 w-full max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-primary-container/70 text-xs font-bold uppercase tracking-wider">Perfis em destaque</span>
              <span className="bg-white/20 text-on-primary-container text-xs font-bold px-2.5 py-1 rounded-full">
                {displayProfiles.length > 0 ? `${displayProfiles.length}+ activos` : "Comunidade"}
              </span>
            </div>

            <div className="space-y-3">
              {displayProfiles.length > 0
                ? displayProfiles.map((p: any) => {
                    const name = p.professional_name || p.full_name;
                    const pos = Array.isArray(p.position) ? p.position[0] : p.position;
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
                        className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
                      >
                        {p.photo_url ? (
                          <img src={p.photo_url} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-bold text-sm truncate group-hover:text-white/90">{name}</p>
                          {pos?.name && <p className="text-white/60 text-xs truncate">{pos.name}</p>}
                        </div>
                        <span className="material-symbols-outlined text-white/40 group-hover:text-white/70 text-base transition-colors shrink-0">arrow_forward</span>
                      </Link>
                    );
                  })
                : <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-white/70">groups</span>
                    <p className="mt-2 text-sm font-bold text-white">A comunidade está a crescer</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">Os perfis públicos aparecerão aqui quando estiverem disponíveis.</p>
                  </div>}
            </div>

            <Link
              href="/pesquisa"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors border border-white/20"
            >
              <span className="material-symbols-outlined text-base">search</span>
              Ver todos os perfis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
