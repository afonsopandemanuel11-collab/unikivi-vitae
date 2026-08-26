"use client";

import Link from "next/link";

export interface MainDashboardData {
  profile: {
    id: string;
    full_name: string;
    professional_name?: string | null;
    bio?: string | null;
    photo_url?: string | null;
    status: string;
    visibility: string;
    updated_at: string;
    created_at: string;
  };
  stats: {
    publicationsCount: number;
    projectsCount: number;
    activeProjectsCount: number;
    skillsCount: number;
    certificationsCount: number;
    educationCount: number;
    experiencesCount: number;
    curriculaCount: number;
    identifiersCount: number;
  };
  curricula: Array<{
    id: string;
    title: string;
    template: string;
    status: string;
    updated_at: string;
  }>;
  recentPublications: Array<{
    id: string;
    title: string;
    journal?: string | null;
    year?: number | null;
    publication_type: string;
  }>;
  activeProjects: Array<{
    id: string;
    title: string;
    role: string;
    status: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: "curriculum" | "publication" | "project" | "profile";
    title: string;
    description: string;
    date: string;
  }>;
}

const TEMPLATE_NAMES: Record<string, string> = {
  UNIKIVI_CLASSIC: "Classic (ATS)",
  EXECUTIVE: "Professional",
  ACADEMIC_COMPACT: "Academic",
  MODERN_EDITORIAL: "Modern",
};

const PUB_TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Artigo",
  CONFERENCE: "Conferência",
  BOOK_CHAPTER: "Capítulo",
  BOOK: "Livro",
  THESIS: "Tese",
  REPORT: "Relatório",
};

