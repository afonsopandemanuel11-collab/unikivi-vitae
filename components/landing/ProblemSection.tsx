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
    <section id="sobre" className="bg-surface-container-low py-16 sm:py-20 md:py-24">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline-lg text-primary text-2xl sm:text-3xl md:text-4xl text-center mb-10 sm:mb-16 max-w-2xl mx-auto font-bold tracking-tight">
          Informação académica não deveria estar espalhada.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {problems.map((p) => (
            <div
              key={p.title}
              className="relative overflow-hidden rounded-2xl border border-outline-variant shadow-md min-h-[280px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-8 group"
            >
              {/* Imagem de fundo */}
              <img
                src={p.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradiente escuro para legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

              {/* Conteúdo sobreposto */}
              <div className="relative z-10">
                <span className="material-symbols-outlined text-white/90 mb-3 text-3xl sm:text-4xl">
                  {p.icon}
                </span>
                <h3 className="font-headline-md text-xl font-bold text-white mb-2">
                  {p.title}
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-white/85 leading-relaxed">
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