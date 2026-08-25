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
    text: "Integração e registo estruturado de publicações com DOI e indexação.",
    ai: false,
  },
  {
    icon: "auto_awesome",
    title: "Currículo Inteligente",
    text: "Múltiplos modelos profissionais e exportação direta em formato A4/PDF.",
    ai: true,
  },
  {
    icon: "travel_explore",
    title: "Pesquisa Institucional",
    text: "Encontre investigadores, docentes, projetos e especialistas na rede.",
    ai: false,
  },
];

export default function SolutionSection() {
  return (
    <section
      id="funcionalidades"
      className="py-16 sm:py-20 md:py-24 max-w-container-max mx-auto px-4 sm:px-6 lg:px-8"
    >
      <h2 className="font-headline-lg text-primary text-2xl sm:text-3xl md:text-4xl text-center mb-12 sm:mb-16 font-bold tracking-tight">
        Uma nova forma de organizar o conhecimento.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {solutions.map((s) => (
          <div
            key={s.title}
            className="flex flex-col bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-2xs hover:shadow-md transition-shadow"
          >
            <div
              className={`h-1 w-12 rounded-full mb-6 ${
                s.ai ? "bg-secondary" : "bg-primary"
              }`}
            />
            <span className="material-symbols-outlined text-primary mb-3 text-3xl">
              {s.icon}
            </span>
            <h3 className="font-headline-md text-lg sm:text-xl font-bold text-primary mb-2">
              {s.title}
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}