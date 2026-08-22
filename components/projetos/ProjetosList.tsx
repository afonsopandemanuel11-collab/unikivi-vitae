type Membership = {
  role: string;
  projects: {
    id: string;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string;
    funding_source: string | null;
  } | { id: string; title: string; description: string | null; start_date: string | null; end_date: string | null; status: string; funding_source: string | null }[] | null;
};

export default function ProjetosList({ memberships }: { memberships: Membership[] }) {
  const normalized = memberships.map((m) => ({
    role: m.role,
    project: Array.isArray(m.projects) ? m.projects[0] ?? null : m.projects ?? null,
  }));

  function formatYear(date: string | null) {
    return date ? new Date(date).getFullYear() : null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-headline-md text-headline-md text-primary">
          Projetos Registrados
        </h2>
        <span className="bg-surface-container text-on-surface-variant text-xs font-medium px-3 py-1 rounded-full">
          {normalized.length} {normalized.length === 1 ? "Item" : "Itens"}
        </span>
      </div>

      {normalized.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Ainda nao registou nenhum projeto.
        </p>
      ) : (
        <div className="space-y-4">
          {normalized.map(({ role, project }) => {
            if (!project) return null;
            const isActive = project.status === "ACTIVE";
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-outline-variant p-6"
              >
                <h3 className="font-headline-md text-headline-md text-primary text-lg mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      isActive
                        ? "bg-secondary-container/20 text-secondary"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {isActive ? "Em Andamento" : "Concluido"}
                  </span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {formatYear(project.start_date)} -{" "}
                    {isActive ? "Presente" : formatYear(project.end_date) ?? "—"}
                  </span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">work</span>
                    {role}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-on-surface-variant line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}