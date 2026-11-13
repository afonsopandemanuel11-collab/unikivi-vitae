import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const sections = {
  users: { title: "Utilizadores", table: "profiles", description: "Contas e perfis registados na plataforma." },
  profiles: { title: "Perfis", table: "profiles", description: "Perfis académicos e profissionais." },
  resumes: { title: "Currículos", table: "curricula", description: "Currículos criados pelos membros." },
  publications: { title: "Publicações", table: "publications", description: "Produção científica registada." },
  projects: { title: "Projetos", table: "projects", description: "Projetos académicos e científicos." },
  news: { title: "Notícias", table: "news", description: "Notícias publicadas na plataforma." },
  moderation: { title: "Moderação", table: "profile_verifications", description: "Pedidos de verificação que aguardam revisão." },
} as const;

type AdminSection = keyof typeof sections;
type Row = Record<string, unknown>;

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!Object.hasOwn(sections, section) && section !== "settings") notFound();

  if (section === "settings") {
    return (
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold text-primary">Definições</h1>
        <p className="mt-3 text-on-surface-variant">As configurações administrativas são geridas no painel seguro do projeto. Não existem preferências editáveis configuradas nesta aplicação.</p>
      </section>
    );
  }

  const key = section as AdminSection;
  const config = sections[key];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as Row[];
  const preferredColumns: Record<AdminSection, string[]> = {
    users: ["full_name", "profile_type", "status", "created_at"],
    profiles: ["full_name", "professional_name", "profile_type", "status", "visibility"],
    resumes: ["title", "profile_id", "status", "updated_at"],
    publications: ["title", "publication_type", "status", "year"],
    projects: ["title", "status", "start_date", "end_date"],
    news: ["title", "status", "created_at"],
    moderation: ["title", "verification_status", "created_at", "profile_id"],
  };
  const columns = preferredColumns[key];

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{config.title}</h1>
        <p className="mt-2 text-on-surface-variant">{config.description}</p>
      </div>
      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Não foi possível carregar os registos desta secção. Verifique a tabela e as permissões administrativas do projeto.
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-on-surface-variant">Ainda não existem registos nesta secção.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>{columns.map((column) => <th key={column} className="px-5 py-3 font-semibold text-primary">{column.replaceAll("_", " ")}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-b border-outline-variant/60 last:border-0">
                  {columns.map((column) => <td key={column} className="max-w-sm truncate px-5 py-4 text-on-surface-variant">{displayValue(row[column])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-outline-variant px-5 py-3 text-xs text-on-surface-variant">A mostrar até 100 registos recentes.</p>
        </div>
      )}
    </section>
  );
}
