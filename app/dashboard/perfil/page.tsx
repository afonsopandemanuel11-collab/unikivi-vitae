import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PersonalDataForm from "@/components/perfil-editor/PersonalDataForm";

export default async function DadosPessoaisPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) redirect("/dashboard");

  const [{ data: faculties }, { data: departments }, { data: positions }] = await Promise.all([
    supabase.from("faculties").select("id, name").eq("status", "ACTIVE").order("name"),
    supabase.from("departments").select("id, name, faculty_id").eq("status", "ACTIVE").order("name"),
    supabase.from("positions").select("id, name").order("rank_order"),
  ]);

  return (
    <DashboardShell profile={profile}>
      <PersonalDataForm
        profile={profile}
        faculties={faculties ?? []}
        departments={departments ?? []}
        positions={positions ?? []}
      />
    </DashboardShell>
  );
}