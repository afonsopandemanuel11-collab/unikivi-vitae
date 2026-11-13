const problems = [
  {
    icon: "data_alert",
    title: "Informação dispersa",
    text: "O seu currículo está num formato, as publicações noutro, e os projetos da universidade perdem-se em arquivos locais.",
  },
  {
    icon: "update_disabled",
    title: "Atualização manual",
    text: "Manter o percurso atualizado exige esforço constante de duplicação de dados entre diversas plataformas institucionais.",
  },
  {
    icon: "search_off",
    title: "Difícil identificação",
    text: "Colaboradores e instituições têm dificuldade em encontrar as suas competências e produção científica real e validada.",
  },
];

export default function ProblemSection() {
  return (
    <section id="sobre" className="bg-surface-container-low py-14 sm:py-16">
      <div className="mx-auto max-w-container-max px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-9 max-w-2xl text-center font-headline-lg text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          Informação académica não deveria estar espalhada.
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.title}
              className="rounded-lg border border-outline-variant/70 bg-white p-5 shadow-[0_8px_24px_rgba(25,28,29,0.04)] sm:p-6"
            >
              <span className="material-symbols-outlined mb-3 text-2xl text-primary">
                {problem.icon}
              </span>
              <h3 className="mb-2 font-headline-md text-base font-semibold text-on-surface">
                {problem.title}
              </h3>
              <p className="font-body-md text-xs leading-relaxed text-on-surface-variant sm:text-sm">
                {problem.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
