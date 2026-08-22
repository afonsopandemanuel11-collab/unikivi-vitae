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
  // ... mais 3 perfis, seguindo o mesmo formato
];

export default function PublicProfilesCarousel() {
  return (
    <section className="py-section-gap bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-desktop text-center mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
          Conheça os perfis públicos
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Apresente o seu percurso académico, científico e profissional
          através de um perfil institucional organizado e partilhável.
        </p>
      </div>

      <div className="flex gap-gutter overflow-x-auto px-margin-desktop pb-4 hide-scrollbar snap-x snap-mandatory">
        {profiles.map((p) => (
          <div
            key={p.name}
            className="min-w-[320px] max-w-[320px] snap-start bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                {p.initials}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-headline-md text-headline-md text-primary text-base">
                    {p.name}
                  </span>
                  {p.verified && (
                    <span className="material-symbols-outlined text-secondary text-lg">
                      verified
                    </span>
                  )}
                </div>
                <span className="font-body-md text-body-md text-on-surface-variant text-sm">
                  {p.role}
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
              {p.bio}
            </p>

            <div className="flex gap-2 mb-4">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container text-primary text-label-sm font-label-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant border-t border-outline-variant pt-4">
              <span>
                <strong className="text-primary">{p.pubs}</strong> Pubs
              </span>
              <span>
                <strong className="text-primary">{p.projects}</strong> Projetos
              </span>
              <span>ORCID</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}