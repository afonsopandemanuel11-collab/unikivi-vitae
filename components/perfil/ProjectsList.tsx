type Project = {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  funding_amount: number | null;
  funding_currency: string | null;
  funding_source: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Em Curso",
  COMPLETED: "Concluído",
  PLANNED: "Planeado",
  CANCELLED: "Cancelado",
};

function formatYear(date: string | null) {
  return date ? new Date(date).getFullYear() : "presente";
}

export default function ProjectsList({
  projectMembers,
}: {
  projectMembers: { role: string; projects: Project | null }[];
}) {
  const projects = projectMembers.filter((pm) => pm.projects !== null);
  if (projects.length === 0) return null;

  return (
    <section>
      <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3 text-xl">
        <span className="material-symbols-outlined">account_tree</span>
        Projetos Financiados
      </h2>
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
        {projects.map((pm) => {
          const p = pm.projects!;
          const isActive = p.status === "ACTIVE";
          return (
            <div
              key={p.id}
              className="p-6 border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                <div>
                  <span
                    className={`font-label-sm px-2 py-1 rounded-sm inline-block mb-2 ${
                      isActive
                        ? "text-secondary-fixed bg-secondary text-on-secondary"
                        : "text-on-surface-variant bg-surface-container-highest"
                    }`}
                  >
                    {STATUS_LABELS[p.status] ?? p.status}
                  </span>
                  <h3 className="font-body-lg font-semibold text-on-surface">{p.title}</h3>
                </div>
                <span className="font-label-sm text-on-surface-variant bg-surface px-3 py-1 rounded-full whitespace-nowrap">
                  {formatYear(p.start_date)} — {formatYear(p.end_date)}
                </span>
              </div>
              {p.description && (
                <p className="font-body-md text-sm text-on-surface-variant mb-4">{p.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm font-label-sm">
                {p.funding_amount && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Financiamento: {p.funding_amount.toLocaleString("pt-PT")} {p.funding_currency}
                  </div>
                )}
                {p.funding_source && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">corporate_fare</span>
                    Entidade: {p.funding_source}
                  </div>
                )}
                <div className="flex items-center gap-1 text-primary font-medium">
                  <span className="material-symbols-outlined text-sm">person</span>
                  {pm.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}