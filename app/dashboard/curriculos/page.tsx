import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import CurriculumDashboard from "@/components/curriculos/CurriculumDashboard";

export default async function CurriculosPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: curricula } = await supabase
    .from("curricula")
    .select("*")
    .eq("profile_id", profile.id)
    .order("updated_at", { ascending: false });

  return (
    <DashboardShell profile={profile}>
      <CurriculumDashboard
        profileId={profile.id}
        curricula={curricula ?? []}
      />
    </DashboardShell>
  );
}