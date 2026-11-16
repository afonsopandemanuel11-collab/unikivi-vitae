import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const sections = {
  users: { title: "Utilizadores", table: "profiles", description: "Contas e perfis registados na plataforma." },
  profiles: { title: "Perfis Institucionais", table: "profiles", description: "Perfis académicos, de investigação e profissionais." },
  resumes: { title: "Currículos", table: "curricula", description: "Currículos criados pelos membros na plataforma." },
  publications: { title: "Publicações", table: "publications", description: "Produção científica registada pela comunidade académica." },
  projects: { title: "Projetos", table: "projects", description: "Projetos académicos e científicos em curso ou concluídos." },
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
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary">
            Definições da Plataforma
          </h1>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            Configurações globais e políticas de segurança da UNIKIVI Vitae.
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm space-y-4">
          <h3 className="font-headline-md text-base font-bold text-primary">
            Parâmetros de Auditoria &amp; Segurança
          </h3>
          <p className="font-body-md text-xs leading-relaxed text-on-surface-variant">
            As políticas de autenticação multifator, quotas de API e registo de conformidade estão
            ativas ao nível de infraestrutura institucional. Alterações nos parâmetros de gateway
            são realizadas mediante parecer técnico do Gabinete de Sistemas.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/20 px-3 py-1 font-label-sm text-xs font-semibold text-on-secondary-container border border-secondary-container/40">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </div>
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary">
            {config.title}
          </h1>
          <p className="mt-1 font-body-md text-sm text-on-surface-variant">{config.description}</p>
        </div>
        <span className="font-label-sm text-xs text-outline">
          Total listado: {rows.length} registos
        </span>
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Não foi possível carregar os registos desta secção. Verifique a tabela e as permissões
          administrativas do projeto.
        </div>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant shadow-sm">
          Ainda não existem registos nesta secção.
        </p>
      ) : (
        <div className="editorial-shadow overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-left font-body-md text-sm">
              <thead className="border-b border-outline-variant bg-surface-container-low font-label-sm text-xs font-semibold text-primary">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-6 py-4 capitalize">
                      {column.replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-on-surface">
                {rows.map((row, index) => (
                  <tr
                    key={String(row.id ?? index)}
                    className="transition-colors hover:bg-surface-container/50"
                  >
                    {columns.map((column) => {
                      const val = displayValue(row[column]);
                      const isStatus = column === "status" || column === "verification_status";
                      return (
                        <td key={column} className="max-w-sm truncate px-6 py-4">
                          {isStatus ? (
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-label-sm text-xs font-semibold ${
                                val === "ACTIVE" || val === "APPROVED" || val === "PUBLISHED"
                                  ? "bg-secondary-container/20 text-on-secondary-container border border-secondary-container/30"
                                  : "bg-surface-container-high text-on-surface-variant"
                              }`}
                            >
                              {val}
                            </span>
                          ) : (
                            <span className="text-on-surface-variant">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-outline-variant bg-surface-container-low px-6 py-3 font-label-sm text-xs text-on-surface-variant">
            A mostrar {rows.length} registos recentes.
          </div>
        </div>
      )}
    </div>
  );
}

