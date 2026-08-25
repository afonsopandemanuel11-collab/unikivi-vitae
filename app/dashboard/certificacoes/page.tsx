import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import CertificationsManager from "@/components/certificacoes/CertificationsManager";

export default async function CertificacoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, photo_url, status")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/dashboard");

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("profile_id", profile.id)
    .order("issue_date", { ascending: false });

  return (
    <DashboardShell profile={profile}>
      <CertificationsManager profileId={profile.id} certifications={certifications ?? []} />
    </DashboardShell>
  );
}