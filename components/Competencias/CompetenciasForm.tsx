"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LEVELS = [
  { value: "BASIC", label: "Basico" },
  { value: "INTERMEDIATE", label: "Intermediario" },
  { value: "ADVANCED", label: "Avancado" },
  { value: "EXPERT", label: "Especialista" },
];

type Category = { id: string; name: string; icon: string | null };
type SkillOption = { id: string; name: string };

export default function CompetenciasForm({
  profileId,
  categories,
}: {
  profileId: string;
  categories: Category[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SkillOption[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillOption | null>(null);
  const [levelIndex, setLevelIndex] = useState(2); // 0-3, default "Avancado"
  const [yearsExperience, setYearsExperience] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pesquisa de skills — filtra por nome e, se escolhida, por categoria
  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const supabase = createClient();
      let query = supabase
        .from("skills")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .limit(8);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data } = await query;
      setResults(data ?? []);
    }, 300); // debounce — evita um pedido por cada tecla

    return () => clearTimeout(timeout);
  }, [search, categoryId]);

  async function handleAdd() {
    if (!selectedSkill) {
      setError("Escolha uma competencia da lista de resultados.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("profile_skills").insert({
      profile_id: profileId,
      skill_id: selectedSkill.id,
      level: LEVELS[levelIndex].value,
      years_experience: yearsExperience ? Number(yearsExperience) : null,
    });

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "Ja adicionou esta competencia ao perfil."
          : "Nao foi possivel adicionar a competencia."
      );
      setSaving(false);
      return;
    }

    setSelectedSkill(null);
    setSearch("");
    setYearsExperience("");
    setSaving(false);
    router.refresh(); // recarrega a lista (Server Component) sem perder este formulario
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-outline-variant p-6">
        <h2 className="font-headline-md text-headline-md text-primary mb-6">
          Adicionar Competencia
        </h2>

        <div className="mb-5">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Selecione uma categoria...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-5 relative">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Pesquisar Habilidade
          </label>
          <input
            type="text"
            value={selectedSkill ? selectedSkill.name : search}
            onChange={(e) => {
              setSelectedSkill(null);
              setSearch(e.target.value);
            }}
            placeholder="Ex: Python, Revisao Bibliografica..."
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
          {results.length > 0 && !selectedSkill && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-outline-variant rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSkill(r);
                      setResults([]);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-low transition-colors"
                  >
                    {r.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-5">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-3">
            Nivel de Proficiencia
          </label>
          <div className="flex justify-between text-xs text-on-surface-variant mb-2">
            {LEVELS.map((l, i) => (
              <span key={l.value} className={i === levelIndex ? "text-primary font-bold" : ""}>
                {l.label}
              </span>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={3}
            value={levelIndex}
            onChange={(e) => setLevelIndex(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="mb-6">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Anos de Experiencia
          </label>
          <input
            type="number"
            min={0}
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            placeholder="Ex: 5"
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-primary py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {saving ? "A adicionar..." : "Adicionar ao Perfil"}
        </button>
      </div>

      {/* Sugestoes da IA — placeholder estatico por agora, sem backend de IA ligado ainda */}
      <div className="bg-secondary-container/10 border border-secondary/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-secondary">✨</span>
          <h3 className="font-headline-md text-headline-md text-primary text-base">
            Sugestoes da IA (Copilot)
          </h3>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
          Em breve: sugestoes baseadas no seu perfil de investigacao.
        </p>
      </div>
    </>
  );
}