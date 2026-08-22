type Education = {
  degree: string;
  course: string;
  institution: string;
  institution_country: string | null;
  start_year: number | null;
  end_year: number | null;
  description: string | null;
};

export default function EducationTimeline({ education }: { education: Education[] }) {
  if (education.length === 0) return null;

  const sorted = [...education].sort((a, b) => (b.end_year ?? 0) - (a.end_year ?? 0));

  return (
    <section>
      <h2 className="font-headline-md text-primary mb-8 flex items-center gap-3 text-xl">
        <span className="material-symbols-outlined">school</span>
        Educação
      </h2>
      <div className="relative pl-6 border-l-2 border-surface-container-high space-y-8">
        {sorted.map((edu, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-surface-container-highest border-2 border-outline ring-4 ring-surface" />
            <div>
              <span className="font-label-sm text-on-surface-variant mb-1 block">
                {edu.start_year} — {edu.end_year}
              </span>
              <h3 className="font-body-lg font-semibold text-on-surface">
                {edu.degree} em {edu.course}
              </h3>
              <p className="font-body-md text-on-surface-variant">
                {edu.institution}
                {edu.institution_country ? `, ${edu.institution_country}` : ""}
              </p>
              {edu.description && (
                <p className="font-body-md text-sm text-on-surface-variant mt-2 italic border-l-2 border-outline-variant pl-3">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}