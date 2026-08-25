"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCurriculum } from "@/app/dashboard/curriculos/actions";

const OBJECTIVES = [
  { value: "PROFESSIONAL", label: "Candidatura profissional", icon: "work", desc: "Empresas privadas e multinacionais" },
  { value: "PUBLIC_SECTOR", label: "Concurso / setor público", icon: "account_balance", desc: "Administração pública e concursos" },
  { value: "ACADEMIC", label: "Academia / investigação", icon: "school", desc: "Bolsas, docência, pós-graduação e ciência" },
  { value: "FREELANCE", label: "Freelancer / Consultor", icon: "hub", desc: "Prestação de serviços e tecnologia" },
  { value: "INTERNSHIP", label: "Estágio / Primeiro Emprego", icon: "accessibility_new", desc: "Início de carreira e projetos académicos" },
  { value: "GENERAL", label: "Geral / Polivalente", icon: "description", desc: "Apresentação equilibrada e padrão" },
];

const TEMPLATES = [
  {
    id: "UNIKIVI_CLASSIC",
    name: "UNIKIVI Classic (ATS)",
    tag: "ATS Friendly",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "Estrutura limpa de coluna única, sem elementos gráficos complexos. Formatação rigorosa ideal para sistemas de triagem automática (ATS) e candidaturas formais.",
    features: ["1 Coluna pura", "Texto 100% parseável", "Sem barras gráficas", "Tipografia sóbria"],
    badge: "Recomendado para ATS",
  },
  {
    id: "EXECUTIVE",
    name: "UNIKIVI Professional",
    tag: "Corporativo",
    tagColor: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "Design corporativo elegante com hierarquia visual forte, destaque para experiência, competências e conquistas profissionais de impacto.",
    features: ["Layout equilibrado", "Destaque de liderança", "Painel de competências", "Tipografia executiva"],
    badge: "Mais Popular",
  },
  {
    id: "ACADEMIC_COMPACT",
    name: "UNIKIVI Academic",
    tag: "Científico",
    tagColor: "bg-purple-100 text-purple-800 border-purple-200",
    desc: "Destinado a investigadores, docentes e cientistas. Dá prioridade a graus académicos, publicações com DOI, projetos, identificadores e prémios.",
    features: ["Foco em Publicações & DOI", "Projetos de Pesquisa", "Identificadores (ORCID/Ciência ID)", "Graus Académicos"],
    badge: "Ideal p/ Investigadores",
  },
  {
    id: "MODERN_EDITORIAL",
    name: "UNIKIVI Modern",
    tag: "Inovador",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "Visual dinâmico e contemporâneo com chips de tags para competências, links de portfólio e projetos com visual apelativo.",
    features: ["Tags e chips modernos", "Destaque de Portfólio & Links", "Design fluido", "Ideal p/ Freelancers & Tech"],
    badge: "Visual Criativo",
  },
];

const ALL_SECTIONS = [
  { id: "summary", label: "Resumo / Perfil Profissional", icon: "badge", desc: "Apresentação e proposta de valor" },
  { id: "experience", label: "Experiência Profissional", icon: "work", desc: "Cargos e responsabilidades anteriores" },
  { id: "education", label: "Educação e Formação", icon: "school", desc: "Graus académicos e cursos" },
  { id: "skills", label: "Competências e Habilidades", icon: "psychology", desc: "Competências técnicas e comportamentais" },
  { id: "projects", label: "Projetos", icon: "rocket_launch", desc: "Investigações, projetos e iniciativas" },
  { id: "publications", label: "Publicações e Artigos", icon: "menu_book", desc: "Produção científica com DOI" },
  { id: "certifications", label: "Certificações", icon: "workspace_premium", desc: "Credenciais e certificados" },
  { id: "awards", label: "Prémios e Distinções", icon: "emoji_events", desc: "Reconhecimentos e méritos" },
  { id: "languages", label: "Idiomas", icon: "translate", desc: "Línguas e níveis de proficiência" },
  { id: "identifiers", label: "Identificadores e Links", icon: "link", desc: "ORCID, LinkedIn, Portfólio, etc." },
];

