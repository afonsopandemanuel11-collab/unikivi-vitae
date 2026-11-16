"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";

type ProfileUser = {
  id: string;
  full_name: string;
  professional_name?: string | null;
  profile_type: string;
  status: string;
  created_at: string;
  avatar_url?: string | null;
  email?: string | null;
  department?: string | null;
  faculty?: string | null;
};

export default function UsersManagement({ initialUsers }: { initialUsers: ProfileUser[] }) {
  const [users, setUsers] = useState<ProfileUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<ProfileUser | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const itemsPerPage = 8;

  const filtered = users.filter((u) => {
    const fullName = u.full_name?.toLowerCase() || "";
    const emailFallback = `${u.full_name?.toLowerCase().replace(/\s+/g, ".")}@unikivi.edu.ao`;
    const q = query.trim().toLowerCase();
    const matchesSearch = fullName.includes(q) || emailFallback.includes(q);

    const matchesRole = !roleFilter || u.profile_type === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "Ativo" && u.status === "ACTIVE") ||
      (statusFilter === "Pendente" && (u.status === "PENDING" || u.status === "DRAFT")) ||
      (statusFilter === "Suspenso" && (u.status === "SUSPENDED" || u.status === "INACTIVE"));

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function getInitials(name: string) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatDate(dStr: string) {
    if (!dStr) return "—";
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString("pt-PT", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dStr.slice(0, 10);
    }
  }

  function handleToggleStatus(user: ProfileUser) {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    startTransition(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      setActionSuccess(
        `Estado de "${user.full_name}" alterado para ${nextStatus === "ACTIVE" ? "Ativo" : "Suspenso"}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    });
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Gestão de Utilizadores
        </h1>
        <p className="mt-2 max-w-3xl font-body-lg text-sm text-on-surface-variant sm:text-base">
          Gerir todos os utilizadores registados, investigadores, docentes e administradores da
          plataforma UNIKIVI Vitae.
        </p>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-secondary-container bg-secondary-container/10 p-4 text-xs font-semibold text-on-secondary-container shadow-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters & Search Bento Box */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search Users */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-label-sm text-xs text-on-surface-variant font-medium">
              Search Users
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Name or Email address..."
                className="w-full rounded-lg border-b border-outline-variant bg-surface-bright py-2.5 pl-10 pr-4 font-body-md text-sm text-on-surface outline-none transition-all hover:border-primary focus:border-primary focus:bg-white focus:shadow-[0_2px_10px_rgba(0,238,252,0.15)]"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="mb-2 block font-label-sm text-xs text-on-surface-variant font-medium">
              Role
            </label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-lg border-b border-outline-variant bg-surface-bright py-2.5 pl-3 pr-8 font-body-md text-sm text-on-surface outline-none transition-all hover:border-primary focus:border-primary focus:bg-white focus:shadow-[0_2px_10px_rgba(0,238,252,0.15)]"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="TEACHER">TEACHER</option>
                <option value="RESEARCHER">RESEARCHER</option>
                <option value="STUDENT">STUDENT</option>
                <option value="PROFESSIONAL">PROFESSIONAL</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-outline">
                expand_more
              </span>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block font-label-sm text-xs text-on-surface-variant font-medium">
              Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-lg border-b border-outline-variant bg-surface-bright py-2.5 pl-3 pr-8 font-body-md text-sm text-on-surface outline-none transition-all hover:border-primary focus:border-primary focus:bg-white focus:shadow-[0_2px_10px_rgba(0,238,252,0.15)]"
              >
                <option value="">All Statuses</option>
                <option value="Ativo">Ativo</option>
                <option value="Pendente">Pendente</option>
                <option value="Suspenso">Suspenso</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-outline">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 font-label-sm text-xs font-semibold text-on-surface-variant">
                  User
                </th>
                <th className="px-6 py-4 font-label-sm text-xs font-semibold text-on-surface-variant">
                  Email
                </th>
                <th className="px-6 py-4 font-label-sm text-xs font-semibold text-on-surface-variant">
                  Role
                </th>
                <th className="px-6 py-4 font-label-sm text-xs font-semibold text-on-surface-variant">
                  Registration Date
                </th>
                <th className="px-6 py-4 font-label-sm text-xs font-semibold text-on-surface-variant">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-label-sm text-xs font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-body-md text-sm text-on-surface">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-on-surface-variant">
                    Nenhum utilizador encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                pageItems.map((user) => {
                  const role = user.profile_type || "USER";
                  const isAdmin = role === "ADMIN";
                  const isActive = user.status === "ACTIVE";
                  const isSuspended = user.status === "SUSPENDED" || user.status === "INACTIVE";
                  const email = `${user.full_name?.toLowerCase().replace(/\s+/g, ".")}@unikivi.edu.ao`;

                  return (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-surface-container-lowest/80 hover:bg-surface-container-low/40"
                    >
                      {/* User Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high font-bold text-primary">
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user.full_name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>{getInitials(user.full_name)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-primary block truncate">
                              {user.full_name}
                            </span>
                            {user.professional_name && (
                              <span className="text-[11px] text-on-surface-variant truncate block">
                                {user.professional_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email Cell */}
                      <td className="px-6 py-4 font-label-sm text-xs text-on-surface-variant">
                        {email}
                      </td>

                      {/* Role Cell */}
                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <span className="rounded-full bg-primary px-3 py-1 font-label-sm text-xs font-semibold text-on-primary">
                            ADMIN
                          </span>
                        ) : (
                          <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-sm text-xs font-semibold text-primary">
                            {role}
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="px-6 py-4 font-label-sm text-xs text-on-surface-variant">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Status Cell */}
                      <td className="px-6 py-4">
                        {isActive && (
                          <span className="rounded-full border border-secondary-container/30 bg-secondary-container/20 px-3 py-1 font-label-sm text-xs font-semibold text-on-secondary-container">
                            Ativo
                          </span>
                        )}
                        {isSuspended && (
                          <span className="rounded-full border border-error/30 bg-error-container/20 px-3 py-1 font-label-sm text-xs font-semibold text-error">
                            Suspenso
                          </span>
                        )}
                        {!isActive && !isSuspended && (
                          <span className="rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 font-label-sm text-xs font-semibold text-on-surface-variant">
                            Pendente
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-90 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            title="Ver Perfil"
                            className="rounded-md p-1.5 text-primary transition-colors hover:bg-primary-container hover:text-white"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          <Link
                            href={`/perfil/${user.id}`}
                            target="_blank"
                            title="Gerir / Página pública"
                            className="rounded-md p-1.5 text-primary transition-colors hover:bg-primary-container hover:text-white"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            disabled={isPending}
                            title={isActive ? "Desativar / Suspender" : "Reativar"}
                            className={`rounded-md p-1.5 transition-colors ${
                              isActive
                                ? "text-error hover:bg-error-container hover:text-on-error-container"
                                : "text-secondary hover:bg-secondary-container hover:text-on-secondary-container"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isActive ? "block" : "check_circle"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <span className="font-label-sm text-xs text-on-surface-variant">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant/60 text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`flex h-8 w-8 items-center justify-center rounded-md font-label-sm text-xs transition-colors ${
                  currentPage === pageNum
                    ? "bg-primary font-bold text-on-primary"
                    : "border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant/60 text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Quick View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="flex items-center gap-4 border-b border-outline-variant/40 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-headline-md text-base font-bold text-white">
                {getInitials(selectedUser.full_name)}
              </div>
              <div>
                <h3 className="font-headline-md text-lg font-bold text-primary">
                  {selectedUser.full_name}
                </h3>
                <p className="font-label-sm text-xs text-on-surface-variant">
                  {selectedUser.profile_type} · ID: {selectedUser.id.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 font-body-md text-sm">
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-outline">Email:</span>
                <span className="font-medium text-primary">
                  {selectedUser.full_name?.toLowerCase().replace(/\s+/g, ".")}@unikivi.edu.ao
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-outline">Estado:</span>
                <span className="font-bold text-secondary">{selectedUser.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/20">
                <span className="text-outline">Data de Registo:</span>
                <span className="font-medium text-on-surface">
                  {formatDate(selectedUser.created_at)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-outline-variant px-4 py-2 text-xs font-semibold text-primary hover:bg-surface-container"
              >
                Fechar
              </button>
              <Link
                href={`/perfil/${selectedUser.id}`}
                target="_blank"
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-container"
              >
                Abrir Perfil Completo
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
