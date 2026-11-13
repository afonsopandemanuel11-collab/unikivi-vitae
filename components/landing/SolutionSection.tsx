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
      className="mx-auto max-w-container-max px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <h2 className="mb-10 text-center font-headline-lg text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
        Uma nova forma de organizar o conhecimento.
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {solutions.map((s) => (
          <div
            key={s.title}
            className="flex flex-col border-t border-outline-variant px-1 pt-4 transition-colors hover:border-primary"
          >
            <div
              className={`mb-4 h-0.5 w-10 ${
                s.ai ? "bg-secondary" : "bg-primary"
              }`}
            />
            <span className="material-symbols-outlined mb-2 text-xl text-primary">
              {s.icon}
            </span>
            <h3 className="mb-1 font-headline-md text-sm font-semibold text-on-surface sm:text-base">
              {s.title}
            </h3>
            <p className="font-body-md text-xs leading-relaxed text-on-surface-variant">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
