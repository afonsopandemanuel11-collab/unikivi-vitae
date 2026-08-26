// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MainDashboard, { MainDashboardData } from "@/components/dashboard/MainDashboard";
import NetworkSidebar, { NetworkMember } from "@/components/dashboard/NetworkSidebar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, faculty:faculties(name), department:departments(name), position:positions(name)")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) {
    redirect("/completar-perfil");
  }

  // Agregação de dados reais em paralelo para alta performance
  const [
    { data: education, count: educationCount },
    { data: experiences, count: experiencesCount },
    { data: profileSkills, count: skillsCount },
    { data: projectMemberships, count: projectsCount },
    { data: authoredPubs, count: publicationsCount },
    { data: certifications, count: certificationsCount },
    { data: awards, count: awardsCount },
    { data: curricula, count: curriculaCount },
    { data: identifiers, count: identifiersCount },
    { data: otherProfiles },
  ] = await Promise.all([
    supabase.from("education").select("id, degree, course, institution, start_year, end_year", { count: "exact" }).eq("profile_id", profile.id).order("start_year", { ascending: false }),
    supabase.from("experiences").select("id, position, organization, start_date, end_date, is_current", { count: "exact" }).eq("profile_id", profile.id).order("start_date", { ascending: false }),
    supabase.from("profile_skills").select("skills(id, name)", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("project_members").select("role, projects(id, title, status, start_date, end_date)", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("publication_authors").select("publications(id, title, journal, year, publication_type, created_at)", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("certifications").select("id, name, issuer", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("awards").select("id, title, issuer", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("curricula").select("id, title, template, status, updated_at, created_at", { count: "exact" }).eq("profile_id", profile.id).order("updated_at", { ascending: false }),
    supabase.from("profile_identifiers").select("id, identifier_type, identifier_value", { count: "exact" }).eq("profile_id", profile.id),
    supabase.from("profiles").select("id, full_name, photo_url, position:positions(name), department:departments(name), faculty:faculties(name), status").neq("id", profile.id).limit(6),
  ]);

  // Normalização de Projetos
  const normalizedProjects = (projectMemberships ?? []).map((pm: any) => {
    const p = Array.isArray(pm.projects) ? pm.projects[0] : pm.projects;
    return {
      id: p?.id ?? "",
      title: p?.title ?? "",
      role: pm.role ?? "Membro",
      status: p?.status ?? "ACTIVE",
    };
  }).filter((p) => p.id);

  // Normalização de Publicações
  const normalizedPubs = (authoredPubs ?? []).map((ap: any) => {
    const pub = Array.isArray(ap.publications) ? ap.publications[0] : ap.publications;
    return {
      id: pub?.id ?? "",
      title: pub?.title ?? "",
      journal: pub?.journal ?? null,
      year: pub?.year ?? null,
      publication_type: pub?.publication_type ?? "ARTICLE",
      created_at: pub?.created_at ?? "",
    };
  }).filter((pub) => pub.id);

  // Atividades recentes combinadas e ordenadas por data
  const activities: Array<{
    id: string;
    type: "curriculum" | "publication" | "project" | "profile";
    title: string;
    description: string;
    date: string;
  }> = [];

  (curricula ?? []).slice(0, 2).forEach((c) => {
    activities.push({
      id: `curr-${c.id}`,
      type: "curriculum",
      title: `Currículo atualizado - "${c.title}"`,
      description: `Última edição em ${new Date(c.updated_at).toLocaleDateString("pt-PT")}`,
      date: c.updated_at,
    });
  });

  normalizedPubs.slice(0, 2).forEach((p) => {
    activities.push({
      id: `pub-${p.id}`,
      type: "publication",
      title: `Publicação registada - "${p.title}"`,
      description: `${p.journal ? `${p.journal} • ` : ""}${p.year || "Recente"}`,
      date: p.created_at || profile.updated_at,
    });
  });

  normalizedProjects.slice(0, 1).forEach((proj) => {
    activities.push({
      id: `proj-${proj.id}`,
      type: "project",
      title: `Projeto associado - "${proj.title}"`,
      description: `Papel: ${proj.role}`,
      date: profile.updated_at,
    });
  });

  // Cálculo de percentagem de conclusão real do perfil
  let completionPercent = 0;
  if (profile.photo_url) completionPercent += 10;
  if (profile.bio && profile.bio.trim().length > 10) completionPercent += 10;
  if ((educationCount ?? 0) > 0) completionPercent += 15;
  if ((experiencesCount ?? 0) > 0) completionPercent += 15;
  if ((skillsCount ?? 0) >= 3) completionPercent += 15;
  else if ((skillsCount ?? 0) > 0) completionPercent += 10;
  if ((projectsCount ?? 0) > 0) completionPercent += 15;
  if ((publicationsCount ?? 0) > 0 || (certificationsCount ?? 0) > 0) completionPercent += 10;
  if ((identifiersCount ?? 0) > 0) completionPercent += 10;
  completionPercent = Math.min(100, completionPercent);

  // Mapeamento de membros da rede reais
  const networkMembers: NetworkMember[] = (otherProfiles ?? []).map((p: any) => {
    const pos = Array.isArray(p.position) ? p.position[0]?.name : p.position?.name;
    const dep = Array.isArray(p.department) ? p.department[0]?.name : p.department?.name;
    return {
      id: p.id,
      full_name: p.full_name,
      photo_url: p.photo_url,
      position_title: pos || dep || "Membro UNIKIVI",
      location: "Uíge",
      isOnline: p.status === "ACTIVE",
    };
  });

  const dashboardData: MainDashboardData = {
    profile: {
      id: profile.id,
      full_name: profile.full_name,
      professional_name: profile.professional_name,
      bio: profile.bio,
      photo_url: profile.photo_url,
      status: profile.status,
      visibility: profile.visibility,
      updated_at: profile.updated_at,
      created_at: profile.created_at,
    },
    stats: {
      publicationsCount: publicationsCount ?? 0,
      projectsCount: projectsCount ?? 0,
      activeProjectsCount: normalizedProjects.filter((p) => p.status === "ACTIVE").length,
      skillsCount: skillsCount ?? 0,
      certificationsCount: (certificationsCount ?? 0) + (awardsCount ?? 0),
      educationCount: educationCount ?? 0,
      experiencesCount: experiencesCount ?? 0,
      curriculaCount: curriculaCount ?? 0,
      identifiersCount: identifiersCount ?? 0,
    },
    curricula: curricula ?? [],
    recentPublications: normalizedPubs.slice(0, 2),
    activeProjects: normalizedProjects.filter((p) => p.status === "ACTIVE").slice(0, 2),
    recentActivities: activities,
  };

  return (
    <DashboardShell profile={profile} completionPercent={completionPercent}>
      <div className="flex flex-col xl:flex-row items-start gap-8 xl:gap-10 2xl:gap-12 w-full">
        <div className="flex-1 min-w-0 w-full">
          <MainDashboard data={dashboardData} />
        </div>
        <NetworkSidebar members={networkMembers} />
      </div>
    </DashboardShell>
  );
}