type Experience = {
  organization: string;
  position: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
};

function formatYear(date: string | null) {
  return date ? new Date(date).getFullYear() : "";
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null;

  const sorted = [...experiences].sort(
    (a, b) => new Date(b.start_date ?? 0).getTime() - new Date(a.start_date ?? 0).getTime()
  );

  return (
    <section>
      <h2 className="font-headline-md text-primary mb-8 flex items-center gap-3 text-xl">
        <span className="material-symbols-outlined">work</span>
        Experiência Profissional
      </h2>
      <div className="relative pl-6 border-l-2 border-surface-container-high space-y-10">
        {sorted.map((exp, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-surface ${
                exp.is_current
                  ? "bg-primary"
                  : "bg-surface-container-highest border-2 border-outline"
              }`}
            />
            <div
              className={`p-6 rounded-2xl border ${
                exp.is_current
                  ? "bg-surface-container-lowest border-outline-variant shadow-sm"
                  : "bg-surface border-surface-container-highest"
              }`}
            >
              <span className="font-label-sm text-primary mb-1 block">
                {formatYear(exp.start_date)} — {exp.is_current ? "Presente" : formatYear(exp.end_date)}
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface">{exp.position}</h3>
              <p className="font-body-md text-on-surface-variant mb-3">{exp.organization}</p>
              {exp.description && (
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}