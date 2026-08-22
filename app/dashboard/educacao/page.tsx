import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import EducationManager from "@/components/educacao/EducationManager";

export default async function EducacaoPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, photo_url, status")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/dashboard");

  const { data: education } = await supabase
    .from("education")
    .select("*")
    .eq("profile_id", profile.id)
    .order("end_year", { ascending: false, nullsFirst: true });

  return (
    <DashboardShell profile={profile}>
      <EducationManager profileId={profile.id} education={education ?? []} />
    </DashboardShell>
  );
}