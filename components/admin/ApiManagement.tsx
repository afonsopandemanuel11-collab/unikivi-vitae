"use client";

import { useState, useTransition, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createApiIntegration,
  createApiKey,
  revokeApiKey,
  saveApiScopes,
  setApiClientStatus,
} from "@/app/admin/api/actions";

type ApiKey = {
  id: string;
  key_prefix: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  request_count: number;
};

type ApiClient = {
  id: string;
  name: string;
  description: string | null;
  contact: string | null;
  status: string;
  scopes: string[];
  created_at: string;
  keys: ApiKey[];
};

type CategoryField = {
  id: string;
  label: string;
  fieldKey: string;
  category: "cat1" | "cat2" | "cat3" | "cat4" | "cat5";
};

const SCOPE_CATEGORIES: {
  id: "cat1" | "cat2" | "cat3" | "cat4" | "cat5";
  title: string;
  icon: string;
  fields: { id: string; label: string; fieldKey: string }[];
}[] = [
  {
    id: "cat1",
    title: "Categoria 1: Dados de Identificação & Pessoais",
    icon: "person",
    fields: [
      { id: "full_name", label: "Nome completo", fieldKey: "full_name" },
      { id: "professional_name", label: "Nome de citação", fieldKey: "professional_name" },
      { id: "orcid_id", label: "ORCID ID", fieldKey: "professional_name" },
      { id: "ciencia_id", label: "Ciência ID", fieldKey: "professional_name" },
      { id: "photo", label: "Foto institucional", fieldKey: "full_name" },
      { id: "bio", label: "Biografia académica", fieldKey: "bio" },
      { id: "email", label: "Email institucional", fieldKey: "full_name" },
    ],
  },
  {
    id: "cat2",
    title: "Categoria 2: Histórico & Formação",
    icon: "history_edu",
    fields: [
      { id: "degrees", label: "Graus académicos", fieldKey: "education" },
      { id: "institutions", label: "Instituições de obtenção", fieldKey: "education" },
      { id: "periods", label: "Períodos", fieldKey: "education" },
      { id: "thesis", label: "Tese doutoramento/mestrado", fieldKey: "education" },
    ],
  },
  {
    id: "cat3",
    title: "Categoria 3: Produção Científica & Artigos",
    icon: "menu_book",
    fields: [
      { id: "articles", label: "Artigos indexados", fieldKey: "publications" },
      { id: "doi", label: "DOI", fieldKey: "publications" },
      { id: "venue", label: "Revista/Conferência", fieldKey: "publications" },
      { id: "year", label: "Ano de publicação", fieldKey: "publications" },
      { id: "impact_factor", label: "Fator de impacto/Quartil", fieldKey: "publications" },
      { id: "coauthors", label: "Co-autores", fieldKey: "publications" },
    ],
  },
  {
    id: "cat4",
    title: "Categoria 4: Projetos & Financiamentos",
    icon: "payments",
    fields: [
      { id: "project_title", label: "Título do projeto", fieldKey: "projects" },
      { id: "funder", label: "Entidade financiadora", fieldKey: "projects" },
      { id: "budget", label: "Orçamento", fieldKey: "projects" },
      { id: "pi_role", label: "Papel / PI", fieldKey: "projects" },
      { id: "project_status", label: "Estado do projeto", fieldKey: "projects" },
    ],
  },
  {
    id: "cat5",
    title: "Categoria 5: Competências & Áreas FOS",
    icon: "psychology",
    fields: [
      { id: "fos_areas", label: "Áreas OECD/FOS", fieldKey: "research_areas" },
      { id: "research_lines", label: "Linhas de investigação", fieldKey: "research_areas" },
      { id: "keywords", label: "Palavras-chave", fieldKey: "competencies" },
    ],
  },
];

const DEFAULT_CHECKED_IDS = new Set([
  "full_name",
  "professional_name",
  "orcid_id",
  "photo",
  "degrees",
  "institutions",
  "articles",
  "doi",
  "venue",
  "year",
  "project_title",
  "pi_role",
  "fos_areas",
  "research_lines",
  "keywords",
]);

