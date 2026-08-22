"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addPublication } from "@/app/dashboard/publicacoes/actions";

const TYPES = [
  { value: "ARTICLE", label: "Artigo" },
  { value: "BOOK", label: "Livro" },
  { value: "CONFERENCE_PAPER", label: "Conferência" },
];

export default function PublicationsForm({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [doi, setDoi] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState("");
  const [publicationType, setPublicationType] = useState("ARTICLE");
  const [coAuthors, setCoAuthors] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleDoiLookup() {
    if (!doi.trim()) return;
    setLookingUp(true);
    setError(null);

    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi.trim())}`);
      if (!res.ok) throw new Error("DOI não encontrado.");
      const data = await res.json();
      const work = data.message;

      setTitle(work.title?.[0] ?? "");
      setJournal(work["container-title"]?.[0] ?? "");
      setYear(
        work.published?.["date-parts"]?.[0]?.[0]?.toString() ??
          work["published-print"]?.["date-parts"]?.[0]?.[0]?.toString() ??
          ""
      );

      const authors = (work.author ?? [])
        .map((a: any) => `${a.given ?? ""} ${a.family ?? ""}`.trim())
        .filter(Boolean);
      if (authors.length > 0) setCoAuthors(authors);
    } catch {
      setError("Não foi possível encontrar dados para este DOI. Preencha manualmente.");
    } finally {
      setLookingUp(false);
    }
  }

  function updateCoAuthor(index: number, value: string) {
    setCoAuthors((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function removeCoAuthor(index: number) {
    setCoAuthors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await addPublication(profileId, {
      title,
      journal: journal || null,
      year: year ? Number(year) : null,
      doi: doi || null,
      publication_type: publicationType,
      coAuthors,
    });

    if (!result.success) {
      setError(result.error ?? "Não foi possível guardar a publicação.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setDoi("");
    setTitle("");
    setJournal("");
    setYear("");
    setPublicationType("ARTICLE");
    setCoAuthors([""]);
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-primary text-lg">
          Nova Publicação
        </h2>
        <span className="text-secondary">✨</span>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Publicação adicionada com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          DOI (Auto-preenchimento)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="ex: 10.1038/s41586-020-2649-2"
            className="flex-1 border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
          <button
            type="button"
            onClick={handleDoiLookup}
            disabled={lookingUp}
            className="px-4 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              {lookingUp ? "hourglass_empty" : "search"}
            </span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">
          Insira o DOI para buscar os dados automaticamente.
        </p>
      </div>

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Titulo da Publicacao*
        </label>
        <textarea
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          placeholder="Titulo completo do artigo..."
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
        />
      </div>

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Tipo
        </label>
        <select
          value={publicationType}
          onChange={(e) => setPublicationType(e.target.value)}
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Revista / Jornal*
          </label>
          <input
            type="text"
            required
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Nome da publicacao"
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Ano*
          </label>
          <input
            type="number"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Autores
        </label>
        <div className="bg-surface-container-low rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-outline-variant">
            <span className="material-symbols-outlined text-outline text-sm">drag_indicator</span>
            <span className="text-sm font-medium text-on-surface">Voce</span>
          </div>
          {coAuthors.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-sm">drag_indicator</span>
              <input
                type="text"
                value={name}
                onChange={(e) => updateCoAuthor(i, e.target.value)}
                placeholder="Nome do co-autor"
                className="flex-1 border border-outline-variant rounded-lg p-2 text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors"
              />
              <button
                type="button"
                onClick={() => removeCoAuthor(i)}
                className="text-error hover:opacity-70"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setCoAuthors((prev) => [...prev, ""])}
            className="text-secondary text-sm font-medium flex items-center gap-1 pt-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Adicionar Autor
          </button>
        </div>
      </div>

      {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
      >
        {saving ? "A guardar..." : "Salvar Publicacao"}
      </button>
    </form>
  );
}