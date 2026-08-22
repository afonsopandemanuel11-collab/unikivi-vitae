"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAward, deleteAward } from "@/app/dashboard/premios/actions";

type Award = {
  id: string;
  title: string;
  issuer: string;
  year: number | null;
  url: string | null;
  description: string | null;
};

export default function AwardsForm({
  profileId,
  awards,
}: {
  profileId: string;
  awards: Award[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAdd() {
    if (!title || !issuer) {
      setError("Preencha pelo menos o título e a instituição emissora.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const year = yearInput ? Number(yearInput) : null;

    const result = await addAward(profileId, {
      title,
      issuer,
      year,
      url: url || null,
      description: description || null,
    });

    if (!result.success) {
      setError(result.error ?? "Não foi possível adicionar o prémio.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setTitle("");
    setIssuer("");
    setYearInput("");
    setUrl("");
    setDescription("");
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja remover este prémio?")) return;
    setDeletingId(id);
    const result = await deleteAward(id);
    if (!result.success) {
      setError(result.error ?? "Erro ao remover prémio.");
    } else {
      router.refresh();
    }
    setDeletingId(null);
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 text-lg">
          <span className="material-symbols-outlined">emoji_events</span>
          Prémios & Reconhecimentos
        </h2>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Prémio adicionado com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <Field label="Título do Prémio" value={title} onChange={setTitle} placeholder="Ex: Prémio de Mérito Científico" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Instituição Emissora" value={issuer} onChange={setIssuer} placeholder="Ex: Academia Angolana de Ciências" />
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
              Ano de Atribuição
            </label>
            <input
              type="number"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              placeholder="AAAA"
              min={1950}
              max={new Date().getFullYear()}
              className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>
        <Field label="URL de Comprovação (Opcional)" value={url} onChange={setUrl} type="url" placeholder="https://..." />
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Descrição (Opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Breve descrição do contexto ou trabalho premiado..."
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-container transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {saving ? "A adicionar..." : "Adicionar Prémio"}
        </button>
      </div>

      {awards.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant">
          <h3 className="font-headline-md text-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Prémios Registados ({awards.length})
          </h3>
          {awards.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 text-sm">
              <div>
                <p className="font-semibold text-primary">{a.title}</p>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  {a.issuer} {a.year ? `• ${a.year}` : ""}
                </p>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-secondary text-xs hover:underline mt-1"
                  >
                    <span>Ver comprovativo</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deletingId === a.id}
                title="Remover Prémio"
                className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
      />
    </div>
  );
}