export default function ApiManagement({ clients }: { clients: ApiClient[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Estado do formulário
  const [appName, setAppName] = useState("Portal de Investigação FCT / Sistema Académico SIGA");
  const [targetEntity, setTargetEntity] = useState("docentes");
  const [rateLimit, setRateLimit] = useState("5000");
  const [expiresDays, setExpiresDays] = useState("90");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(DEFAULT_CHECKED_IDS));

  // Modal de sucesso
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Mapeamento dinâmico de campos para a URL e pré-visualização
  const dynamicFieldsList = useMemo(() => {
    const list: string[] = [];
    if (checkedIds.has("full_name")) list.push("name");
    if (checkedIds.has("orcid_id") || checkedIds.has("professional_name")) list.push("orcid");
    if (checkedIds.has("articles") || checkedIds.has("doi")) list.push("publications");
    if (checkedIds.has("degrees") || checkedIds.has("institutions")) list.push("education");
    if (checkedIds.has("project_title")) list.push("projects");
    if (checkedIds.has("fos_areas") || checkedIds.has("keywords")) list.push("competencies");
    return list.length ? list.join(",") : "name,orcid";
  }, [checkedIds]);

  const endpointUrl = `https://api.unikivi.edu.ao/v1/entities/${targetEntity}?fields=${dynamicFieldsList}`;

  function handleToggleCheckbox(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleToggleCategory(catId: "cat1" | "cat2" | "cat3" | "cat4" | "cat5") {
    const cat = SCOPE_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    const catFieldIds = cat.fields.map((f) => f.id);
    const allChecked = catFieldIds.every((id) => checkedIds.has(id));

    setCheckedIds((prev) => {
      const next = new Set(prev);
      catFieldIds.forEach((id) => {
        if (allChecked) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }

  function handleSelectAll() {
    const all = new Set<string>();
    SCOPE_CATEGORIES.forEach((cat) => cat.fields.forEach((f) => all.add(f.id)));
    setCheckedIds(all);
  }

  function handleResetDefaults() {
    setCheckedIds(new Set(DEFAULT_CHECKED_IDS));
    setAppName("Portal de Investigação FCT / Sistema Académico SIGA");
    setTargetEntity("docentes");
    setRateLimit("5000");
  }

  function copyText(text: string, label: string) {
    void navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 3000);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    // Mapeia entidade alvo para o tipo de perfil do sistema
    const profileTypeMap: Record<string, string> = {
      docentes: "TEACHER",
      investigadores: "RESEARCHER",
      estudantes: "STUDENT",
      producao: "TEACHER",
      projetos: "RESEARCHER",
      curriculos: "PROFESSIONAL",
    };
    const mappedType = profileTypeMap[targetEntity] || "TEACHER";

    // Extrai fields suportados pelas actions
    const allowedFields = new Set([
      "full_name",
      "professional_name",
      "bio",
      "education",
      "experience",
      "competencies",
      "research_areas",
      "publications",
      "projects",
      "faculty",
      "department",
    ]);

    const mappedFields = new Set<string>();
    SCOPE_CATEGORIES.forEach((cat) => {
      cat.fields.forEach((f) => {
        if (checkedIds.has(f.id) && allowedFields.has(f.fieldKey)) {
          mappedFields.add(f.fieldKey);
        }
      });
    });

    if (mappedFields.size === 0) {
      mappedFields.add("full_name");
      mappedFields.add("publications");
    }

    const formData = new FormData();
    formData.append("name", appName);
    formData.append("contact", "Reitoria / Gabinete de Sistemas");
    formData.append("description", `Consumo de ${targetEntity} com quota de ${rateLimit} req/dia.`);
    formData.append("expires_days", expiresDays);
    formData.append("profileTypes", mappedType);
    mappedFields.forEach((f) => formData.append("fields", f));

    startTransition(async () => {
      const result = await createApiIntegration(formData);
      if (result.success && result.apiKey) {
        setGeneratedKey(result.apiKey);
        setModalOpen(true);
        router.refresh();
      } else if (!result.success) {
        setErrorMessage(result.error);
      }
    });
  }

  function downloadCredentials() {
    const content = `# UNIKIVI Vitae API Credentials
UNIKIVI_API_KEY=${generatedKey || "ukv_live_sample"}
UNIKIVI_ENDPOINT=${endpointUrl}
UNIKIVI_ENTITY=${targetEntity}
UNIKIVI_RATE_LIMIT=${rateLimit}
GENERATED_AT=${new Date().toISOString()}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unikivi-api-${targetEntity}.env`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-label-sm text-xs text-outline">
        <span>Admin</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Integrações &amp; API</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-primary">Gerador de Endpoints</span>
      </nav>

      {/* 1. Header Area */}
      <div className="relative overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary-container/50 bg-secondary-container/20 px-3 py-1 text-on-secondary-container">
              <span className="material-symbols-outlined text-sm font-semibold">shield_locked</span>
              <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider">
                Segurança &amp; Interoperabilidade
              </span>
            </div>
            <h1 className="font-headline-lg text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
              Gerador de API &amp; Exportação Institucional
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed sm:text-base">
              Configure permissões de acesso, selecione entidades e atributos restritos para emitir
              endpoints RESTful seguros e chaves com permissões granulares para sistemas universitários
              e parceiros de investigação.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
            <span className="rounded border border-outline-variant/40 bg-surface-container px-3 py-1 font-label-sm text-xs text-on-surface-variant">
              Gateway v1.4.2
            </span>
            <span className="flex items-center gap-1.5 font-label-sm text-xs font-semibold text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
              Status: Operacional
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
          {errorMessage}
        </div>
      )}

      {/* 2. Main Layout: 12-Column Grid */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column (8 Cols): Primary Generator Form */}
        <section className="space-y-6 lg:col-span-8">
          <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 sm:p-8 shadow-sm">
            <div className="mb-6 border-b border-outline-variant/40 pb-5">
              <h2 className="flex items-center gap-2 font-headline-md text-lg font-bold text-primary sm:text-xl">
                <span className="material-symbols-outlined text-2xl text-secondary">tune</span>
                Configuração do Endpoint
              </h2>
              <p className="mt-1 font-body-md text-xs text-on-surface-variant sm:text-sm">
                Defina a identidade do consumidor institucional e o perímetro dos dados partilhados.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field: Nome da Aplicação */}
              <div className="space-y-2">
                <label
                  htmlFor="app-name"
                  className="block font-headline-md text-sm font-semibold text-primary"
                >
                  Nome da Aplicação / Projeto Consumidor
                </label>
                <div className="relative">
                  <input
                    id="app-name"
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Portal de Investigação FCT / Sistema Académico SIGA"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-sm text-on-surface outline-none transition-all placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-3.5 text-lg text-outline">
                    domain
                  </span>
                </div>
                <p className="font-label-sm text-[11px] text-outline">
                  Identificador de auditoria para rastreio de requisições no SIEM da Reitoria.
                </p>
              </div>

              {/* Grid: Entidade e Taxa Limite */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Entidade */}
                <div className="space-y-2">
                  <label
                    htmlFor="target-entity"
                    className="block font-headline-md text-sm font-semibold text-primary"
                  >
                    Entidade Alvo (Target)
                  </label>
                  <div className="relative">
                    <select
                      id="target-entity"
                      value={targetEntity}
                      onChange={(e) => setTargetEntity(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-10 font-body-md text-sm text-on-surface outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                    >
                      <option value="docentes">Docentes (Corpo Docente)</option>
                      <option value="investigadores">Investigadores &amp; Pós-Doc</option>
                      <option value="estudantes">Estudantes &amp; Mestrandos</option>
                      <option value="producao">Produção Científica</option>
                      <option value="projetos">Projetos de Investigação</option>
                      <option value="curriculos">Currículos Aprovados</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-3.5 text-xl text-outline">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Quota */}
                <div className="space-y-2">
                  <label
                    htmlFor="rate-limit"
                    className="block font-headline-md text-sm font-semibold text-primary"
                  >
                    Taxa Limite (Rate Limiting)
                  </label>
                  <div className="relative">
                    <select
                      id="rate-limit"
                      value={rateLimit}
                      onChange={(e) => setRateLimit(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-10 font-body-md text-sm text-on-surface outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                    >
                      <option value="5000">5.000 req/dia (Padrão)</option>
                      <option value="15000">15.000 req/dia (Centrais)</option>
                      <option value="unlimited">60 req/min (Burst)</option>
                      <option value="sandbox">500 req/dia (Sandbox)</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-3.5 text-xl text-outline">
                      speed
                    </span>
                  </div>
                </div>

                {/* Validade */}
                <div className="space-y-2">
                  <label
                    htmlFor="expires-days"
                    className="block font-headline-md text-sm font-semibold text-primary"
                  >
                    Validade da Chave
                  </label>
                  <div className="relative">
                    <select
                      id="expires-days"
                      value={expiresDays}
                      onChange={(e) => setExpiresDays(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-10 font-body-md text-sm text-on-surface outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                    >
                      <option value="30">30 dias</option>
                      <option value="90">90 dias (Recomendado)</option>
                      <option value="180">180 dias</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-3.5 text-xl text-outline">
                      schedule
                    </span>
                  </div>
                </div>
              </div>

              {/* Categorias de Escopos & Checkboxes */}
              <div className="space-y-4 border-t border-outline-variant/40 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-primary sm:text-base">
                      Campos e Escopos de Dados Disponíveis (Field-Level Permissions)
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant">
                      Selecione apenas os atributos autorizados para o consentimento de transferência.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="font-label-sm text-xs font-semibold text-secondary hover:underline"
                  >
                    Marcar Todas as Categorias
                  </button>
                </div>

                {/* Categories container */}
                <div className="space-y-4 pt-2">
                  {SCOPE_CATEGORIES.map((cat) => {
                    return (
                      <div
                        key={cat.id}
                        className="rounded-xl border border-outline-variant/70 bg-surface/50 p-4 transition-colors hover:border-secondary"
                      >
                        <div className="mb-3 flex items-center justify-between border-b border-outline-variant/30 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl text-primary">
                              {cat.icon}
                            </span>
                            <h4 className="font-headline-md text-xs font-bold text-primary sm:text-sm">
                              {cat.title}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCategory(cat.id)}
                            className="font-label-sm text-xs text-secondary hover:underline"
                          >
                            Selecionar Todos
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {cat.fields.map((field) => {
                            const isChecked = checkedIds.has(field.id);
                            return (
                              <label
                                key={field.id}
                                className="flex cursor-pointer select-none items-center gap-2 text-xs sm:text-sm text-on-surface"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleCheckbox(field.id)}
                                  className="rounded border-outline-variant text-primary focus:ring-secondary-container"
                                />
                                <span>{field.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/40 pt-6">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center gap-2 rounded-lg border border-outline px-5 py-2.5 font-headline-md text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-base">restart_alt</span>
                  Restaurar Predefinições
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-headline-md text-xs font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base text-secondary-container">
                    key
                  </span>
                  {pending ? "A Gerar..." : "Gerar API & Credenciais"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column (4 Cols): Endpoint Preview & Guidelines */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Card: Pré-visualização do Endpoint em Tempo Real */}
          <div className="space-y-5 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-headline-md text-sm font-bold text-primary sm:text-base">
                <span className="material-symbols-outlined text-xl text-secondary">terminal</span>
                Pré-visualização do Endpoint
              </h3>
              <span className="h-2.5 w-2.5 rounded-full bg-secondary-container animate-pulse"></span>
            </div>

            {/* Dynamic URL */}
            <div className="space-y-1.5">
              <span className="font-label-sm text-xs font-semibold text-outline">
                URL de Requisição Dinâmica:
              </span>
              <div className="break-all rounded-lg border border-outline-variant/30 bg-primary p-3 font-label-sm text-xs text-secondary-container select-all">
                <span className="font-bold text-white">GET </span>
                {endpointUrl}
              </div>
            </div>

            {/* JSON Output Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs font-semibold text-outline">
                  Formato da Resposta (JSON):
                </span>
                <span className="font-label-sm text-xs text-secondary font-bold">200 OK</span>
              </div>
              <div className="max-h-52 overflow-x-auto rounded-lg border border-outline-variant/50 bg-surface-container p-3 font-mono text-xs text-on-surface">
                <pre className="leading-relaxed">
                  <code>{`{
  "status": "success",
  "entity": "${targetEntity}",
  "quota_remaining": ${rateLimit === "unlimited" ? "60" : Number(rateLimit) - 1},
  "data": [
    {
      "id": "doc_90214",
      "name": "Prof. Doutor Manuel K. S.",
      "orcid": "0000-0002-1825-0097",
      "role": "Catedrático de IA",
      "publications_count": 34
    }
  ]
}`}</code>
                </pre>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap gap-2 border-t border-outline-variant/30 pt-3">
              <span className="flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container px-2.5 py-1 font-label-sm text-[11px] font-semibold text-primary">
                <span className="material-symbols-outlined text-xs text-secondary">
                  verified_user
                </span>{" "}
                RLS Ativo
              </span>
              <span className="flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container px-2.5 py-1 font-label-sm text-[11px] font-semibold text-primary">
                <span className="material-symbols-outlined text-xs text-secondary">lock</span> TLS
                1.3
              </span>
              <span className="flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container px-2.5 py-1 font-label-sm text-[11px] font-semibold text-primary">
                <span className="material-symbols-outlined text-xs text-secondary">history</span>{" "}
                Auditoria Automática
              </span>
            </div>
          </div>

          {/* Card: Diretrizes de Governação de Dados */}
          <div className="space-y-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center gap-2 font-headline-md text-sm font-bold text-primary sm:text-base">
              <span className="material-symbols-outlined text-xl text-primary">policy</span>
              Diretrizes de Governação de Dados
            </div>
            <p className="font-body-md text-xs leading-relaxed text-on-surface-variant">
              Em conformidade com a Política Institucional de Ciência Aberta e Proteção de Dados da
              Universidade Kimpa Vita:
            </p>
            <ul className="space-y-2.5 font-body-md text-xs text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-sm text-secondary">
                  check_circle
                </span>
                <span>As chaves emitidas são intransmissíveis e vinculadas ao projeto.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-sm text-secondary">
                  check_circle
                </span>
                <span>
                  Consultas biográficas pessoais são indexadas e mantidas em registo por 5 anos.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-sm text-secondary">
                  check_circle
                </span>
                <span>
                  Revogações de emergência podem ser executadas instantaneamente pelo Super Admin.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* 3. Existing Integrations List */}
      <section className="space-y-4 pt-6">
        <div>
          <h2 className="font-headline-md text-lg font-bold text-primary sm:text-xl">
            Integrações Registadas ({clients.length})
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant sm:text-sm">
            Revise tipos de perfil, campos, validade e atividade das chaves emitidas.
          </p>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center text-sm text-on-surface-variant">
            Ainda não foram criadas integrações institucionais. Utilize o gerador acima para provisionar a primeira.
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => {
              const isActive = client.status === "ACTIVE";
              return (
                <article
                  key={client.id}
                  className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-outline-variant bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-headline-md text-base font-bold text-primary">
                          {client.name}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-label-sm text-[11px] font-bold uppercase ${
                            isActive
                              ? "bg-secondary-container/30 text-on-secondary-container border border-secondary-container/50"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {isActive ? "Ativa" : "Suspensa"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {client.description || "Sem descrição informada."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = isActive ? "SUSPENDED" : "ACTIVE";
                          startTransition(async () => {
                            await setApiClientStatus(client.id, next);
                            router.refresh();
                          });
                        }}
                        disabled={pending}
                        className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 font-label-sm text-xs font-semibold text-primary hover:border-primary disabled:opacity-50"
                      >
                        {isActive ? "Suspender" : "Reativar"}
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="font-label-sm text-xs font-semibold text-outline uppercase tracking-wider mb-2">
                      Chaves de Acesso Provisionadas ({client.keys.length})
                    </p>
                    {client.keys.length ? (
                      <div className="divide-y divide-outline-variant/40 rounded-lg border border-outline-variant/60">
                        {client.keys.map((k) => (
                          <div
                            key={k.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs"
                          >
                            <div>
                              <code className="font-bold text-primary font-mono">{k.key_prefix}...</code>
                              <span className="ml-2 font-label-sm text-[11px] text-outline">
                                ({k.status} · {k.request_count} reqs)
                              </span>
                            </div>
                            {k.status === "ACTIVE" && (
                              <button
                                type="button"
                                onClick={() => {
                                  startTransition(async () => {
                                    await revokeApiKey(k.id);
                                    router.refresh();
                                  });
                                }}
                                disabled={pending}
                                className="rounded border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                              >
                                Revogar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant">Nenhuma chave ativa.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Interactive Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl space-y-6 rounded-2xl border border-outline-variant bg-white p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-secondary-container/50 bg-secondary-container/20 text-on-secondary-container">
                <span className="material-symbols-outlined text-3xl font-bold">task_alt</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  Chave de API &amp; Endpoint Gerados com Sucesso
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant">
                  A infraestrutura provisionou os tokens e as regras de firewall correspondentes.
                </p>
              </div>
            </div>

            {/* Security Warning Box */}
            <div className="flex items-start gap-3 rounded-lg border border-tertiary-fixed-dim/60 bg-tertiary-fixed/30 p-3.5 text-tertiary">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-xl text-tertiary">
                warning
              </span>
              <div className="font-body-md text-xs leading-relaxed">
                <span className="font-bold">Aviso Crítico:</span> Esta chave de API só será exibida
                uma única vez. Guarde-a de imediato num gestor de segredos institucional. Não partilhe
                via email ou repositórios públicos.
              </div>
            </div>

            {/* Outputs */}
            <div className="space-y-4">
              {/* Chave Secreta */}
              <div className="space-y-1">
                <label className="block font-label-sm text-xs font-semibold text-primary">
                  Chave Secreta Institucional (API Token):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedKey || "ukv_live_sample"}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 font-mono text-xs font-bold text-primary outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(generatedKey || "", "chave")}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant bg-surface px-3 py-2 font-headline-md text-xs font-semibold text-primary transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    {copySuccess === "chave" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Endpoint URL */}
              <div className="space-y-1">
                <label className="block font-label-sm text-xs font-semibold text-primary">
                  Endpoint Configurado:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={endpointUrl}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container px-3 py-2 font-mono text-xs text-on-surface-variant outline-none select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(endpointUrl, "url")}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-outline-variant bg-surface px-3 py-2 font-headline-md text-xs font-semibold text-primary transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    {copySuccess === "url" ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>

            {/* Scope Summary List */}
            <div className="space-y-2 rounded-xl border border-outline-variant/50 bg-surface p-4">
              <h4 className="font-headline-md text-xs font-bold uppercase tracking-wider text-primary">
                Metadados da Emissão:
              </h4>
              <div className="grid grid-cols-2 gap-2 font-body-md text-xs text-on-surface-variant">
                <div>
                  <span className="font-semibold text-primary">Entidade:</span> {targetEntity}
                </div>
                <div>
                  <span className="font-semibold text-primary">Permissões:</span> {checkedIds.size} atributos
                </div>
                <div>
                  <span className="font-semibold text-primary">Validade:</span> {expiresDays} dias
                </div>
                <div>
                  <span className="font-semibold text-primary">Quota:</span> {rateLimit} req/dia
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-end gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={downloadCredentials}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline px-4 py-2.5 font-headline-md text-xs font-semibold text-primary transition-colors hover:bg-surface-container sm:w-auto"
              >
                <span className="material-symbols-outlined text-sm">file_download</span>
                Transferir Credenciais (.env)
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-headline-md text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container sm:w-auto"
              >
                <span className="material-symbols-outlined text-sm text-secondary-container">
                  done_all
                </span>
                Concluir &amp; Registar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
