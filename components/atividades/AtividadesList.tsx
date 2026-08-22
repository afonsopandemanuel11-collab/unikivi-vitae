type Activity = {
  id: string;
  position: string;
  organization: string;
  employment_type: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  EXTENSION: "Extensao",
  COMMITTEE: "Comite Cientifico",
  EVENT: "Evento",
  OTHER: "Outro",
};

export default function AtividadesList({ activities }: { activities: Activity[] }) {
  function formatPeriod(a: Activity) {
    const start = a.start_date
      ? new Date(a.start_date).toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
      : "";
    const end = a.is_current
      ? "Presente"
      : a.end_date
      ? new Date(a.end_date).toLocaleDateString("pt-PT", { month: "short", year: "numeric" })
      : "";
    return `${start} - ${end}`;
  }

  if (activities.length === 0) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">
        Ainda nao registou nenhuma atividade.
      </p>
    );
  }

  return (
    <div className="relative pl-8 border-l-2 border-outline-variant space-y-6">
      {activities.map((a) => (
        <div key={a.id} className="relative">
          <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-primary" />
          <div className="bg-white rounded-xl border border-outline-variant p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-surface-container text-on-surface-variant text-xs font-medium px-3 py-1 rounded-full">
                {TYPE_LABELS[a.employment_type] ?? a.employment_type}
              </span>
              <span className="flex items-center gap-1 text-xs text-secondary font-medium">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Verificado
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary text-base mb-1">
              {a.position}
            </h3>
            <p className="text-xs text-on-surface-variant mb-1">{formatPeriod(a)}</p>
            <p className="text-sm font-medium text-primary mb-2">{a.organization}</p>
            {a.description && (
              <p className="text-sm text-on-surface-variant">{a.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}