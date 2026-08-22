import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PublicationsManager from "@/components/producao-cientifica/PublicationsManager";

export default async function ProducaoCientificaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, photo_url, status")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/dashboard");

  const { data: authored } = await supabase
    .from("publication_authors")
    .select("publication_id")
    .eq("profile_id", profile.id);

  const pubIds = (authored ?? []).map((a) => a.publication_id);

  const { data: publications } = pubIds.length
    ? await supabase
        .from("publications")
        .select("*, publication_authors(author_order, external_name, profiles(full_name))")
        .in("id", pubIds)
        .order("year", { ascending: false })
    : { data: [] };

  return (
    <DashboardShell profile={profile}>
      <PublicationsManager profileId={profile.id} profileFullName={profile.full_name} publications={publications ?? []} />
    </DashboardShell>
  );
}