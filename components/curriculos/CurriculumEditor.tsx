"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FullCurriculumData } from "./types";
import { CurriculumSnapshot, saveCurriculumSnapshot } from "@/app/dashboard/curriculos/actions";
import TemplateRenderer from "./templates/TemplateRenderer";

const ALL_SECTION_DEFS: Record<string, { label: string; icon: string }> = {
  summary: { label: "Resumo / Perfil", icon: "badge" },
  experience: { label: "Experiência Profissional", icon: "work" },
  education: { label: "Educação e Formação", icon: "school" },
  skills: { label: "Competências", icon: "psychology" },
  projects: { label: "Projetos", icon: "rocket_launch" },
  publications: { label: "Publicações Científicas", icon: "menu_book" },
  certifications: { label: "Certificações", icon: "workspace_premium" },
  awards: { label: "Prémios & Distinções", icon: "emoji_events" },
  languages: { label: "Idiomas", icon: "translate" },
  identifiers: { label: "Identificadores & Links", icon: "link" },
};

const TEMPLATE_OPTIONS = [
  { id: "UNIKIVI_CLASSIC", name: "UNIKIVI Classic (ATS)", badge: "ATS Friendly" },
  { id: "EXECUTIVE", name: "UNIKIVI Professional", badge: "Corporativo" },
  { id: "ACADEMIC_COMPACT", name: "UNIKIVI Academic", badge: "Científico" },
  { id: "MODERN_EDITORIAL", name: "UNIKIVI Modern", badge: "Inovador" },
];

const COLOR_PALETTE = [
  { name: "UNIKIVI Navy", hex: "#00113A" },
  { name: "Azul Safira", hex: "#1E40AF" },
  { name: "Esmeralda", hex: "#065F46" },
  { name: "Vinho Tinto", hex: "#831843" },
  { name: "Grafite Escuro", hex: "#1F2937" },
];

const FONT_OPTIONS = ["Inter", "Georgia", "JetBrains Mono"];