export default function MainDashboard({ data }: { data: MainDashboardData }) {
  const { profile, stats, curricula, recentPublications, activeProjects, recentActivities } = data;

  const firstName = profile.full_name?.split(" ")[0] || "Utilizador";

  let score = 0;
  const missingSteps: Array<{ label: string; href: string }> = [];

  if (profile.photo_url) score += 10;
  else missingSteps.push({ label: "Adicionar foto de perfil", href: "/dashboard/perfil" });

  if (profile.bio && profile.bio.trim().length > 10) score += 10;
  else missingSteps.push({ label: "Adicionar biografia/resumo", href: "/dashboard/perfil" });

  if (stats.educationCount > 0) score += 15;
  else missingSteps.push({ label: "Adicionar formação", href: "/dashboard/educacao" });

  if (stats.experiencesCount > 0) score += 15;
  else missingSteps.push({ label: "Adicionar experiência", href: "/dashboard/experiencia" });

  if (stats.skillsCount >= 3) score += 15;
  else if (stats.skillsCount > 0) score += 10;
  else missingSteps.push({ label: "Adicionar competências", href: "/dashboard/competencias" });

  if (stats.projectsCount > 0) score += 15;
  else missingSteps.push({ label: "Adicionar projetos", href: "/dashboard/projetos" });

  if (stats.publicationsCount > 0 || stats.certificationsCount > 0) score += 10;
  else missingSteps.push({ label: "Adicionar publicações ou certificações", href: "/dashboard/publicacoes" });

  if (stats.identifiersCount > 0) score += 10;
  else missingSteps.push({ label: "Adicionar identificadores (ORCID/Ciência ID)", href: "/dashboard/identificadores" });

  const completionPercent = Math.min(100, score);

  const percursoSteps = [
    { label: "Perfil", completed: Boolean(profile.photo_url || (profile.bio && profile.bio.length > 5)), href: "/dashboard/perfil" },
    { label: "Educação", completed: stats.educationCount > 0, href: "/dashboard/educacao" },
    { label: "Experiência", completed: stats.experiencesCount > 0, href: "/dashboard/experiencia" },
    { label: "Projetos", completed: stats.projectsCount > 0, href: "/dashboard/projetos" },
    { label: "Certificações", completed: stats.certificationsCount > 0 || stats.publicationsCount > 0, href: "/dashboard/certificacoes" },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full">
      {/* ================= 1. CABEÇALHO DE BOAS-VINDAS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs">
        <div className="min-w-0">
          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight flex items-center gap-3">
            <span>Olá, {firstName}</span>
            <span className="inline-block animate-wave text-3xl sm:text-4xl">👋</span>
          </h1>
          <p className="font-body-lg text-slate-600 text-base sm:text-lg mt-2 font-medium max-w-3xl">
            Vamos continuar a construir o teu percurso académico e profissional.
          </p>
        </div>

        <Link
          href={`/perfil/${profile.id}`}
          target="_blank"
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm font-bold text-primary transition-all shadow-xs self-start sm:self-auto shrink-0"
        >
          <span className="material-symbols-outlined text-lg text-secondary">public</span>
          <span>Perfil público</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 text-xs font-semibold">
            {profile.visibility === "PUBLIC" ? "Visível online" : "Restrito"}
          </span>
        </Link>
      </div>

      {/* ================= 2. O TEU PERCURSO ================= */}
      <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 lg:p-10 shadow-xs">
        <h2 className="font-headline-md text-primary font-black text-lg sm:text-xl mb-8 sm:mb-10">
          O teu percurso
        </h2>

        <div className="relative flex items-center justify-between max-w-5xl mx-auto px-4 sm:px-8">
          <div className="absolute left-10 right-10 top-5 sm:top-6 h-1 bg-slate-200 -z-0" />

          {percursoSteps.map((step, idx) => (
            <Link
              key={step.label}
              href={step.href}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-extrabold transition-all shadow-sm ${
                  step.completed
                    ? "bg-primary text-white ring-6 ring-white shadow-md"
                    : "bg-white border-2 border-slate-300 text-slate-400 group-hover:border-primary group-hover:text-primary ring-6 ring-white"
                }`}
              >
                {step.completed ? (
                  <span className="material-symbols-outlined text-lg sm:text-xl font-bold">check</span>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-bold mt-3 transition-colors ${
                  step.completed ? "text-primary font-black" : "text-slate-500 group-hover:text-primary"
                }`}
              >
                {step.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= 3. GRID PRINCIPAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ── COLUNA ESQUERDA ── */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8">
          {/* Card: Perfil Completo */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-secondary text-2xl">✨</span>
              <h3 className="font-headline-md text-primary font-black text-lg sm:text-xl">
                {completionPercent === 100 ? "Perfil completo!" : "Perfil quase completo"}
              </h3>
            </div>

            <div className="flex items-baseline gap-2.5 my-3">
              <span className="text-5xl sm:text-6xl font-black text-primary tracking-tight">
                {completionPercent}%
              </span>
              <span className="text-sm sm:text-base text-slate-500 font-bold">concluído</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3.5 sm:h-4 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div>
              <span className="font-label-sm text-xs font-black uppercase tracking-wider text-slate-400 block mb-3.5">
                Próximos passos
              </span>

              <div className="space-y-2.5">
                {missingSteps.slice(0, 3).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-outline-variant hover:border-primary hover:bg-primary/5 text-xs sm:text-sm font-bold text-slate-800 hover:text-primary transition-all group"
                  >
                    <span className="truncate pr-2">{item.label}</span>
                    <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0">
                      add_circle
                    </span>
                  </Link>
                ))}

                <Link
                  href="/dashboard/curriculos/novo"
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-primary text-white hover:bg-primary-container text-xs sm:text-sm font-bold transition-all group mt-4 shadow-sm"
                >
                  <span>Criar currículo</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Card: Presença Pública */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-2xl shrink-0">language</span>
              <h3 className="font-headline-md text-primary font-black text-lg truncate">
                A tua presença pública
              </h3>
            </div>

            <div className="flex items-center justify-between gap-3 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold shrink-0">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">visibility</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 block truncate">Identificadores</span>
                  <span className="text-xs text-slate-500 font-medium block truncate">ORCID, Ciência ID & Links</span>
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-primary shrink-0 pl-2">
                {stats.identifiersCount}
              </span>
            </div>

            <Link
              href={`/perfil/${profile.id}`}
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
              <span>Ver perfil público</span>
            </Link>
          </div>
        </div>

        {/* ── COLUNA DIREITA ── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-10">
          {/* O QUE QUERES FAZER? */}
          <div>
            <h2 className="font-headline-md text-primary font-black text-lg sm:text-xl lg:text-2xl mb-4">
              O que queres fazer?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {[
                { label: "Criar currículo", icon: "description", href: "/dashboard/curriculos/novo", sub: "Começar →" },
                { label: "Melhorar perfil", icon: "edit_square", href: "/dashboard/perfil", sub: "Editar →" },
                { label: "Adicionar publicação", icon: "menu_book", href: "/dashboard/publicacoes", sub: "Adicionar +" },
                { label: "Novo projecto", icon: "rocket_launch", href: "/dashboard/projetos", sub: "Novo +" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-white rounded-3xl border border-outline-variant p-4 sm:p-6 text-center hover:border-primary hover:shadow-md transition-all group flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">{action.icon}</span>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary">
                    {action.label}
                  </span>
                  <span className="text-[11px] font-bold text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {action.sub}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* KPIS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {[
              { label: "Publicações", count: stats.publicationsCount, icon: "menu_book", href: "/dashboard/publicacoes" },
              { label: "Projetos", count: stats.projectsCount, icon: "rocket_launch", href: "/dashboard/projetos", sub: stats.activeProjectsCount > 0 ? `${stats.activeProjectsCount} activos` : undefined },
              { label: "Competências", count: stats.skillsCount, icon: "psychology", href: "/dashboard/competencias" },
              { label: "Certificações", count: stats.certificationsCount, icon: "workspace_premium", href: "/dashboard/certificacoes" },
            ].map((kpi) => (
              <Link
                key={kpi.href}
                href={kpi.href}
                className="bg-white rounded-3xl border border-outline-variant p-5 sm:p-6 hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]"
              >
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-2 block">{kpi.icon}</span>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-primary tracking-tight">{kpi.count}</div>
                  <span className="text-xs sm:text-sm text-slate-600 font-bold block mt-1 truncate">{kpi.label}</span>
                  {kpi.sub && (
                    <span className="text-[11px] text-secondary font-bold block truncate">{kpi.sub}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* OS TEUS CURRÍCULOS */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-primary font-black text-lg sm:text-xl">
                Os teus currículos
              </h3>
              <Link
                href="/dashboard/curriculos"
                className="text-xs sm:text-sm font-bold text-secondary hover:underline flex items-center gap-1.5"
              >
                <span>Ver todos</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {curricula.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-50 border border-outline-variant hover:border-primary rounded-2xl p-5 flex flex-col justify-between transition-all group min-h-[160px]"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="font-bold text-sm text-slate-900 group-hover:text-primary leading-tight"
                        title={c.title}
                      >
                        {c.title.length > 28 ? c.title.slice(0, 28) + "…" : c.title}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5 truncate">
                        {TEMPLATE_NAMES[c.template] ?? c.template}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 mt-auto">
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {new Date(c.updated_at).toLocaleDateString("pt-PT")}
                    </span>
                    <Link
                      href={`/dashboard/curriculos/${c.id}/editar`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
                    >
                      Editar
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}

              <Link
                href="/dashboard/curriculos/novo"
                className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:border-primary hover:bg-primary/5 transition-all group min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <span className="material-symbols-outlined text-xl">add</span>
                </div>
                <span className="text-sm font-bold text-primary">Criar currículo</span>
              </Link>
            </div>
          </div>

          {/* PUBLICAÇÕES & PROJECTOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Publicações Recentes */}
            <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-headline-md text-primary font-bold text-base sm:text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
                    <span>Publicações recentes</span>
                  </h3>
                  <Link
                    href="/dashboard/publicacoes"
                    className="p-1.5 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </Link>
                </div>

                {recentPublications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">auto_stories</span>
                    <p className="text-sm font-semibold mb-4">Ainda não tens publicações.</p>
                    <Link
                      href="/dashboard/publicacoes"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors"
                    >
                      + Adicionar publicação
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {recentPublications.map((pub) => (
                      <div key={pub.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-white transition-colors">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1.5">{pub.title}</h4>
                        <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                          <span className="truncate">{pub.journal || "Publicação académica"}{pub.year ? ` • ${pub.year}` : ""}</span>
                          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 font-bold uppercase text-[11px] shrink-0">
                            {PUB_TYPE_LABELS[pub.publication_type] ?? pub.publication_type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {recentPublications.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-100 text-right">
                  <Link href="/dashboard/publicacoes" className="text-xs sm:text-sm font-bold text-secondary hover:underline">
                    Gerir todas ({stats.publicationsCount}) →
                  </Link>
                </div>
              )}
            </div>

            {/* Projetos Activos */}
            <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-headline-md text-primary font-bold text-base sm:text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
                    <span>Projetos activos</span>
                  </h3>
                  <Link
                    href="/dashboard/projetos"
                    className="p-1.5 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </Link>
                </div>

                {activeProjects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                      <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">Nenhum projecto activo</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4 font-medium">
                      Adiciona o teu trabalho em curso.
                    </p>
                    <Link
                      href="/dashboard/projetos"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-primary hover:bg-primary-container px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      Novo projecto
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activeProjects.map((p) => (
                      <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-white transition-colors">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1.5">{p.title}</h4>
                        <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                          <span className="truncate">Papel: {p.role}</span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold text-[11px] shrink-0">
                            Activo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {activeProjects.length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-100 text-right">
                  <Link href="/dashboard/projetos" className="text-xs sm:text-sm font-bold text-secondary hover:underline">
                    Ver todos ({stats.projectsCount}) →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVIDADE RECENTE */}
          <div className="bg-white rounded-3xl border border-outline-variant p-6 sm:p-8 shadow-xs">
            <h3 className="font-headline-md text-primary font-black text-lg sm:text-xl mb-6">
              Actividade recente
            </h3>

            {recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500 py-3 font-medium">
                Nenhuma atividade recente registada.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 text-sm">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-xl">
                        {act.type === "curriculum" ? "description" : act.type === "publication" ? "menu_book" : act.type === "project" ? "rocket_launch" : "person"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 leading-snug">{act.title}</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
