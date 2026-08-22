// components/landing/ProblemSection.tsx
const problems = [
  {
    icon: "data_alert",
    title: "Informação dispersa",
    text: "O seu currículo está num formato, as publicações noutro, e os projetos da universidade perdem-se em arquivos locais.",
    image: "/images/problems/cc.png",
  },
  {
    icon: "update_disabled",
    title: "Atualização manual",
    text: "Manter o percurso atualizado exige esforço constante de duplicação de dados entre diversas plataformas institucionais.",
    image: "/images/problems/gr (3).png",
  },
  {
    icon: "search_off",
    title: "Difícil identificação",
    text: "Colaboradores e instituições têm dificuldade em encontrar as suas competências e produção científica real e validada.",
    image: "/images/problems/frende (18).jpg",
  },
];

export default function ProblemSection() {
  return (
    <section id="sobre" className="bg-surface-container-low py-section-gap">
      <div className="max-w-container-max mx-auto px-margin-desktop">
        <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-16">
          Informação académica não deveria estar espalhada.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {problems.map((p) => (
            <div
              key={p.title}
              className="relative overflow-hidden rounded-xl border border-outline-variant shadow-sm h-72 flex flex-col justify-end p-8"
            >
              {/* imagem de fundo */}
              <img
                src={p.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* gradiente escuro para o texto ficar legível */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

              {/* conteúdo por cima */}
              <div className="relative z-10">
                <span className="material-symbols-outlined text-white/90 mb-4 text-4xl">
                  {p.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-white mb-3">
                  {p.title}
                </h3>
                <p className="font-body-md text-body-md text-white/85">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}