"use client";

import { useState, useTransition } from "react";
import { addCertification, deleteCertification } from "@/app/dashboard/certificacoes/actions";

type Certification = {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
};

const inputClass =
  "w-full bg-surface border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 px-0 py-2 font-body-md text-primary transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">{label}</span>
      {children}
    </label>
  );
}

function formatMonthYear(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-PT", { month: "short", year: "numeric" });
}

export default function CertificationsManager({
  profileId,
  certifications,
}: {
  profileId: string;
  certifications: Certification[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleAdd(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await addCertification(profileId, formData);
      if (result.success) setShowForm(false);
      else setError(result.error ?? "Erro ao guardar.");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Eliminar esta certificação?")) return;
    startTransition(() => {
      deleteCertification(id);
    });
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-3xl text-primary mb-2">Certificações e Qualificações</h1>
          <p className="font-body-lg text-on-surface-variant">
            Registe e valide as suas credenciais profissionais e académicas. A documentação rigorosa
            das suas certificações reforça a autoridade do seu perfil no ecossistema UNIKIVI.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="shrink-0 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Adicionar Certificação
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-8 space-y-8">
          {showForm && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
              <h2 className="font-headline-md text-xl text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">workspace_premium</span>
                Nova Certificação
              </h2>
              <form action={handleAdd} className="space-y-6">
                <Field label="Nome da Certificação">
                  <input name="name" required placeholder="Ex: AWS Certified Solutions Architect" className={inputClass} />
                </Field>
                <Field label="Organização Emissora">
                  <input name="issuer" required placeholder="Ex: Amazon Web Services (AWS)" className={inputClass} />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Data de Emissão">
                    <input name="issue_date" type="date" className={inputClass} />
                  </Field>
                  <Field label="Data de Expiração (Opcional)">
                    <input name="expiry_date" type="date" className={inputClass} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="ID da Credencial">
                    <input name="credential_id" placeholder="ID único" className={inputClass} />
                  </Field>
                  <Field label="URL da Credencial">
                    <input name="credential_url" type="url" placeholder="https://..." className={inputClass} />
                  </Field>
                </div>

                {error && <p className="text-error font-label-sm">{error}</p>}

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isPending} className="px-6 py-2 rounded-lg font-body-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
                    {isPending ? "A guardar..." : "Guardar Certificação"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div>
            <h2 className="font-headline-md text-lg text-primary mb-4">Certificações Registadas</h2>
            {certifications.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 text-center text-on-surface-variant font-body-md">
                Ainda não adicionaste nenhuma certificação.
              </div>
            ) : (
              <div className="relative pl-10 space-y-6">
                <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-outline-variant/40" />
                {certifications.map((cert) => (
                  <div key={cert.id} className="relative">
                    <div className="absolute -left-10 top-6 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-base text-on-surface-variant">workspace_premium</span>
                    </div>
                    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm group">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-md text-lg text-primary mb-1">{cert.name}</h3>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      <p className="font-body-md text-on-surface-variant mb-2">{cert.issuer}</p>
                      <p className="font-label-sm text-on-surface-variant/80 mb-3">
                        Emitido: {formatMonthYear(cert.issue_date) ?? "—"} ·{" "}
                        {cert.expiry_date ? `Expira: ${formatMonthYear(cert.expiry_date)}` : "Sem expiração"}
                      </p>
                      {cert.credential_url && (
                        <a 
                          href={cert.credential_url}
                          target="_blank"
                          className="font-label-sm text-secondary hover:underline flex items-center gap-1 w-fit"
                        >
                          Mostrar Credencial
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm sticky top-24">
            <h4 className="font-label-sm text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              Resumo
            </h4>
            <p className="font-body-md text-sm text-on-surface-variant">
              {certifications.length > 0
                ? `Tens ${certifications.length} certificaç${certifications.length > 1 ? "ões" : "ão"} registada${certifications.length > 1 ? "s" : ""}.`
                : "Adiciona a tua primeira certificação para reforçar a credibilidade do teu perfil."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}