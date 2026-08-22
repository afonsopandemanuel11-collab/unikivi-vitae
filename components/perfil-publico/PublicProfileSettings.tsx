"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updatePublicProfileSettings } from "@/app/dashboard/perfil-publico/actions";

type SectionVisibility = {
  education: boolean;
  experience: boolean;
  publications: boolean;
  projects: boolean;
  awards: boolean;
  skills: boolean;
};

type Profile = {
  id: string;
  slug: string;
  search_indexable: boolean;
  section_visibility: SectionVisibility;
};

const SECTIONS: { key: keyof SectionVisibility; label: string; icon: string }[] = [
  { key: "education", label: "Formação Académica", icon: "school" },
  { key: "experience", label: "Experiência Profissional & Docência", icon: "work" },
  { key: "publications", label: "Publicações & Artigos", icon: "menu_book" },
  { key: "projects", label: "Projetos", icon: "rocket_launch" },
  { key: "awards", label: "Prémios & Certificações", icon: "workspace_premium" },
  { key: "skills", label: "Competências", icon: "psychology" },
];

function Toggle({ checked, onChange, name }: { checked: boolean; onChange: (v: boolean) => void; name: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-surface-container-highest"}`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
      <input type="checkbox" name={name} checked={checked} readOnly className="hidden" />
    </button>
  );
}

export default function PublicProfileSettings({ profile }: { profile: Profile }) {
  const [slug, setSlug] = useState(profile.slug);
  const [indexable, setIndexable] = useState(profile.search_indexable);
  const [sections, setSections] = useState<SectionVisibility>(profile.section_visibility);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    startTransition(async () => {
      const result = await updatePublicProfileSettings(formData);
      if (result.success) setStatus("success");
      else {
        setStatus("error");
        setErrorMsg(result.error ?? "Erro desconhecido.");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <span className="flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-lg">public</span>
            Configurações
          </span>
          <h1 className="font-headline-lg text-3xl text-primary mb-2">Perfil Público</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Gerencie como a comunidade académica e o público externo visualizam o seu portfólio,
            publicações e histórico na instituição.
          </p>
        </div>
        <Link
          href={`/perfil/${profile.id}`}
          target="_blank"
          className="shrink-0 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">visibility</span>
          Visualizar Perfil Público
        </Link>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h2 className="font-headline-md text-lg text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">link</span>
              Identidade & URL
            </h2>
            <label className="block mb-2">
              <span className="font-label-sm text-on-surface-variant uppercase">URL Personalizada (Slug)</span>
            </label>
            <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant overflow-hidden">
              <span className="px-3 py-2 font-label-sm text-on-surface-variant bg-surface-container whitespace-nowrap">
                unikivi.edu.ao/v/
              </span>
              <input
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 font-body-md text-primary focus:outline-none"
              />
            </div>
            <p className="font-label-sm text-on-surface-variant/70 mt-2">
              Esta é a ligação que vais partilhar em publicações e redes externas.
            </p>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-outline-variant">
              <div>
                <p className="font-body-md font-medium text-on-surface">Indexação em Motores de Busca</p>
                <p className="font-body-md text-sm text-on-surface-variant">Permitir que o Google e outros encontrem o teu perfil.</p>
              </div>
              <Toggle checked={indexable} onChange={setIndexable} name="search_indexable" />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h2 className="font-headline-md text-lg text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">visibility</span>
              Visibilidade de Secções
            </h2>
            <p className="font-body-md text-on-surface-variant mb-6">
              Controla quais partes do teu dossiê académico estão disponíveis para visitantes não autenticados.
            </p>
            <div className="space-y-1">
              {SECTIONS.map((s) => (
                <div key={s.key} className="flex items-center justify-between py-3 border-b border-outline-variant/50 last:border-0">
                  <span className="flex items-center gap-3 font-body-md text-on-surface">
                    <span className="material-symbols-outlined text-on-surface-variant">{s.icon}</span>
                    {s.label}
                  </span>
                  <Toggle
                    checked={sections[s.key]}
                    onChange={(v) => setSections({ ...sections, [s.key]: v })}
                    name={`visibility_${s.key}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {status === "error" && <p className="text-error font-label-sm">{errorMsg}</p>}
          {status === "success" && <p className="text-secondary font-label-sm">Definições guardadas com sucesso.</p>}

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isPending ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h4 className="font-label-sm text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
              Boas Práticas
            </h4>
            <h3 className="font-headline-md text-lg text-primary mb-3">Como maximizar o teu impacto visual</h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-4">
              Mantém o slug (URL) o mais próximo possível do teu nome de citação principal, e garante
              que as secções mais relevantes do teu percurso estão visíveis publicamente.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}