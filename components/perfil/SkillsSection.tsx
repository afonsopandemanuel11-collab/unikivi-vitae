type Props = {
  skills: { level: string | null; years_experience: number | null; skills: { name: string } | null }[];
};

export default function SkillsSection({ skills }: Props) {
  if (skills.length === 0) return null;

  return (
    <section>
      <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3 text-xl">
        <span className="material-symbols-outlined">mindfulness</span>
        Áreas de Investigação &amp; Competências
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={i}
            className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm hover:bg-primary hover:text-on-primary transition-colors cursor-default border border-outline-variant"
          >
            {s.skills?.name}
          </span>
        ))}
      </div>
    </section>
  );
}