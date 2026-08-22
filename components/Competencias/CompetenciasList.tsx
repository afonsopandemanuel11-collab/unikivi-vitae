type ProfileSkill = {
  id: string;
  level: string;
  years_experience: number | null;
  skills: { id: string; name: string; category_id: string } | { id: string; name: string; category_id: string }[] | null;
};

type Category = { id: string; name: string; icon: string | null };

const LEVEL_LABELS: Record<string, string> = {
  BASIC: "Basico",
  INTERMEDIATE: "Intermediario",
  ADVANCED: "Avancado",
  EXPERT: "Especialista",
};

const LEVEL_PROGRESS: Record<string, number> = {
  BASIC: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
};

export default function CompetenciasList({
  profileSkills,
  categories,
}: {
  profileSkills: ProfileSkill[];
  categories: Category[];
}) {
  // normaliza skills (Supabase pode devolver array ou objeto)
  const normalized = profileSkills.map((ps) => ({
    ...ps,
    skill: Array.isArray(ps.skills) ? ps.skills[0] ?? null : ps.skills ?? null,
  }));

  // agrupa por categoria
  const grouped = categories
    .map((cat) => ({
      category: cat,
      items: normalized.filter((ps) => ps.skill?.category_id === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-8">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Suas Competencias Mapeadas
      </h2>

      {grouped.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Ainda nao adicionou competencias. Comece pelo formulario ao lado.
        </p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category, items }) => (
            <div key={category.id}>
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">
                {category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((ps) => (
                  <div
                    key={ps.id}
                    className="border border-outline-variant rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {ps.skill?.name}
                      </span>
                      <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                        {LEVEL_LABELS[ps.level] ?? ps.level}
                      </span>
                    </div>
                    {ps.years_experience != null && (
                      <p className="text-xs text-on-surface-variant mb-3">
                        {ps.years_experience} anos de experiencia
                      </p>
                    )}
                    <div className="w-full h-1.5 bg-surface-container rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${LEVEL_PROGRESS[ps.level] ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}