import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: "badge",
    title: "Perfil institucional",
    description:
      "Reúna num só lugar a sua identidade académica, afiliação, percurso, competências e formas de contacto profissional.",
    details: ["Dados pessoais e institucionais", "Competências e identificadores", "Perfil público partilhável"],
  },
  {
    icon: "travel_explore",
    title: "Pesquisa institucional",
    description:
      "Explore os perfis públicos da comunidade académica e encontre pessoas por nome, área, instituição ou palavra-chave.",
    details: ["Pesquisa de investigadores, docentes e estudantes", "Filtros por tipo de perfil", "Acesso às páginas públicas"],
  },
  {
    icon: "menu_book",
    title: "Produção científica",
    description:
      "Registe e apresente publicações e outros resultados científicos de forma estruturada e ligados ao respetivo perfil.",
    details: ["Gestão de publicações", "Registo de DOI e identificadores", "Apresentação pública da produção"],
  },
  {
    icon: "description",
    title: "Currículos académicos",
    description:
      "Organize o seu percurso num currículo e escolha entre modelos preparados para diferentes objetivos profissionais.",
    details: ["Vários modelos de currículo", "Edição do conteúdo académico e profissional", "Pré-visualização e exportação em PDF"],
  },
  {
    icon: "school",
    title: "Percurso académico e profissional",
    description:
      "Mantenha num espaço próprio a sua formação, experiência, projetos, atividades, prémios e certificações.",
    details: ["Educação e experiência", "Projetos e atividades", "Prémios e certificações"],
  },
  {
    icon: "query_stats",
    title: "Visibilidade e impacto",
    description:
      "Apresente o seu trabalho e ajude a comunidade a descobrir competências, especialidades e colaboração científica.",
    details: ["Perfis e publicações em destaque", "Identificadores académicos", "Rede pesquisável da universidade"],
  },
];

export default function FuncionalidadesPage() {
  return (
    <main>
      <Navbar />
      <header className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            UNIKIVI Vitae
          </span>
          <h1 className="font-headline-lg text-primary text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Funcionalidades da plataforma
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            Ferramentas para organizar o percurso académico e científico,
            valorizar a produção da comunidade e tornar mais simples encontrar
            conhecimento na Universidade Kimpa Vita.
          </p>
        </div>
      </header>

      <section className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="flex flex-col bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/60 shadow-2xs"
            >
              <div className="h-1 w-12 rounded-full mb-6 bg-primary" />
              <span className="material-symbols-outlined text-primary mb-4 text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <span className="text-label-sm text-on-surface-variant mb-2">0{index + 1}</span>
              <h2 className="font-headline-md text-primary text-xl font-bold mb-3">
                {feature.title}
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">
                {feature.description}
              </p>
              <ul className="mt-auto space-y-2 border-t border-outline-variant/60 pt-5">
                {feature.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-base" aria-hidden="true">
                      check
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-headline-md text-2xl sm:text-3xl font-bold mb-2">
              Dê visibilidade ao seu percurso.
            </h2>
            <p className="text-white/80 max-w-2xl">
              Crie o seu perfil e comece a reunir a sua atividade académica e científica.
            </p>
          </div>
          <Link
            href="/registo"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary hover:bg-surface-container transition-colors shrink-0"
          >
            Criar perfil
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