export default function CurriculumEditor({
  curriculumId,
  curriculumTitle,
  initialSnapshot,
  data,
}: {
  curriculumId: string;
  curriculumTitle: string;
  initialSnapshot: CurriculumSnapshot;
  data: FullCurriculumData;
}) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<CurriculumSnapshot>(initialSnapshot);
  const [activeTab, setActiveTab] = useState<"sections" | "filter" | "profile" | "design">("sections");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [zoom, setZoom] = useState<number>(100);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manipulação de Secções
  function moveSection(index: number, direction: "up" | "down") {
    const sections = [...(snapshot.sections || [])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    setSnapshot({ ...snapshot, sections });
  }

  function toggleSection(secId: string) {
    const sections = snapshot.sections || [];
    const newSections = sections.includes(secId)
      ? sections.filter((s) => s !== secId)
      : [...sections, secId];
    setSnapshot({ ...snapshot, sections: newSections });
  }

  // Manipulação de Itens Individuais
  function toggleItemSelection(section: keyof CurriculumSnapshot["selected_items"], itemId: string) {
    const selected = { ...(snapshot.selected_items || {}) };
    const currentList = selected[section] || [];

    // Se a lista estava vazia, significa que todos estavam selecionados por padrão
    // Inicializa com todos exceto o desmarcado
    let newList: string[];
    if (currentList.length === 0) {
      const allIds =
        section === "experiences" ? data.experiences.map((e) => e.id)
        : section === "education" ? data.education.map((e) => e.id)
        : section === "skills" ? data.skills.map((s) => s.id)
        : section === "projects" ? data.projects.map((p) => p.id)
        : section === "publications" ? data.publications.map((p) => p.id)
        : section === "certifications" ? data.certifications.map((c) => c.id)
        : section === "awards" ? data.awards.map((a) => a.id)
        : section === "languages" ? data.languages.map((l) => l.id)
        : section === "identifiers" ? data.identifiers.map((i) => i.id)
        : [];
      newList = allIds.filter((id) => id !== itemId);
    } else if (currentList.includes(itemId)) {
      newList = currentList.filter((id) => id !== itemId);
    } else {
      newList = [...currentList, itemId];
    }

    selected[section] = newList;
    setSnapshot({ ...snapshot, selected_items: selected });
  }

  function isItemChecked(section: keyof CurriculumSnapshot["selected_items"], itemId: string): boolean {
    const currentList = snapshot.selected_items?.[section];
    if (!currentList || currentList.length === 0) return true; // Selecionado por padrão
    return currentList.includes(itemId);
  }

  // Guardar Snapshot
  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    const result = await saveCurriculumSnapshot(
      curriculumId,
      snapshot,
      snapshot.custom_summary,
      "Atualização no editor de currículo"
    );

    if (!result.success) {
      setError(result.error ?? "Erro ao guardar alterações.");
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-outline-variant px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-40 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/dashboard/curriculos"
            className="p-1.5 sm:p-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Voltar aos Meus Currículos"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
          </Link>
          <div className="min-w-0">
            <span className="font-label-sm text-secondary uppercase tracking-widest text-[9px] sm:text-[10px] block truncate">
              Editor • UNIKIVI Vitae
            </span>
            <h1 className="font-headline-md text-primary text-xs sm:text-base font-bold leading-tight truncate max-w-[120px] sm:max-w-xs md:max-w-md">
              {curriculumTitle}
            </h1>
          </div>
        </div>

        {/* Mobile Switch Tab */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setMobileView("edit")}
            className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-colors ${mobileView === "edit" ? "bg-white text-primary shadow-xs" : "text-slate-600"}`}
          >
            Editar
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-colors ${mobileView === "preview" ? "bg-white text-primary shadow-xs" : "text-slate-600"}`}
          >
            Pré-visualizar
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {savedSuccess && (
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Guardado!
            </span>
          )}

          <Link
            href={`/dashboard/curriculos/${curriculumId}/visualizar`}
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">fullscreen</span>
            <span>Tela Cheia</span>
          </Link>

          <Link
            href={`/dashboard/curriculos/${curriculumId}/visualizar`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>PDF</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{saving ? "A guardar..." : "Guardar"}</span>
          </button>
        </div>
      </header>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT CONTROLS PANEL ================= */}
        <div
          className={`w-full lg:w-[480px] bg-white border-r border-outline-variant flex flex-col shrink-0 ${
            mobileView === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Subtabs Bar */}
          <div className="flex border-b border-outline-variant bg-slate-50/50 p-2 gap-1 overflow-x-auto">
            {[
              { id: "sections", label: "Secções", icon: "reorder" },
              { id: "filter", label: "Filtrar Itens", icon: "checklist" },
              { id: "profile", label: "Perfil & Resumo", icon: "badge" },
              { id: "design", label: "Modelo & Cores", icon: "palette" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-primary shadow-xs border border-outline-variant/60"
                    : "text-on-surface-variant hover:text-primary hover:bg-white/60"
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Panel Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-sm">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: SECTIONS REORDER & TOGGLE */}
            {activeTab === "sections" && (
              <div>
                <h3 className="text-sm font-bold text-primary mb-1">
                  Ordem e Visibilidade das Secções
                </h3>
                <p className="text-xs text-on-surface-variant mb-4">
                  Reordene as secções para cima ou para baixo e ative/desative conforme o objetivo da sua candidatura.
                </p>

                <div className="space-y-2">
                  {(snapshot.sections || []).map((secId, idx) => {
                    const def = ALL_SECTION_DEFS[secId] || { label: secId, icon: "category" };
                    return (
                      <div
                        key={secId}
                        className="flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-slate-50 hover:bg-white transition-all shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-slate-500 text-base">
                            {def.icon}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {def.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSection(idx, "up")}
                            disabled={idx === 0}
                            title="Mover para cima"
                            className="p-1 text-slate-500 hover:text-primary disabled:opacity-20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">arrow_upward</span>
                          </button>
                          <button
                            onClick={() => moveSection(idx, "down")}
                            disabled={idx === (snapshot.sections || []).length - 1}
                            title="Mover para baixo"
                            className="p-1 text-slate-500 hover:text-primary disabled:opacity-20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">arrow_downward</span>
                          </button>
                          <button
                            onClick={() => toggleSection(secId)}
                            title="Remover secção"
                            className="p-1 text-slate-400 hover:text-error transition-colors ml-1"
                          >
                            <span className="material-symbols-outlined text-base">visibility_off</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Available Sections to Add back */}
                {Object.keys(ALL_SECTION_DEFS).filter((id) => !(snapshot.sections || []).includes(id)).length > 0 && (
                  <div className="mt-6 pt-4 border-t border-outline-variant">
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                      Secções Disponíveis para Adicionar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(ALL_SECTION_DEFS)
                        .filter((id) => !(snapshot.sections || []).includes(id))
                        .map((secId) => {
                          const def = ALL_SECTION_DEFS[secId];
                          return (
                            <button
                              key={secId}
                              onClick={() => toggleSection(secId)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-outline text-xs font-medium text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                              <span>{def.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FILTER INDIVIDUAL ITEMS */}
            {activeTab === "filter" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1">
                    Selecionar Registos Específicos
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Desmarque os itens que não deseja exibir neste currículo sem os apagar do seu perfil.
                  </p>
                </div>

                {/* Experiences */}
                {data.experiences.length > 0 && (
                  <div className="border border-outline-variant rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">work</span>
                      Experiências ({data.experiences.length})
                    </h4>
                    <div className="space-y-2">
                      {data.experiences.map((exp) => (
                        <label key={exp.id} className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemChecked("experiences", exp.id)}
                            onChange={() => toggleItemSelection("experiences", exp.id)}
                            className="mt-0.5 w-4 h-4 accent-primary rounded"
                          />
                          <div>
                            <strong className="block text-slate-900">{exp.position}</strong>
                            <span className="text-slate-500">{exp.organization}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                  <div className="border border-outline-variant rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">school</span>
                      Educação ({data.education.length})
                    </h4>
                    <div className="space-y-2">
                      {data.education.map((edu) => (
                        <label key={edu.id} className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemChecked("education", edu.id)}
                            onChange={() => toggleItemSelection("education", edu.id)}
                            className="mt-0.5 w-4 h-4 accent-primary rounded"
                          />
                          <div>
                            <strong className="block text-slate-900">{edu.degree} em {edu.course}</strong>
                            <span className="text-slate-500">{edu.institution}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                  <div className="border border-outline-variant rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">rocket_launch</span>
                      Projetos ({data.projects.length})
                    </h4>
                    <div className="space-y-2">
                      {data.projects.map((p) => (
                        <label key={p.id} className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemChecked("projects", p.id)}
                            onChange={() => toggleItemSelection("projects", p.id)}
                            className="mt-0.5 w-4 h-4 accent-primary rounded"
                          />
                          <div>
                            <strong className="block text-slate-900">{p.title}</strong>
                            <span className="text-slate-500">{p.role}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {data.publications.length > 0 && (
                  <div className="border border-outline-variant rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      Publicações ({data.publications.length})
                    </h4>
                    <div className="space-y-2">
                      {data.publications.map((pub) => (
                        <label key={pub.id} className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemChecked("publications", pub.id)}
                            onChange={() => toggleItemSelection("publications", pub.id)}
                            className="mt-0.5 w-4 h-4 accent-primary rounded"
                          />
                          <div>
                            <strong className="block text-slate-900">{pub.title}</strong>
                            <span className="text-slate-500">{pub.journal ?? "Artigo"} ({pub.year ?? "—"})</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {data.certifications.length > 0 && (
                  <div className="border border-outline-variant rounded-xl p-4 bg-slate-50/50">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">workspace_premium</span>
                      Certificações ({data.certifications.length})
                    </h4>
                    <div className="space-y-2">
                      {data.certifications.map((c) => (
                        <label key={c.id} className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isItemChecked("certifications", c.id)}
                            onChange={() => toggleItemSelection("certifications", c.id)}
                            className="mt-0.5 w-4 h-4 accent-primary rounded"
                          />
                          <div>
                            <strong className="block text-slate-900">{c.name}</strong>
                            <span className="text-slate-500">{c.issuer}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CUSTOM PROFILE & SUMMARY */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1">
                    Personalização do Perfil neste Currículo
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Pode adaptar o título e o resumo especificamente para esta vaga sem afetar o seu perfil geral.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Título Profissional Específico
                  </label>
                  <input
                    type="text"
                    value={snapshot.custom_title ?? ""}
                    onChange={(e) => setSnapshot({ ...snapshot, custom_title: e.target.value })}
                    placeholder="Ex: Engenheiro de Software Full Stack"
                    className="w-full border border-outline-variant rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Resumo / Biografia Específica
                  </label>
                  <textarea
                    rows={6}
                    value={snapshot.custom_summary ?? ""}
                    onChange={(e) => setSnapshot({ ...snapshot, custom_summary: e.target.value })}
                    placeholder="Escreva um resumo direcionado aos requisitos desta oportunidade..."
                    className="w-full border border-outline-variant rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-secondary resize-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={snapshot.settings?.show_photo !== false}
                      onChange={(e) =>
                        setSnapshot({
                          ...snapshot,
                          settings: { ...snapshot.settings, show_photo: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span>Exibir foto de perfil (quando suportado pelo modelo)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={snapshot.settings?.show_contacts !== false}
                      onChange={(e) =>
                        setSnapshot({
                          ...snapshot,
                          settings: { ...snapshot.settings, show_contacts: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span>Exibir informações de contacto (Email, Telefone, Localização)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: TEMPLATE & DESIGN SETTINGS */}
            {activeTab === "design" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1">
                    Modelo & Configurações Visuais
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Alterne entre os 4 modelos e personalize a paleta cromática e a tipografia.
                  </p>
                </div>

                {/* Template Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Modelo Selecionado
                  </label>
                  <div className="space-y-2">
                    {TEMPLATE_OPTIONS.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => setSnapshot({ ...snapshot, template: tmpl.id })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          snapshot.template === tmpl.id
                            ? "border-primary bg-primary/5 font-bold text-primary shadow-xs"
                            : "border-outline-variant hover:border-outline bg-white text-slate-700"
                        }`}
                      >
                        <span className="text-xs">{tmpl.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {tmpl.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Cor Principal de Destaque
                  </label>
                  <div className="flex gap-2.5 flex-wrap">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() =>
                          setSnapshot({
                            ...snapshot,
                            settings: { ...snapshot.settings, primary_color: c.hex },
                          })
                        }
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          (snapshot.settings?.primary_color || "#00113A") === c.hex
                            ? "scale-110 border-white shadow-md ring-2 ring-primary"
                            : "border-transparent hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Família Tipográfica
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font}
                        onClick={() =>
                          setSnapshot({
                            ...snapshot,
                            settings: { ...snapshot.settings, font },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          (snapshot.settings?.font || "Inter") === font
                            ? "border-primary bg-primary text-white font-bold"
                            : "border-outline-variant bg-white text-slate-700 hover:border-outline"
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Densidade de Espaçamento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "compact", label: "Compacto" },
                      { id: "normal", label: "Normal" },
                      { id: "spacious", label: "Espaçoso" },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          setSnapshot({
                            ...snapshot,
                            settings: { ...snapshot.settings, density: d.id as any },
                          })
                        }
                        className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                          (snapshot.settings?.density || "normal") === d.id
                            ? "border-primary bg-primary text-white font-bold"
                            : "border-outline-variant bg-white text-slate-700 hover:border-outline"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT LIVE PREVIEW CANVAS ================= */}
        <div
          className={`flex-1 bg-slate-200/80 p-3 sm:p-6 md:p-10 overflow-y-auto overflow-x-auto flex flex-col items-center justify-start ${
            mobileView === "edit" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Zoom Controls */}
          <div className="mb-4 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-outline-variant shadow-xs">
            <button
              onClick={() => setZoom((z) => Math.max(75, z - 10))}
              className="text-slate-600 hover:text-primary p-1 cursor-pointer"
              title="Diminuir Zoom"
            >
              <span className="material-symbols-outlined text-base">zoom_out</span>
            </button>
            <span className="text-xs font-bold text-slate-700 w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="text-slate-600 hover:text-primary p-1 cursor-pointer"
              title="Aumentar Zoom"
            >
              <span className="material-symbols-outlined text-base">zoom_in</span>
            </button>
          </div>

          {/* Rendered Template Document Page (A4 Aspect Ratio) */}
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            className="w-full max-w-[820px] transition-transform shadow-2xl rounded-sm overflow-hidden flex justify-center"
          >
            <TemplateRenderer data={data} snapshot={snapshot} />
          </div>
        </div>
      </div>
    </div>
  );
}
