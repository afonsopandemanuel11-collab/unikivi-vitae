"use client";

import { useState, useTransition } from "react";
import { addPublication, deletePublication } from "@/app/dashboard/producao-cientifica/actions";
import NewPublicationForm from "./NewPublicationForm";

type Publication = {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  doi: string | null;
  publication_type: string;
  publication_authors: { author_order: number; external_name: string | null; profiles: { full_name: string } | null }[];
};
const TABS = [
  { key: "ALL", label: "Todos" },
  { key: "ARTICLE", label: "Artigos" },
  { key: "BOOK", label: "Livros" },
  { key: "CONFERENCE", label: "Conferências" },
  { key: "THESIS", label: "Teses" },
];

function authorNames(pub: Publication) {
  return [...pub.publication_authors]
    .sort((a, b) => a.author_order - b.author_order)
    .map((a) => a.profiles?.full_name ?? a.external_name)
    .filter(Boolean)
    .join(", ");
}

export default function PublicationsManager({
  profileId,
  profileFullName,
  publications,
}: {
  profileId: string;
  profileFullName: string;
  publications: Publication[];
}) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleAdd(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await addPublication(profileId, formData);
      if (!result.success) setError(result.error ?? "Erro ao guardar.");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Eliminar esta publicação?")) return;
    startTransition(() => {
      deletePublication(id);
    });
  }

  const filtered =
    activeTab === "ALL"
      ? publications
      : activeTab === "BOOK"
      ? publications.filter((p) => p.publication_type === "BOOK" || p.publication_type === "BOOK_CHAPTER")
      : publications.filter((p) => p.publication_type === activeTab);
  const counts = {
  ALL: publications.length,
  ARTICLE: publications.filter((p) => p.publication_type === "ARTICLE").length,
  BOOK: publications.filter((p) => p.publication_type === "BOOK" || p.publication_type === "BOOK_CHAPTER").length,
  CONFERENCE: publications.filter((p) => p.publication_type === "CONFERENCE").length,
  THESIS: publications.filter((p) => p.publication_type === "THESIS").length,
};

  return (
    <div>
      <h1 className="font-headline-lg text-3xl text-primary mb-2">Produção Científica</h1>
      <p className="font-body-lg text-on-surface-variant mb-10 max-w-2xl">
        Gerencie as suas publicações, artigos e contribuições académicas. Mantenha o seu portfólio
        atualizado para a comunidade de pesquisa.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-4">
          <NewPublicationForm profileFullName={profileFullName} onSubmit={handleAdd} isPending={isPending} error={error} />
        </div>

        <div className="lg:col-span-8">
          <div className="flex gap-2 mb-8 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full font-label-sm transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {tab.label} ({counts[tab.key as keyof typeof counts]})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-12 text-center text-on-surface-variant font-body-md">
              Nenhuma publicação nesta categoria.
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((pub) => (
                <div key={pub.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm group relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-sm text-secondary bg-secondary-container/10 px-2 py-1 rounded-full">
                      {pub.year ?? "—"}
                    </span>
                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                  <h3 className="font-headline-md text-lg text-primary mb-2 leading-snug">{pub.title}</h3>
                  {pub.journal && <p className="font-body-md text-sm text-on-surface-variant italic mb-2">{pub.journal}</p>}
                  {pub.publication_authors.length > 0 && (
                    <p className="font-body-md text-sm text-on-surface-variant mb-2">
                      <span className="font-semibold">Autores:</span> {authorNames(pub)}
                    </p>
                  )}
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label-sm text-secondary hover:underline inline-flex items-center gap-1"
                    >
                      <span>DOI: {pub.doi}</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}