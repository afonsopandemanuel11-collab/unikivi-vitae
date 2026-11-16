import type { Enums } from "@/lib/supabase/database.types";

export const API_PROFILE_TYPES = [
  "STUDENT",
  "TEACHER",
  "RESEARCHER",
  "PROFESSIONAL",
  "TALENT",
  "VISITOR",
] as const satisfies readonly Enums<"profile_type_enum">[];

export type ApiProfileType = (typeof API_PROFILE_TYPES)[number];

export const API_FIELDS = [
  { key: "full_name", label: "Nome completo", group: "Perfil" },
  { key: "professional_name", label: "Nome profissional", group: "Perfil" },
  { key: "bio", label: "Biografia", group: "Perfil" },
  { key: "faculty", label: "Faculdade", group: "Vínculo institucional" },
  { key: "department", label: "Departamento", group: "Vínculo institucional" },
  { key: "position", label: "Cargo", group: "Vínculo institucional" },
  { key: "education", label: "Formação académica", group: "Percurso" },
  { key: "experience", label: "Experiência profissional", group: "Percurso" },
  { key: "competencies", label: "Competências", group: "Percurso" },
  { key: "research_areas", label: "Áreas de investigação", group: "Percurso" },
  { key: "publications", label: "Publicações", group: "Produção científica" },
  { key: "projects", label: "Projetos", group: "Produção científica" },
] as const;

export type ApiField = (typeof API_FIELDS)[number]["key"];

export type ApiScopeSelection = {
  profileTypes: ApiProfileType[];
  fields: ApiField[];
};

export function buildApiScopes(profileTypes: ApiProfileType[], fields: ApiField[]) {
  return [
    "read:profiles",
    ...profileTypes.map((type) => `profile_type:${type}`),
    ...fields.map((field) => `field:${field}`),
  ];
}

export function parseApiScopes(scopes: string[] | null | undefined): ApiScopeSelection {
  const values = new Set(scopes ?? []);
  return {
    profileTypes: API_PROFILE_TYPES.filter((type) => values.has(`profile_type:${type}`)),
    fields: API_FIELDS.map((field) => field.key).filter((field) => values.has(`field:${field}`)),
  };
}
