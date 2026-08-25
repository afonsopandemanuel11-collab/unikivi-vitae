"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteCurriculum,
  setDefaultCurriculum,
  duplicateCurriculum,
} from "@/app/dashboard/curriculos/actions";

const TEMPLATE_NAMES: Record<string, string> = {
  UNIKIVI_CLASSIC: "UNIKIVI Classic (ATS)",
  EXECUTIVE: "UNIKIVI Professional",
  ACADEMIC_COMPACT: "UNIKIVI Academic",
  MODERN_EDITORIAL: "UNIKIVI Modern",
  CIENCIA_VITAE: "Ciência Vitae",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "bg-amber-100 text-amber-800 border-amber-200" },
  PUBLISHED: { label: "Publicado", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ARCHIVED: { label: "Arquivado", color: "bg-slate-100 text-slate-800 border-slate-200" },
};

type CurriculumItem = {
  id: string;
  title: string;
  summary: string | null;
  template: string;
  status: string;
  is_default: boolean;
  language: string | null;
  current_version: number;
  updated_at: string;
  created_at: string;
};

export default function CurriculumDashboard({
  profileId,
  curricula,
}: {
  profileId: string;
  curricula: CurriculumItem[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [shareCurriculum, setShareCurriculum] = useState<CurriculumItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = curricula.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.status === activeTab;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (TEMPLATE_NAMES[c.template] ?? c.template).toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  async function handleSetDefault(id: string) {
    setLoadingId(id);
    const result = await setDefaultCurriculum(id, profileId);
    if (!result.success) setError(result.error ?? "Erro ao definir como principal.");
    setLoadingId(null);
    router.refresh();
  }

  async function handleDuplicate(id: string) {
    setLoadingId(id);
    const result = await duplicateCurriculum(id, profileId);
    if (!result.success) {
      setError(result.error ?? "Erro ao duplicar currículo.");
    } else {
      router.refresh();
    }
    setLoadingId(null);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Tem a certeza que deseja eliminar o currículo "${title}"?`)) return;
    setLoadingId(id);
    const result = await deleteCurriculum(id);
    if (!result.success) {
      setError(result.error ?? "Erro ao eliminar currículo.");
    } else {
      router.refresh();
    }
    setLoadingId(null);
  }

  function handleShare(c: CurriculumItem) {
    setShareCurriculum(c);
    setCopied(false);
  }

  function copyShareLink() {
    if (!shareCurriculum) return;
    const shareUrl = `${window.location.origin}/dashboard/curriculos/${shareCurriculum.id}/visualizar`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div>
      {/* Top Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="font-label-sm text-secondary uppercase tracking-widest text-xs">
            Gestão de Documentos Académicos & Profissionais
          </span>
          <h1 className="font-headline-lg text-primary text-3xl font-bold mt-1 mb-2">
            Meus Currículos
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-2xl text-sm">
            Crie e gira múltiplos currículos adaptados para diferentes vagas e objetivos,
            mantendo todos sincronizados com os dados estruturados do seu perfil.
          </p>
        </div>

        <Link
          href="/dashboard/curriculos/novo"
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Criar Novo Currículo</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-900">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-outline-variant p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { key: "ALL", label: "Todos", count: curricula.length },
            { key: "PUBLISHED", label: "Publicados", count: curricula.filter((c) => c.status === "PUBLISHED").length },
            { key: "DRAFT", label: "Rascunhos", count: curricula.filter((c) => c.status === "DRAFT").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou modelo..."
            className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      {/* Grid of Curricula */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-outline-variant p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">description</span>
          </div>
          <h3 className="font-headline-md text-primary text-lg font-bold mb-1">
            Nenhum currículo encontrado
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
            {curricula.length === 0
              ? "Ainda não criou nenhum currículo. Comece agora escolhendo um objetivo e um modelo profissional."
              : "Não foram encontrados currículos correspondentes à sua pesquisa."}
          </p>
          {curricula.length === 0 && (
            <Link
              href="/dashboard/curriculos/novo"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Criar o seu primeiro currículo</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const statusConfig = STATUS_LABELS[c.status] ?? STATUS_LABELS.DRAFT;
            const isProcessing = loadingId === c.id;

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                  c.is_default
                    ? "border-primary/60 ring-1 ring-primary/20 shadow-xs"
                    : "border-outline-variant hover:border-outline"
                }`}
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        v{c.current_version}
                      </span>
                      {c.is_default ? (
                        <span
                          title="Currículo Principal"
                          className="inline-flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold"
                        >
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span>Principal</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(c.id)}
                          disabled={isProcessing}
                          title="Definir como currículo principal"
                          className="text-on-surface-variant hover:text-amber-500 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-lg">star_border</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-headline-md text-primary text-lg font-bold leading-tight mb-2">
                    {c.title}
                  </h3>

                  <div className="space-y-1 text-xs text-on-surface-variant mb-4">
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">style</span>
                      <span>Modelo: <strong className="text-on-surface">{TEMPLATE_NAMES[c.template] ?? c.template}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                      <span>Atualizado em: {new Date(c.updated_at).toLocaleDateString("pt-PT")}</span>
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/curriculos/${c.id}/visualizar`}
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-white rounded-lg transition-colors"
                      title="Visualizar / Exportar PDF"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </Link>

                    <Link
                      href={`/dashboard/curriculos/${c.id}/editar`}
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-white rounded-lg transition-colors"
                      title="Editar Secções e Conteúdo"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </Link>

                    <button
                      onClick={() => handleDuplicate(c.id)}
                      disabled={isProcessing}
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Duplicar Currículo"
                    >
                      <span className="material-symbols-outlined text-lg">content_copy</span>
                    </button>

                    <button
                      onClick={() => handleShare(c)}
                      className="p-2 text-on-surface-variant hover:text-secondary hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Partilhar Link"
                    >
                      <span className="material-symbols-outlined text-lg">share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(c.id, c.title)}
                    disabled={isProcessing}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar Currículo"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal Dialog */}
      {shareCurriculum && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-outline-variant shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-md text-primary text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">share</span>
                Partilhar Currículo
              </h3>
              <button
                onClick={() => setShareCurriculum(null)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-on-surface-variant mb-4">
              Pode partilhar o link de visualização direta do currículo{" "}
              <strong>"{shareCurriculum.title}"</strong>.
            </p>

            <div className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-xl border border-outline-variant mb-4">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/curriculos/${shareCurriculum.id}/visualizar`}
                className="flex-1 bg-transparent text-xs text-on-surface focus:outline-none"
              />
              <button
                onClick={copyShareLink}
                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShareCurriculum(null)}
                className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary font-medium"
              >
                Fechar
              </button>
              <Link
                href={`/dashboard/curriculos/${shareCurriculum.id}/visualizar`}
                target="_blank"
                className="px-4 py-2 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-secondary/90 transition-colors"
              >
                Abrir Visualização
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
