const TEMPLATES = [
  { value: "UNIKIVI_CLASSIC", name: "UNIKIVI Classic", description: "ATS Friendly, 1 coluna, layout sóbrio e direto." },
  { value: "EXECUTIVE", name: "UNIKIVI Professional", description: "Corporativo, hierarquia visual forte, 2 colunas." },
  { value: "CIENCIA_VITAE", name: "UNIKIVI Academic", description: "Formal, focado em extensa lista de publicações." },
  { value: "MODERN_EDITORIAL", name: "UNIKIVI Modern", description: "Criativo, barra lateral colorida, ideal tech." },
  { value: "ACADEMIC_COMPACT", name: "UNIKIVI Compact", description: "Denso e conciso, ideal para currículos de uma página." },
];

export default function CurriculumTemplates() {
  return (
    <section className="py-section-gap bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="font-headline-lg text-primary mb-4 text-3xl md:text-4xl">Modelos de Currículo</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Exporte o seu perfil para diferentes formatos adaptados a cada contexto, desde o ambiente
            académico ao setor empresarial.
          </p>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto">
        {TEMPLATES.map((t) => (
          <div
            key={t.value}
            className="min-w-[280px] md:min-w-[320px] snap-start shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary shadow-sm hover:shadow-md transition-all p-4 flex flex-col cursor-pointer hover:-translate-y-1"
          >
            <div className="h-48 bg-surface-container-low rounded-lg mb-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant">description</span>
            </div>
            <h3 className="font-headline-md text-lg font-bold text-primary mb-1">{t.name}</h3>
            <p className="font-body-md text-sm text-on-surface-variant flex-1">{t.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}