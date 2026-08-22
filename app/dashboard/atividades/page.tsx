import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import AtividadesForm from "@/components/atividades/AtividadesForm";
import AtividadesList from "@/components/atividades/AtividadesList";

const ACTIVITY_TYPES = ["EXTENSION", "COMMITTEE", "EVENT", "OTHER"];

export default async function AtividadesPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: activities } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", profile.id)
    .in("employment_type", ACTIVITY_TYPES)
    .order("start_date", { ascending: false });

  const total = activities?.length ?? 0;
  const committees = activities?.filter((a) => a.employment_type === "COMMITTEE").length ?? 0;

  return (
    <DashboardShell profile={profile}>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-3">
            Atividades e Contribuicoes Academicas
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Registe as suas atividades de extensao, participacao em eventos,
            comites cientificos e outras contribuicoes para a comunidade
            academica.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AtividadesForm profileId={profile.id} />
          <AtividadesList activities={activities ?? []} />
        </div>

        <div className="space-y-6">
          <div className="bg-primary rounded-xl p-6 text-white">
            <h2 className="font-headline-md text-headline-md text-lg mb-6">
              Resumo de Impacto
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-4xl font-bold">{total}</p>
                <p className="text-xs uppercase tracking-widest text-white/70 mt-1">
                  Total de Atividades
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold">{committees}</p>
                <p className="text-xs uppercase tracking-widest text-white/70 mt-1">
                  Participacoes em Comites
                </p>
              </div>
            </div>
          </div>

          <div className="bg-secondary-container/10 border border-secondary/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-secondary">✨</span>
              <h3 className="font-headline-md text-headline-md text-primary text-base">
                Sugestoes da IA
              </h3>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Em breve: sugestoes baseadas nas suas publicacoes e percurso.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}