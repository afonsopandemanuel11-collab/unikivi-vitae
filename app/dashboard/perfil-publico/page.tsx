import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PublicProfileSettings from "@/components/perfil-publico/PublicProfileSettings";
import { slugify } from "@/lib/slugify";
import type { Json } from "@/lib/supabase/database.types";

export default async function PerfilPublicoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, photo_url, status, slug, search_indexable, section_visibility")
    .eq("user_id", user.id)
    .single();
  if (!profile) redirect("/dashboard");

  return (
    <DashboardShell profile={profile}>
      <PublicProfileSettings profile={{
        ...profile,
        slug: profile.slug || slugify(profile.full_name),
        section_visibility: normalizeSectionVisibility(profile.section_visibility),
      }} />
    </DashboardShell>
  );
}

function normalizeSectionVisibility(value: Json): {
  education: boolean; experience: boolean; publications: boolean;
  projects: boolean; awards: boolean; skills: boolean;
} {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    education: record.education !== false,
    experience: record.experience !== false,
    publications: record.publications !== false,
    projects: record.projects !== false,
    awards: record.awards !== false,
    skills: record.skills !== false,
  };
}
