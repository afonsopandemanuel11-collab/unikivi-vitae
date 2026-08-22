import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ExperienceManager from "@/components/experiencia/ExperienceManager";

export default async function ExperienciaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, photo_url, status")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/dashboard");

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", profile.id)
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false });

  return (
    <DashboardShell profile={profile}>
      <ExperienceManager profileId={profile.id} experiences={experiences ?? []} />
    </DashboardShell>
  );
}