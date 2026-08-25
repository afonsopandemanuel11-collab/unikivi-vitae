// components/landing/PublicProfilesCarousel.tsx
const profiles = [
  {
    initials: "AS",
    name: "Dra. Ana Silva",
    role: "Docente/Investigadora",
    bio: "Especialista em Inteligência Artificial aplicada à Educação. Doutorada em Ciências da Computação.",
    tags: ["IA", "Investigação"],
    pubs: 24,
    projects: 8,
    verified: true,
  },
  {
    initials: "MP",
    name: "Manuel Pedro",
    role: "Investigador",
    bio: "Investigação em Sistemas Distribuídos e Engenharia de Software.",
    tags: ["Cloud", "Sistemas"],
    pubs: 12,
    projects: 5,
    verified: true,
  },
  {
    initials: "TB",
    name: "Teresa Bengui",
    role: "Docente",
    bio: "Docência e pesquisa em Gestão de Informação e Governança de Dados.",
    tags: ["Dados", "Governança"],
    pubs: 18,
    projects: 6,
    verified: true,
  },
];

export default function PublicProfilesCarousel() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-12">
        <h2 className="font-headline-lg text-primary text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Conheça os perfis públicos
        </h2>
        <p className="font-body-lg text-on-surface-variant text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Apresente o seu percurso académico, científico e profissional
          através de um perfil institucional organizado e partilhável.
        </p>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 hide-scrollbar snap-x snap-mandatory max-w-container-max mx-auto">
        {profiles.map((p) => (
          <div
            key={p.name}
            className="min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex-shrink-0 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-md text-primary text-base font-bold truncate">
                      {p.name}
                    </span>
                    {p.verified && (
                      <span className="material-symbols-outlined text-secondary text-base shrink-0">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="font-body-md text-on-surface-variant text-xs truncate block">
                    {p.role}
                  </span>
                </div>
              </div>

              <p className="font-body-md text-on-surface-variant text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                {p.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container text-primary text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-xs text-on-surface-variant border-t border-outline-variant/60 pt-3 mt-2">
              <span>
                <strong className="text-primary">{p.pubs}</strong> Pubs
              </span>
              <span>
                <strong className="text-primary">{p.projects}</strong> Projetos
              </span>
              <span className="text-secondary font-bold">ORCID</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}