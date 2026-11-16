import { API_FIELDS, API_PROFILE_TYPES, type ApiField, type ApiProfileType } from "@/lib/api/scopes";

const typeLabels: Record<ApiProfileType, string> = {
  STUDENT: "Estudantes",
  TEACHER: "Docentes",
  RESEARCHER: "Investigadores",
  PROFESSIONAL: "Profissionais",
  TALENT: "Talentos",
  VISITOR: "Visitantes",
};

export default function ApiScopesFields({
  selectedTypes,
  selectedFields,
}: {
  selectedTypes: ApiProfileType[];
  selectedFields: ApiField[];
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-primary">Tipos de perfil autorizados</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {API_PROFILE_TYPES.map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface transition hover:border-secondary">
              <input type="checkbox" name="profileTypes" value={type} defaultChecked={selectedTypes.includes(type)} className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-secondary" />
              <span>{typeLabels[type]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-bold text-primary">Dados que a API pode devolver</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {API_FIELDS.map((field) => (
            <label key={field.key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface transition hover:border-secondary">
              <input type="checkbox" name="fields" value={field.key} defaultChecked={selectedFields.includes(field.key)} className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-secondary" />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
