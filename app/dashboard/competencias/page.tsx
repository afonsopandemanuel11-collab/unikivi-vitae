import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import CompetenciasForm from "@/components/Competencias/CompetenciasForm";
import CompetenciasList from "@/components/Competencias/CompetenciasList";

export default async function CompetenciasPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: categories } = await supabase
    .from("skill_categories")
    .select("id, name, icon")
    .order("name");

  const { data: profileSkills } = await supabase
    .from("profile_skills")
    .select("id, level, years_experience, skills(id, name, category_id)")
    .eq("profile_id", profile.id);

  return (
    <DashboardShell profile={profile}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Competencias & Habilidades
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Mapeie o seu repertorio tecnico e academico. Estas informacoes
            conectam-no a projetos relevantes e oportunidades de pesquisa no
            ecossistema UNIKIVI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <CompetenciasForm profileId={profile.id} categories={categories ?? []} />
        </div>
        <div className="lg:col-span-2">
          <CompetenciasList profileSkills={profileSkills ?? []} categories={categories ?? []} />
        </div>
      </div>
    </DashboardShell>
  );
}