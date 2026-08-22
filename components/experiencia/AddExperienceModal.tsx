"use client";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONSULTANT", "VISITING", "OTHER"];

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

export default function AddExperienceModal({
  onClose,
  onSubmit,
  isPending,
  error,
}: {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  error: string;
}) {
  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl border border-outline-variant overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline-md text-xl text-primary">Adicionar Experiência</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary rounded-full p-1 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form action={onSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Cargo / Posição">
              <input name="position" required placeholder="Ex: Pesquisador Principal" className={inputClass} />
            </Field>
            <Field label="Organização">
              <input name="organization" required placeholder="Ex: Kimpa Vita University" className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Localização">
              <input name="location" placeholder="Ex: Uíge, Angola" className={inputClass} />
            </Field>
            <Field label="Tipo de Vínculo">
              <select name="employment_type" className={inputClass}>
                <option value="">Selecione...</option>
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Data de Início">
              <input name="start_date" type="date" className={inputClass} />
            </Field>
            <Field label="Data de Fim">
              <div className="flex gap-4 items-end">
                <input name="end_date" type="date" className={inputClass} />
                <label className="flex items-center gap-2 pb-2 whitespace-nowrap text-sm text-on-surface-variant">
                  <input name="is_current" type="checkbox" className="rounded text-primary focus:ring-primary" />
                  Atual
                </label>
              </div>
            </Field>
          </div>

          <Field label="Descrição">
            <textarea
              name="description"
              rows={5}
              placeholder={"Primeira linha: resumo geral.\nLinhas seguintes: uma conquista por linha (viram bullets)."}
              className={inputClass}
            />
          </Field>

          {error && <p className="text-error font-label-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded-lg font-body-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
            >
              {isPending ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}