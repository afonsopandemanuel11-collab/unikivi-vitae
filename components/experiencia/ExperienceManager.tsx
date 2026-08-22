"use client";

import { useState, useTransition } from "react";
import { addExperience, deleteExperience } from "@/app/dashboard/experiencia/actions";
import AddExperienceModal from "./AddExperienceModal";

type Experience = {
  id: string;
  organization: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  employment_type: string | null;
};

function yearsBetween(start: string | null, end: string | null) {
  if (!start) return 0;
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

export default function ExperienceManager({
  profileId,
  experiences,
}: {
  profileId: string;
  experiences: Experience[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAdd(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await addExperience(profileId, formData);
      if (result.success) setModalOpen(false);
      else setError(result.error ?? "Erro ao guardar.");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Eliminar esta experiência?")) return;
    startTransition(async () => {
      await deleteExperience(id);
    });
  }

  const totalYears = Math.round(
    experiences.reduce((sum, e) => sum + yearsBetween(e.start_date, e.end_date), 0)
  );
  const totalOrgs = new Set(experiences.map((e) => e.organization)).size;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-3xl text-primary mb-4">Experiência e Atividades</h1>
          <p className="font-body-lg text-on-surface-variant">
            Faça a gestão do seu histórico profissional e académico. Um registo detalhado aumenta a
            visibilidade e a credibilidade do seu perfil institucional.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Adicionar Experiência
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 space-y-8 relative">
          {experiences.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 text-center text-on-surface-variant font-body-md">
              Ainda não adicionaste nenhuma experiência.
            </div>
          ) : (
            <>
              <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-outline-variant/30 hidden md:block" />
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} onDelete={handleDelete} />
              ))}
            </>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Resumo Profissional</h4>
              <span className="material-symbols-outlined text-primary-fixed-dim text-2xl">insights</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low rounded-xl p-4 text-center border border-outline-variant/30">
                <div className="font-display-xl text-3xl text-primary mb-1">{totalYears}</div>
                <div className="font-label-sm text-on-surface-variant">Anos de Experiência</div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4 text-center border border-outline-variant/30">
                <div className="font-display-xl text-3xl text-primary mb-1">{totalOrgs}</div>
                <div className="font-label-sm text-on-surface-variant">Organizações</div>
              </div>
            </div>
          </div>

          <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="material-symbols-outlined text-secondary-container text-xl">auto_awesome</span>
              <h4 className="font-label-sm font-semibold uppercase tracking-wider text-secondary-container">
                Análise da IA
              </h4>
            </div>
            <p className="font-body-md text-on-primary-container/80 relative z-10 leading-relaxed text-sm">
              {experiences.length > 0
                ? `O teu perfil regista ${totalOrgs} organização${totalOrgs > 1 ? "ões" : ""} ao longo de ${totalYears} anos. Manter as experiências atualizadas ajuda a credibilidade do teu perfil institucional.`
                : "Adiciona a tua primeira experiência para começares a construir o teu histórico profissional."}
            </p>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AddExperienceModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} isPending={isPending} error={error} />
      )}
    </div>
  );
}

function ExperienceCard({ exp, onDelete }: { exp: Experience; onDelete: (id: string) => void }) {
  const [paragraph, ...bullets] = (exp.description ?? "").split("\n").filter(Boolean);

  return (
    <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-sm md:ml-12 group transition-all hover:border-primary/20">
      <div
        className={`absolute -left-12 top-8 w-4 h-4 rounded-full hidden md:block z-10 ${
          exp.is_current ? "bg-primary border-4 border-surface" : "bg-surface border-2 border-outline-variant"
        }`}
      />
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-headline-md text-xl text-primary">{exp.position}</h3>
          <div className="flex items-center text-on-surface-variant mt-1 gap-2 font-body-md flex-wrap">
            <span className="font-semibold text-on-surface">{exp.organization}</span>
            {exp.location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-sm">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {exp.location}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(exp.id)}
            className="p-2 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full font-label-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          {exp.start_date ? new Date(exp.start_date).getFullYear() : "?"} —{" "}
          {exp.is_current ? "Presente" : exp.end_date ? new Date(exp.end_date).getFullYear() : "?"}
        </span>
        {exp.employment_type && (
          <span className="bg-primary/5 text-primary px-3 py-1 rounded-full font-label-sm">{exp.employment_type}</span>
        )}
      </div>

      <div className="text-on-surface-variant font-body-md leading-relaxed">
        {paragraph && <p>{paragraph}</p>}
        {bullets.length > 0 && (
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}