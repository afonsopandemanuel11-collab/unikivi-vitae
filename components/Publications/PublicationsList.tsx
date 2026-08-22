"use client";

import { useState } from "react";

const TABS = [
  { value: "ALL", label: "Todos" },
  { value: "ARTICLE", label: "Artigos" },
  { value: "BOOK", label: "Livros" },
  { value: "CONFERENCE_PAPER", label: "Conferencias" },
];

type PublicationItem = {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  doi: string | null;
  url: string | null;
  publication_type: string;
};

type Authored = {
  publications: PublicationItem | PublicationItem[] | any;
};

type AuthorRow = {
  publication_id: string;
  external_name: string | null;
  profile_id: string | null;
  profiles: { full_name: string } | { full_name: string }[] | null;
};

export default function PublicationsList({
  authored,
  allAuthors,
}: {
  authored: Authored[];
  allAuthors: AuthorRow[];
}) {
  const [tab, setTab] = useState("ALL");

  const publications: PublicationItem[] = authored
    .map((a) => (Array.isArray(a.publications) ? a.publications[0] : a.publications))
    .filter((p): p is PublicationItem => Boolean(p && typeof p === "object" && "id" in p));

  function authorNames(publicationId: string) {
    return allAuthors
      .filter((a) => a.publication_id === publicationId)
      .map((a) => {
        if (a.external_name) return a.external_name;
        const p = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
        return p?.full_name ?? "";
      })
      .filter(Boolean)
      .join(", ");
  }

  const counts = TABS.map((t) => ({
    ...t,
    count: t.value === "ALL" ? publications.length : publications.filter((p) => p.publication_type === t.value).length,
  }));

  const filtered = tab === "ALL" ? publications : publications.filter((p) => p.publication_type === tab);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {counts.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.value
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Nenhuma publicacao nesta categoria.
        </p>
      ) : (
        <div className="relative pl-8 border-l-2 border-outline-variant space-y-6">
          {filtered
            .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
            .map((pub) => (
              <div key={pub.id} className="relative">
                <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[10px]">menu_book</span>
                </span>
                <div className="bg-white rounded-xl border border-outline-variant p-5">
                  <span className="text-xs font-bold text-secondary">{pub.year ?? "—"}</span>
                  <h3 className="font-headline-md text-headline-md text-primary text-base mt-1 mb-2">
                    {pub.title}
                  </h3>
                  {pub.journal && (
                    <p className="text-sm text-on-surface-variant mb-2">{pub.journal}</p>
                  )}
                  <p className="text-sm text-on-surface-variant mb-2">
                    <span className="font-medium">Autores:</span> {authorNames(pub.id)}
                  </p>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary text-xs font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>DOI: {pub.doi}</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}