// components/dashboard/PercursoCard.tsx
type Experience = {
  id: string;
  position: string;
  organization: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
};

export default function PercursoCard({ experiences }: { experiences: Experience[] }) {
  function formatPeriod(exp: Experience) {
    const start = exp.start_date ? new Date(exp.start_date).getFullYear() : "";
    const end = exp.is_current ? "Presente" : exp.end_date ? new Date(exp.end_date).getFullYear() : "";
    return `${start} - ${end}`;
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md text-primary">
          Percurso profissional
        </h2>
        <a href="/dashboard/experiencia" className="text-primary hover:text-primary-container">
          <span className="material-symbols-outlined">add</span>
        </a>
      </div>

      {experiences.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Ainda nao adicionou experiencia. Comece por adicionar o seu percurso profissional.
        </p>
      ) : (
        <div className="relative pl-6 border-l-2 border-outline-variant space-y-8">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="relative">
              <span
                className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${
                  i === 0 ? "bg-primary" : "bg-white border-2 border-outline-variant"
                }`}
              />
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-headline-md text-headline-md text-primary text-lg">
                  {exp.position}
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {formatPeriod(exp)}
                </span>
              </div>
              <p className="font-body-md text-body-md text-secondary mb-2">
                {exp.organization}
              </p>
              {exp.description && (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}