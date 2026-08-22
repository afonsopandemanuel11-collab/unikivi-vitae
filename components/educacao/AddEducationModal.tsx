"use client";

const DEGREES = ["Licenciatura", "Mestrado", "Doutoramento", "Especialização", "Pós-Doutoramento"];
const COUNTRIES = ["Angola", "Portugal", "Brasil", "África do Sul"];

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

export default function AddEducationModal({
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
          <h3 className="font-headline-md text-xl text-primary">Adicionar Formação</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary rounded-full p-1 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form action={onSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Grau Académico">
              <select name="degree" required className={inputClass}>
                <option value="">Selecione...</option>
                {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Curso">
              <input name="course" required placeholder="Ex: Engenharia Informática" className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Instituição">
              <input name="institution" required placeholder="Nome da universidade ou instituto" className={inputClass} />
            </Field>
            <Field label="País">
              <select name="institution_country" defaultValue="Angola" className={inputClass}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Ano de Início">
              <input name="start_year" type="number" placeholder="YYYY" className={inputClass} />
            </Field>
            <Field label="Ano de Conclusão">
              <div className="flex gap-4 items-end">
                <input name="end_year" type="number" placeholder="YYYY" className={inputClass} />
                <label className="flex items-center gap-2 pb-2 whitespace-nowrap text-sm text-on-surface-variant">
                  <input name="is_ongoing" type="checkbox" className="rounded text-primary focus:ring-primary" />
                  A frequentar
                </label>
              </div>
            </Field>
          </div>

          <Field label="Área de Estudo (Opcional)">
            <input name="field_of_study" placeholder="Ex: Sistemas Distribuídos, Inteligência Artificial" className={inputClass} />
          </Field>

          <Field label="Descrição">
            <textarea name="description" rows={3} placeholder="Breve descrição sobre o curso, tese ou principais conquistas..." className={inputClass} />
          </Field>

          {error && <p className="text-error font-label-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-body-md text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-6 py-2 rounded-lg font-body-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50">
              {isPending ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}