"use client";

import { useState } from "react";
const PUBLICATION_TYPES = [
  { value: "ARTICLE", label: "Artigo Científico" },
  { value: "CONFERENCE", label: "Comunicação em Conferência" },
  { value: "BOOK_CHAPTER", label: "Capítulo de Livro" },
  { value: "BOOK", label: "Livro" },
  { value: "THESIS", label: "Tese" },
  { value: "REPORT", label: "Relatório" },
  { value: "PREPRINT", label: "Preprint" },
  { value: "OTHER", label: "Outro" },
];

const CROSSREF_TYPE_MAP: Record<string, string> = {
  "journal-article": "ARTICLE",
  "proceedings-article": "CONFERENCE",
  "book-chapter": "BOOK_CHAPTER",
  book: "BOOK",
  monograph: "BOOK",
  dissertation: "THESIS",
};

const inputClass =
  "w-full bg-surface border-0 border-b border-outline-variant focus:border-secondary-fixed-dim focus:ring-0 px-0 py-2 font-body-md text-primary transition-colors";

export default function NewPublicationForm({
  profileFullName,
  onSubmit,
  isPending,
  error,
}: {
  profileFullName: string;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  error: string;
}) {
  const [doi, setDoi] = useState("");
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState("");
  const [publicationType, setPublicationType] = useState("ARTICLE");
  const [coAuthors, setCoAuthors] = useState<string[]>([]);
  const [doiLoading, setDoiLoading] = useState(false);
  const [doiError, setDoiError] = useState("");

  async function handleDoiLookup() {
    if (!doi) return;
    setDoiLoading(true);
    setDoiError("");
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
      if (!res.ok) throw new Error("DOI não encontrado.");
      const json = await res.json();
      const msg = json.message;

      const yearParts =
        msg["published-print"]?.["date-parts"]?.[0] ??
        msg["published-online"]?.["date-parts"]?.[0] ??
        msg.created?.["date-parts"]?.[0];

      setTitle(msg.title?.[0] ?? "");
      setJournal(msg["container-title"]?.[0] ?? "");
      setYear(yearParts?.[0] ? String(yearParts[0]) : "");
      setPublicationType(CROSSREF_TYPE_MAP[msg.type] ?? "ARTICLE");

      const fetchedAuthors: string[] = (msg.author ?? [])
        .map((a: { given?: string; family?: string }) => `${a.given ?? ""} ${a.family ?? ""}`.trim())
        .filter(Boolean);
      setCoAuthors(fetchedAuthors);
    } catch {
      setDoiError("Não foi possível encontrar este DOI.");
    } finally {
      setDoiLoading(false);
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm sticky top-24">
      <h2 className="font-headline-md text-xl text-primary mb-6 flex items-center gap-2">
        Nova Publicação
        <span className="material-symbols-outlined text-secondary-container text-lg">auto_awesome</span>
      </h2>

      <form action={onSubmit} className="space-y-5">
        <div>
          <label className="block font-label-sm text-on-surface-variant mb-2 uppercase">DOI (Auto-preenchimento)</label>
          <div className="flex gap-2">
            <input
              name="doi"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="ex: 10.1038/s41586-020-2649-2"
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleDoiLookup}
              disabled={doiLoading}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">{doiLoading ? "hourglass_empty" : "search"}</span>
            </button>
          </div>
          {doiError && <p className="text-error font-label-sm mt-1">{doiError}</p>}
          <p className="font-label-sm text-on-surface-variant/70 mt-1">Insira o DOI para buscar os dados automaticamente.</p>
        </div>

        <label className="block">
          <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">Título da Publicação*</span>
          <textarea
            name="title"
            required
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título completo do artigo..."
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">Revista / Jornal*</span>
            <input name="journal" value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Nome da publicação" className={inputClass} />
          </label>
          <label className="block">
            <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">Ano*</span>
            <input name="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className={inputClass} />
          </label>
        </div>

        <label className="block">
          <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">Tipo de Publicação</span>
          <select name="publication_type" value={publicationType} onChange={(e) => setPublicationType(e.target.value)} className={inputClass}>
            {PUBLICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>

        <div>
          <span className="block font-label-sm text-on-surface-variant mb-2 uppercase">Autores</span>
          <div className="bg-surface-container-low rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">drag_indicator</span>
              <input readOnly name="author_name" value={`${profileFullName} (Você)`} className={`${inputClass} bg-transparent text-on-surface-variant`} />
            </div>
            {coAuthors.map((author, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">drag_indicator</span>
                <input
                  name="author_name"
                  value={author}
                  onChange={(e) => {
                    const next = [...coAuthors];
                    next[i] = e.target.value;
                    setCoAuthors(next);
                  }}
                  placeholder="Nome do co-autor"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setCoAuthors(coAuthors.filter((_, idx) => idx !== i))}
                  className="text-error shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setCoAuthors([...coAuthors, ""])}
              className="text-secondary font-label-sm flex items-center gap-1 pt-1"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Adicionar Autor
            </button>
          </div>
        </div>

        {error && <p className="text-error font-label-sm">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-body-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {isPending ? "A guardar..." : "Salvar Publicação"}
        </button>
      </form>
    </div>
  );
}