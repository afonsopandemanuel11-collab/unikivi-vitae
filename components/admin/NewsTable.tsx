"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { archiveNews } from "@/app/admin/news/actions";

type NewsItem = {
  id: string;
  title: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

const categoryLabel: Record<string, string> = {
  PLATAFORMA: "PLATAFORMA",
  COMUNIDADE: "COMUNIDADE",
  INSTITUCIONAL: "INSTITUCIONAL",
};

export default function NewsTable({ items }: { items: NewsItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = items.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function archive(id: string) {
    startTransition(async () => {
      const result = await archiveNews(id);
      if (result.success) router.refresh();
    });
  }

  function formatShortId(id: string, index: number) {
    // Retorna formato do design #NW-1042
    const num = 1042 - index;
    return `#NW-${num}`;
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr.slice(0, 10);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-surface-bright p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border-none bg-surface-container-low py-1.5 pl-3 pr-8 font-body-md text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
          >
            <option value="ALL">All Categories</option>
            <option value="PLATAFORMA">PLATAFORMA</option>
            <option value="COMUNIDADE">COMUNIDADE</option>
            <option value="INSTITUCIONAL">INSTITUCIONAL</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border-none bg-surface-container-low py-1.5 pl-3 pr-8 font-body-md text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          {/* Quick text filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-outline">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title..."
              className="rounded-lg border-none bg-surface-container-low py-1.5 pl-8 pr-3 font-body-md text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <button
            type="button"
            title="Filtrar"
            className="rounded-md p-1.5 transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
          <button
            type="button"
            title="Mais opções"
            className="rounded-md p-1.5 transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-bright">
              <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                ID
              </th>
              <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                Title
              </th>
              <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                Category
              </th>
              <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                Status
              </th>
              <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                Published Date
              </th>
              <th className="px-6 py-4 text-right font-label-sm text-xs font-medium text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body-md text-sm text-on-background">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-on-surface-variant">
                  {items.length
                    ? "Nenhuma notícia corresponde aos filtros selecionados."
                    : "Ainda não existem notícias registadas."}
                </td>
              </tr>
            ) : (
              pageItems.map((item, index) => {
                const isArchived = item.status === "ARCHIVED";
                const isDraft = item.status === "DRAFT";
                const isPublished = item.status === "PUBLISHED";

                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors hover:bg-surface-container-low ${
                      isArchived ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-label-sm text-xs text-on-surface-variant">
                      {formatShortId(item.id, index)}
                    </td>
                    <td className="max-w-md px-6 py-4 font-medium text-primary">
                      {item.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-outline-variant/50 bg-surface-container-high px-2.5 py-0.5 font-label-sm text-[11px] font-semibold text-primary">
                        {categoryLabel[item.category] ?? item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isPublished && (
                        <span className="inline-flex items-center gap-1.5 font-label-sm text-xs font-semibold text-secondary">
                          <span className="h-2 w-2 rounded-full bg-secondary" />
                          PUBLISHED
                        </span>
                      )}
                      {isDraft && (
                        <span className="inline-flex items-center gap-1.5 font-label-sm text-xs font-semibold text-on-surface-variant">
                          <span className="h-2 w-2 rounded-full border border-on-surface-variant" />
                          DRAFT
                        </span>
                      )}
                      {isArchived && (
                        <span className="inline-flex items-center gap-1.5 font-label-sm text-xs font-semibold text-outline">
                          <span className="h-2 w-2 rounded-full bg-outline" />
                          ARCHIVED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-label-sm text-xs text-on-surface-variant">
                      {isDraft ? "—" : formatDate(item.published_at || item.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          title="Editar"
                          className="rounded p-1 text-on-surface-variant transition-colors hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        {!isArchived && (
                          <button
                            type="button"
                            onClick={() => archive(item.id)}
                            disabled={pending}
                            title="Arquivar"
                            className="rounded p-1 text-on-surface-variant transition-colors hover:text-error disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">archive</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant bg-surface-bright p-4">
        <span className="font-label-sm text-xs text-on-surface-variant">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded border border-outline-variant text-outline transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`flex h-7 w-7 items-center justify-center rounded font-label-sm text-xs transition-colors ${
                currentPage === pageNum
                  ? "bg-primary font-bold text-on-primary"
                  : "border border-outline-variant text-on-surface hover:bg-surface-container"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex h-7 w-7 items-center justify-center rounded border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

