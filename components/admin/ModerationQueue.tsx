"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";

export type ModerationItem = {
  id: string;
  type: "PROFILE" | "PUBLICATION" | "CV";
  title: string;
  subtitle: string;
  author_name: string;
  author_role: string;
  author_avatar?: string | null;
  submitted_at: string;
  submitted_time: string;
  priority: "High" | "Normal";
  status: "PENDING" | "APPROVED" | "REJECTED";
  profile_id?: string;
  details?: Record<string, unknown>;
};

export default function ModerationQueue({
  initialItems,
}: {
  initialItems: ModerationItem[];
}) {
  const [items, setItems] = useState<ModerationItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<"ALL" | "PROFILES" | "PUBLICATIONS">("ALL");
  const [sortBy, setSortBy] = useState<"oldest" | "priority" | "newest">("oldest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const itemsPerPage = 6;

  // Filtragem
  const filtered = items.filter((item) => {
    if (item.status !== "PENDING") return false;
    if (activeTab === "PROFILES") return item.type === "PROFILE" || item.type === "CV";
    if (activeTab === "PUBLICATIONS") return item.type === "PUBLICATION";
    return true;
  });

  // Ordenação
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "priority") {
      if (a.priority === "High" && b.priority !== "High") return -1;
      if (b.priority === "High" && a.priority !== "High") return 1;
    }
    if (sortBy === "newest") {
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    }
    return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const pageItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Contadores
  const awaitingCount = items.filter((i) => i.status === "PENDING").length;
  const highPriorityCount = items.filter((i) => i.status === "PENDING" && i.priority === "High").length;
  const processedTodayCount = items.filter((i) => i.status !== "PENDING").length;

  function handleApprove(id: string) {
    startTransition(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item))
      );
      setFeedbackMessage("Item aprovado com sucesso e publicado na plataforma.");
      setSelectedItem(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    });
  }

  function handleReject(id: string) {
    startTransition(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "REJECTED" } : item))
      );
      setFeedbackMessage("Item rejeitado. Notificação enviada ao autor.");
      setSelectedItem(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    });
  }

  function renderIconByType(type: ModerationItem["type"]) {
    switch (type) {
      case "PROFILE":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-lg">badge</span>
          </div>
        );
      case "PUBLICATION":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-lg">library_books</span>
          </div>
        );
      case "CV":
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-lg">edit_document</span>
          </div>
        );
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="max-w-container-max">
        <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Fila de Validação Institucional
        </h1>
        <p className="mt-2 max-w-2xl font-body-lg text-sm text-on-surface-variant sm:text-base">
          Review and moderate submitted profiles, publications, and institutional content to maintain
          academic integrity and platform quality.
        </p>

        {feedbackMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary-container bg-secondary-container/15 p-4 text-xs font-semibold text-on-secondary-container shadow-sm">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Metrics / Summary Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Awaiting Validation */}
          <div className="editorial-shadow rounded-xl border border-outline-variant bg-surface p-6">
            <div className="mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">
                pending_actions
              </span>
              <span className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Awaiting Validation
              </span>
            </div>
            <div className="font-display-xl text-4xl font-extrabold text-primary sm:text-5xl">
              {awaitingCount}
            </div>
          </div>

          {/* Card 2: High Priority */}
          <div className="editorial-shadow rounded-xl border border-outline-variant bg-surface p-6">
            <div className="mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-2xl">flag</span>
              <span className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                High Priority
              </span>
            </div>
            <div className="font-display-xl text-4xl font-extrabold text-error sm:text-5xl">
              {highPriorityCount}
            </div>
          </div>

          {/* Card 3: Processed Today */}
          <div className="editorial-shadow rounded-xl border border-outline-variant bg-surface p-6">
            <div className="mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-2xl">
                task_alt
              </span>
              <span className="font-label-sm text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Processed Today
              </span>
            </div>
            <div className="font-display-xl text-4xl font-extrabold text-primary-container sm:text-5xl">
              {processedTodayCount}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Content Section */}
      <div className="max-w-container-max space-y-6">
        {/* Controls Bar: Tabs & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("ALL");
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 font-label-sm text-xs transition-colors ${
                activeTab === "ALL"
                  ? "bg-primary font-bold text-on-primary"
                  : "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
              }`}
            >
              All Requests
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("PROFILES");
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 font-label-sm text-xs transition-colors ${
                activeTab === "PROFILES"
                  ? "bg-primary font-bold text-on-primary"
                  : "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
              }`}
            >
              Profiles
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("PUBLICATIONS");
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 font-label-sm text-xs transition-colors ${
                activeTab === "PUBLICATIONS"
                  ? "bg-primary font-bold text-on-primary"
                  : "border border-outline-variant bg-surface text-on-surface hover:bg-surface-container"
              }`}
            >
              Publications
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-xs text-on-surface-variant">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="cursor-pointer border-none border-b border-outline-variant bg-surface py-1 pl-0 pr-8 font-body-md text-sm text-primary outline-none focus:border-secondary focus:ring-0"
            >
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="editorial-shadow overflow-hidden rounded-2xl border border-outline-variant bg-surface">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                    Subject
                  </th>
                  <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                    Author
                  </th>
                  <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 font-label-sm text-xs font-medium text-on-surface-variant">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-right font-label-sm text-xs font-medium text-on-surface-variant">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-body-md text-sm">
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-low text-secondary">
                          <span className="material-symbols-outlined text-3xl">task_alt</span>
                        </div>
                        <h3 className="font-headline-md text-base font-bold text-primary">
                          Queue is Clear
                        </h3>
                        <p className="mt-1 max-w-sm text-xs text-on-surface-variant">
                          There are no profiles or content awaiting validation at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageItems.map((item) => (
                    <tr
                      key={item.id}
                      className="table-row-hover transition-colors hover:bg-surface-container/60"
                    >
                      {/* Subject */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {renderIconByType(item.type)}
                          <div className="min-w-0">
                            <div className="font-headline-md text-sm font-semibold text-primary">
                              {item.title}
                            </div>
                            <div className="font-label-sm text-xs text-on-surface-variant truncate">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container text-xs font-bold text-primary">
                            {item.author_avatar ? (
                              <Image
                                src={item.author_avatar}
                                alt={item.author_name}
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                person
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-on-surface text-sm truncate">
                            {item.author_name}
                          </span>
                        </div>
                      </td>

                      {/* Date Submitted */}
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        <span>{item.submitted_at}</span>
                        <br />
                        <span className="font-label-sm text-[11px] text-outline">
                          {item.submitted_time}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        {item.priority === "High" ? (
                          <span className="inline-flex items-center rounded-full bg-error-container px-2.5 py-0.5 font-label-sm text-xs font-semibold text-on-error-container">
                            High
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-sm text-xs font-semibold text-on-surface">
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            title="Ver Detalhes"
                            className="rounded p-1.5 text-primary transition-colors hover:bg-primary-container hover:text-white"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              visibility
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id)}
                            disabled={isPending}
                            title="Aprovar"
                            className="rounded p-1.5 text-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              check_circle
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(item.id)}
                            disabled={isPending}
                            title="Rejeitar"
                            className="rounded p-1.5 text-error transition-colors hover:bg-error-container hover:text-on-error-container disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              cancel
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="font-label-sm text-xs text-on-surface-variant">
            Showing {sorted.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, sorted.length)} of {sorted.length} items
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-outline transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded font-label-sm text-xs transition-colors ${
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
              className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface transition-colors hover:bg-surface-container disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details & Approval Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-outline-variant bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="flex items-start gap-4">
              {renderIconByType(selectedItem.type)}
              <div className="space-y-1">
                <span className="rounded-full bg-secondary-container/20 px-2.5 py-0.5 font-label-sm text-xs font-bold text-on-secondary-container">
                  {selectedItem.type}
                </span>
                <h3 className="font-headline-md text-xl font-bold text-primary">
                  {selectedItem.title}
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Submetido por: <strong className="text-primary">{selectedItem.author_name}</strong> ({selectedItem.author_role})
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 text-xs font-body-md space-y-2 text-on-surface">
              <p>
                <strong>Descrição / Metadados:</strong> {selectedItem.subtitle}
              </p>
              <p>
                <strong>Data de Submissão:</strong> {selectedItem.submitted_at} às {selectedItem.submitted_time}
              </p>
              <p>
                <strong>Prioridade:</strong>{" "}
                <span className={selectedItem.priority === "High" ? "text-error font-bold" : "text-primary font-bold"}>
                  {selectedItem.priority}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border border-outline px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedItem.id)}
                disabled={isPending}
                className="rounded-lg border border-error px-4 py-2 text-xs font-semibold text-error hover:bg-error-container hover:text-on-error-container"
              >
                Rejeitar Pedido
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedItem.id)}
                disabled={isPending}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-container"
              >
                Aprovar & Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
