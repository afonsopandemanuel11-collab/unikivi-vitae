// components/landing/SolutionSection.tsx
const solutions = [
  {
    icon: "account_balance",
    title: "Perfil Institucional",
    text: "Identidade digital oficial reconhecida pela universidade.",
    ai: false,
  },
  {
    icon: "menu_book",
    title: "Produção Científica",
    text: "Integração automática com bases de dados de publicações.",
    ai: false,
  },
  {
    icon: "auto_awesome",
    title: "Currículo Inteligente",
    text: "Sugestões contextuais e organização automatizada do seu trajeto.",
    ai: true,
  },
  {
    icon: "travel_explore",
    title: "Pesquisa Institucional",
    text: "Encontre investigadores, projetos e especialistas na rede.",
    ai: false,
  },
];

export default function SolutionSection() {
  return (
    <section
      id="funcionalidades"
      className="py-section-gap max-w-container-max mx-auto px-margin-desktop"
    >
      <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-16">
        Uma nova forma de organizar o conhecimento.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {solutions.map((s) => (
          <div key={s.title} className="flex flex-col">
            <div
              className={`h-0.5 w-full mb-6 ${
                s.ai ? "bg-secondary" : "bg-outline-variant"
              }`}
            />
            <span className="material-symbols-outlined text-primary mb-3 text-2xl">
              {s.icon}
            </span>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">
              {s.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}