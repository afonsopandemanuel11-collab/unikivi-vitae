"use client";

import { useState, useTransition } from "react";
import { addEducation, deleteEducation } from "@/app/dashboard/educacao/actions";
import AddEducationModal from "./AddEducationModal";

type Education = {
  id: string;
  degree: string;
  course: string;
  institution: string;
  institution_country: string | null;
  start_year: number | null;
  end_year: number | null;
  field_of_study: string | null;
  description: string | null;
};

export default function EducationManager({
  profileId,
  education,
}: {
  profileId: string;
  education: Education[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAdd(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await addEducation(profileId, formData);
      if (result.success) setModalOpen(false);
      else setError(result.error ?? "Erro ao guardar.");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Eliminar esta formação?")) return;
    startTransition(async () => {
      await deleteEducation(id);
    });
  }

  const stats = {
    graus: education.length,
    instituicoes: new Set(education.map((e) => e.institution)).size,
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-headline-lg text-3xl text-primary mb-2">Educação</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Gerencie as suas qualificações académicas e formações. Estes dados contribuem para o seu perfil
            público e relatórios institucionais.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-body-md font-medium hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined">add</span>
          Adicionar Formação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8">
          {education.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 text-center text-on-surface-variant font-body-md">
              Ainda não adicionaste nenhuma formação.
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm relative">
              <div className="absolute left-[56px] top-[40px] bottom-[40px] w-[2px] bg-outline-variant" />
              <div className="space-y-12 pl-12 relative">
                {education.map((edu, i) => (
                  <EducationItem key={edu.id} edu={edu} isCurrent={i === 0 && edu.end_year === null} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-secondary-fixed-dim/30 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-2 mb-4 text-secondary-fixed-dim">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h4 className="font-headline-md text-lg font-bold text-primary">Análise de Perfil</h4>
            </div>
            <p className="font-body-md text-on-surface-variant">
              {education.length > 0
                ? `Tens ${stats.graus} grau${stats.graus > 1 ? "s" : ""} registado${stats.graus > 1 ? "s" : ""}. Manter descrições detalhadas ajuda a tua visibilidade em pesquisas institucionais.`
                : "Adiciona a tua primeira formação para começares a construir o teu percurso académico."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col items-center justify-center text-center">
              <span className="font-display-xl text-3xl text-primary mb-1">{stats.graus}</span>
              <span className="font-label-sm text-on-surface-variant uppercase">Graus<br />Registados</span>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col items-center justify-center text-center">
              <span className="font-display-xl text-3xl text-primary mb-1">{stats.instituicoes}</span>
              <span className="font-label-sm text-on-surface-variant uppercase">Instituições<br />Distintas</span>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AddEducationModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} isPending={isPending} error={error} />
      )}
    </div>
  );
}

function EducationItem({
  edu,
  isCurrent,
  onDelete,
}: {
  edu: Education;
  isCurrent: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="relative">
      <div
        className={`absolute -left-12 top-1.5 w-3 h-3 rounded-full border-2 border-primary z-10 ${
          isCurrent ? "bg-primary" : "bg-surface-container-lowest"
        }`}
      />
      <div className="group border border-transparent hover:border-outline-variant hover:bg-surface rounded-xl p-6 -ml-6 transition-all">
        <div className="flex justify-between items-start mb-2">
          <span className="px-3 py-1 bg-surface-container-high text-on-surface text-label-sm font-label-sm rounded-full">
            {edu.degree}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => onDelete(edu.id)}
              className="w-8 h-8 rounded-full hover:bg-error-container hover:text-error flex items-center justify-center text-on-surface-variant"
              title="Eliminar"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
        <h3 className="font-headline-md text-xl text-primary mb-1">{edu.course}</h3>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body-md text-on-surface-variant mb-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">account_balance</span>
            {edu.institution}
          </span>
          {edu.institution_country && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">location_on</span>
              {edu.institution_country}
            </span>
          )}
          <span className="flex items-center gap-1 font-medium text-primary">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {edu.start_year} — {edu.end_year ?? "Presente"}
          </span>
        </div>
        {edu.description && <p className="font-body-md text-on-surface-variant leading-relaxed">{edu.description}</p>}
      </div>
    </div>
  );
}