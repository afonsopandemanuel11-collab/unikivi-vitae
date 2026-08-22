// components/IdentifiersManager/IdentifiersManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addIdentifier, deleteIdentifier } from "@/app/dashboard/identificadores/actions";

const TYPES = [
  { value: "ORCID", label: "ORCID", icon: "fingerprint", placeholder: "Ex: 0000-0002-1825-0097", profileUrl: (v: string) => v.startsWith("http") ? v : `https://orcid.org/${v}` },
  { value: "CIENCIA_ID", label: "Ciência ID", icon: "account_balance", placeholder: "Ex: DA1E-7A14-0AE7", profileUrl: (v: string) => v.startsWith("http") ? v : `https://www.cienciavitae.pt/${v}` },
  { value: "SCOPUS", label: "Scopus ID", icon: "article", placeholder: "Ex: 57200000000", profileUrl: (v: string) => v.startsWith("http") ? v : `https://www.scopus.com/authid/detail.uri?authorId=${v}` },
  { value: "GOOGLE_SCHOLAR", label: "Google Scholar", icon: "school", placeholder: "Ex: abcd_1234", profileUrl: (v: string) => v.startsWith("http") ? v : `https://scholar.google.com/citations?user=${v}` },
  { value: "RESEARCHER_ID", label: "ResearcherID", icon: "badge", placeholder: "Ex: A-1000-2020", profileUrl: (v: string) => v },
  { value: "LATTES", label: "Currículo Lattes", icon: "description", placeholder: "Ex: 1234567890123456", profileUrl: (v: string) => v.startsWith("http") ? v : `http://lattes.cnpq.br/${v}` },
  { value: "OTHER", label: "Portfólio / Website / Outro", icon: "link", placeholder: "Ex: https://meuportfolio.com", profileUrl: (v: string) => v.startsWith("http") ? v : `https://${v}` },
];

type Identifier = {
  id: string;
  identifier_type: string;
  identifier_value: string;
  url: string | null;
};

export default function IdentifiersManager({
  profileId,
  identifiers,
}: {
  profileId: string;
  identifiers: Identifier[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState("ORCID");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) {
      setError("Por favor introduza o valor do identificador.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await addIdentifier(profileId, type, value.trim());

    if (!result.success) {
      setError(result.error ?? "Não foi possível adicionar o identificador.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setValue("");
    setAdding(false);
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja remover este identificador?")) return;
    setDeletingId(id);
    const result = await deleteIdentifier(id);
    if (!result.success) {
      setError(result.error ?? "Erro ao remover identificador.");
    } else {
      router.refresh();
    }
    setDeletingId(null);
  }

  return (
    <div>
      {/* Mensagens de Feedback */}
      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Identificador guardado com sucesso!</span>
        </div>
      )}

      {error && !adding && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Botao do topo */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAdding(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Adicionar Identificador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {identifiers.map((id) => {
          const config = TYPES.find((t) => t.value === id.identifier_type);
          return (
            <div key={id.id} className="bg-white rounded-xl border border-outline-variant p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    {config?.icon ?? "link"}
                  </span>
                </div>
                <span className="flex items-center gap-1 bg-surface-container text-on-surface-variant text-xs font-medium px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Manual
                </span>
              </div>

              <h3 className="font-headline-md text-headline-md text-primary text-lg mb-1">
                {config?.label ?? id.identifier_type}
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">{id.identifier_value}</p>

              <div className="flex items-center gap-2 pt-4 border-t border-outline-variant">
                {id.url && (
                  <a
                    href={id.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-container-low text-primary text-sm font-medium py-2 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Ver Perfil
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(id.id)}
                  className="p-2 text-error hover:bg-error-container/30 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {adding ? (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-xl border border-outline-variant p-6 flex flex-col gap-4"
          >
            <h3 className="font-headline-md text-headline-md text-primary text-lg">
              Novo Identificador
            </h3>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Identificador ou Link
              </label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={TYPES.find((t) => t.value === type)?.placeholder || "Ex: https://..."}
                className="w-full border border-outline-variant rounded-lg p-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            {error && <p className="text-error text-xs">{error}</p>}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="flex-1 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {saving ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary transition-colors min-h-[200px]"
          >
            <span className="material-symbols-outlined text-4xl text-outline">
              add_link
            </span>
            <div>
              <p className="font-bold text-primary">Ligar Conta</p>
              <p className="text-sm text-on-surface-variant mt-1">
                Adicione ORCID, Google Scholar, Scopus ou outros
                identificadores academicos.
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}