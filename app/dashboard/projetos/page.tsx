import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProjetosForm from "@/components/projetos/ProjetosForm";
import ProjetosList from "@/components/projetos/ProjetosList";

export default async function ProjetosPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: memberships } = await supabase
    .from("project_members")
    .select("role, projects(id, title, description, start_date, end_date, status, funding_source)")
    .eq("profile_id", profile.id)
    .order("joined_at", { ascending: false });

  return (
    <DashboardShell profile={profile}>
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
        Edicao de Perfil - Fase 5
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-2 mb-3">
        Projetos de Pesquisa
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
        Detalhe as investigacoes cientificas e projetos academicos nos quais
        atua ou atuou. Esta seccao consolida o seu impacto no ecossistema de
        pesquisa.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-md text-headline-md text-primary mb-4 text-lg">
            Diretrizes
          </h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li>
              Inclua apenas projetos formalmente registados em instituicoes
              ou agencias de fomento.
            </li>
            <li>
              Especifique claramente o seu papel (Coordenador, Pesquisador
              Principal, Bolsista, etc).
            </li>
            <li>
              Projetos em andamento devem ter a data de termino em branco ou
              marcada como Atual.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <ProjetosForm profileId={profile.id} />
        </div>
      </div>

      <ProjetosList memberships={memberships ?? []} />
    </DashboardShell>
  );
}