export default function CreateCurriculumWizard({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("PROFESSIONAL");
  const [template, setTemplate] = useState("UNIKIVI_CLASSIC");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "identifiers",
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sugere modelo e secções consoante o objetivo escolhido
  function handleSelectObjective(objVal: string) {
    setObjective(objVal);
    if (objVal === "ACADEMIC") {
      setTemplate("ACADEMIC_COMPACT");
      setSelectedSections(["summary", "education", "publications", "projects", "certifications", "awards", "skills", "identifiers"]);
    } else if (objVal === "FREELANCE") {
      setTemplate("MODERN_EDITORIAL");
      setSelectedSections(["summary", "skills", "projects", "experience", "education", "identifiers", "certifications"]);
    } else if (objVal === "PUBLIC_SECTOR") {
      setTemplate("UNIKIVI_CLASSIC");
      setSelectedSections(["summary", "education", "experience", "certifications", "skills", "languages"]);
    } else {
      setTemplate("EXECUTIVE");
      setSelectedSections(["summary", "experience", "education", "skills", "projects", "certifications", "identifiers"]);
    }
  }

  function toggleSection(secId: string) {
    setSelectedSections((prev) =>
      prev.includes(secId) ? prev.filter((id) => id !== secId) : [...prev, secId]
    );
  }

  async function handleFinish() {
    setSaving(true);
    setError(null);

    const result = await createCurriculum(profileId, {
      title: title.trim(),
      objective,
      template,
      selectedSections,
    });

    if (!result.success || !result.curriculumId) {
      setError(result.error ?? "Não foi possível criar o currículo.");
      setSaving(false);
      return;
    }

    router.push(`/dashboard/curriculos/${result.curriculumId}/editar`);
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl border border-outline-variant shadow-lg overflow-hidden">
      {/* Top Stepper Header */}
      <div className="bg-surface-container-low px-4 sm:px-8 py-4 sm:py-5 border-b border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-secondary uppercase tracking-widest text-[10px] sm:text-xs">
            Construtor de Currículos • UNIKIVI Vitae
          </span>
          <h1 className="font-headline-md text-primary text-lg sm:text-xl font-bold">
            Novo Currículo
          </h1>
        </div>

        {/* Stepper indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                step >= 1 ? "bg-primary text-white" : "border border-outline-variant text-on-surface-variant"
              }`}
            >
              1
            </span>
            <span className={`text-xs font-medium ${step === 1 ? "text-primary font-bold" : "text-on-surface-variant"}`}>
              Identidade
            </span>
          </div>

          <div className="w-4 sm:w-8 h-px bg-outline-variant" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                step >= 2 ? "bg-primary text-white" : "border border-outline-variant text-on-surface-variant"
              }`}
            >
              2
            </span>
            <span className={`text-xs font-medium ${step === 2 ? "text-primary font-bold" : "text-on-surface-variant"}`}>
              Modelo
            </span>
          </div>

          <div className="w-4 sm:w-8 h-px bg-outline-variant" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                step >= 3 ? "bg-primary text-white" : "border border-outline-variant text-on-surface-variant"
              }`}
            >
              3
            </span>
            <span className={`text-xs font-medium ${step === 3 ? "text-primary font-bold" : "text-on-surface-variant"}`}>
              Conteúdo
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="m-4 sm:m-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="p-4 sm:p-6 md:p-8">
        {/* ================= STEP 1: IDENTIDADE ================= */}
        {step === 1 && (
          <div>
            <h2 className="font-headline-md text-primary text-2xl font-bold mb-2">
              Qual é o objetivo deste currículo?
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Pode criar múltiplos currículos adaptados para diferentes vagas e propósitos a partir do seu perfil.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block font-label-sm text-primary uppercase tracking-wider text-xs mb-2">
                  Nome do Currículo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Ex: "Currículo Profissional Tech", "Currículo Académico FCT", "Candidatura Docência"'
                  className="w-full border border-outline-variant rounded-xl p-3.5 text-base text-on-surface focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block font-label-sm text-primary uppercase tracking-wider text-xs mb-3">
                  Selecione o Contexto de Aplicação
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {OBJECTIVES.map((obj) => (
                    <div
                      key={obj.value}
                      onClick={() => handleSelectObjective(obj.value)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        objective === obj.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-outline-variant/70 hover:border-outline-variant bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className={`material-symbols-outlined ${objective === obj.value ? "text-primary" : "text-on-surface-variant"}`}>
                          {obj.icon}
                        </span>
                        <span className="font-bold text-sm text-primary">
                          {obj.label}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant pl-8">
                        {obj.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ESCOLHER MODELO ================= */}
        {step === 2 && (
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="font-headline-md text-primary text-2xl font-bold">
                  Escolha o Modelo de Design
                </h2>
                <p className="text-on-surface-variant text-sm">
                  Todos os modelos utilizam os mesmos dados estruturados do seu perfil. Pode trocar de modelo a qualquer momento no editor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    template === tmpl.id
                      ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                      : "border-outline-variant hover:border-outline bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-primary text-base">
                        {tmpl.name}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tmpl.tagColor}`}>
                        {tmpl.tag}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                      {tmpl.desc}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-outline-variant/40">
                      {tmpl.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-secondary">
                      {tmpl.badge}
                    </span>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      template === tmpl.id ? "border-primary bg-primary text-white" : "border-outline"
                    }`}>
                      {template === tmpl.id && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: SELEÇÃO DE CONTEÚDO ================= */}
        {step === 3 && (
          <div>
            <h2 className="font-headline-md text-primary text-2xl font-bold mb-2">
              Selecione as Secções a Incluir
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Marque as secções que deseja ativar no currículo. Poderá reordenar, adicionar secções personalizadas e filtrar registos individuais no editor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ALL_SECTIONS.map((sec) => {
                const isSelected = selectedSections.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    onClick={() => toggleSection(sec.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-primary/50 bg-primary/5 shadow-xs"
                        : "border-outline-variant/60 bg-white hover:border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                        {sec.icon}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                          {sec.label}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {sec.desc}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // tratado no onClick do container
                      className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation */}
      <div className="bg-surface-container-low px-8 py-5 border-t border-outline-variant flex items-center justify-between">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => router.push("/dashboard/curriculos")}
            className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1))}
            className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Voltar</span>
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1 && !title.trim()) {
                setError("Por favor indique um nome para o seu currículo.");
                return;
              }
              setError(null);
              setStep((prev) => ((prev + 1) as 1 | 2 | 3));
            }}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          >
            <span>Próximo Passo</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-bold text-sm transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{saving ? "A criar currículo..." : "Criar e Abrir Editor"}</span>
          </button>
        )}
      </div>
    </div>
  );
}