type Award = { title: string; issuer: string; year: number | null; description: string | null };

export default function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-headline-md text-primary mb-6 flex items-center gap-3 text-xl">
        <span className="material-symbols-outlined">emoji_events</span>
        Prémios e Distinções
      </h2>
      <ul className="space-y-4">
        {awards.map((award, i) => (
          <li
            key={i}
            className="flex gap-4 items-start p-4 bg-surface-container-lowest rounded-lg border border-outline-variant"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0 mt-1">
              <span className="material-symbols-outlined">military_tech</span>
            </div>
            <div>
              <h4 className="font-body-md font-semibold text-on-surface">{award.title}</h4>
              <p className="font-body-md text-sm text-on-surface-variant">{award.issuer}</p>
              {award.year && <span className="font-label-sm text-on-surface-variant mt-1 block">{award.year}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}