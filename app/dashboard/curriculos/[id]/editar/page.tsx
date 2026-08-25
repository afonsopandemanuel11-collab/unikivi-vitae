import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CurriculumEditor from "@/components/curriculos/CurriculumEditor";
import { FullCurriculumData } from "@/components/curriculos/types";
import { CurriculumSnapshot } from "@/app/dashboard/curriculos/actions";

export default async function EditarCurriculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, faculty:faculties(name), department:departments(name), position:positions(name)")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  // Currículo
  const { data: curriculum } = await supabase
    .from("curricula")
    .select("*, curriculum_versions(*)")
    .eq("id", id)
    .eq("profile_id", profile.id)
    .single();

  if (!curriculum) redirect("/dashboard/curriculos");

  // Dados Estruturados do Perfil (não duplicados)
  const [
    { data: education },
    { data: experiences },
    { data: profileSkills },
    { data: projectMemberships },
    { data: authoredPubs },
    { data: certifications },
    { data: awards },
    { data: profileLanguages },
    { data: identifiers },
  ] = await Promise.all([
    supabase.from("education").select("*").eq("profile_id", profile.id).order("start_year", { ascending: false }),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false }),
    supabase.from("profile_skills").select("skills(id, name, skill_categories(name))").eq("profile_id", profile.id),
    supabase.from("project_members").select("role, projects(*)").eq("profile_id", profile.id),
    supabase.from("publication_authors").select("publications(*)").eq("profile_id", profile.id),
    supabase.from("certifications").select("*").eq("profile_id", profile.id).order("issue_date", { ascending: false }),
    supabase.from("awards").select("*").eq("profile_id", profile.id).order("year", { ascending: false }),
    supabase.from("profile_languages").select("proficiency, languages(id, name)").eq("profile_id", profile.id),
    supabase.from("profile_identifiers").select("*").eq("profile_id", profile.id),
  ]);

  // Normalização de Dados
  const normalizedFaculty = Array.isArray(profile.faculty) ? profile.faculty[0] : profile.faculty;
  const normalizedDept = Array.isArray(profile.department) ? profile.department[0] : profile.department;
  const normalizedPos = Array.isArray(profile.position) ? profile.position[0] : profile.position;

  const aggregatedData: FullCurriculumData = {
    profile: {
      ...profile,
      faculty: normalizedFaculty,
      department: normalizedDept,
      position: normalizedPos,
    },
    education: education ?? [],
    experiences: experiences ?? [],
    skills: (profileSkills ?? []).map((ps: any) => {
      const s = Array.isArray(ps.skills) ? ps.skills[0] : ps.skills;
      return {
        id: s?.id ?? "",
        name: s?.name ?? "",
        category_name: s?.skill_categories?.name ?? null,
      };
    }).filter((s) => s.id),
    projects: (projectMemberships ?? []).map((pm: any) => {
      const p = Array.isArray(pm.projects) ? pm.projects[0] : pm.projects;
      return {
        id: p?.id ?? "",
        title: p?.title ?? "",
        role: pm.role ?? "Membro",
        description: p?.description ?? null,
        start_date: p?.start_date ?? null,
        end_date: p?.end_date ?? null,
        status: p?.status ?? "ACTIVE",
        funding_source: p?.funding_source ?? null,
      };
    }).filter((p) => p.id),
    publications: (authoredPubs ?? []).map((ap: any) => {
      const pub = Array.isArray(ap.publications) ? ap.publications[0] : ap.publications;
      return {
        id: pub?.id ?? "",
        title: pub?.title ?? "",
        journal: pub?.journal ?? null,
        year: pub?.year ?? null,
        doi: pub?.doi ?? null,
        url: pub?.url ?? null,
        publication_type: pub?.publication_type ?? "ARTICLE",
      };
    }).filter((pub) => pub.id),
    certifications: certifications ?? [],
    awards: awards ?? [],
    languages: (profileLanguages ?? []).map((pl: any) => {
      const lang = Array.isArray(pl.languages) ? pl.languages[0] : pl.languages;
      return {
        id: lang?.id ?? "",
        name: lang?.name ?? "",
        proficiency: pl.proficiency ?? "Básico",
      };
    }).filter((l) => l.id),
    identifiers: identifiers ?? [],
  };

  // Snapshot Inicial mais recente da versão
  const sortedVersions = (curriculum.curriculum_versions ?? []).sort(
    (a: any, b: any) => b.version - a.version
  );

  const initialSnapshot: CurriculumSnapshot = sortedVersions[0]?.snapshot || {
    template: curriculum.template || "UNIKIVI_CLASSIC",
    custom_title: profile.professional_name || profile.full_name,
    custom_summary: curriculum.summary || profile.bio || "",
    sections: ["summary", "experience", "education", "skills", "projects", "certifications", "identifiers"],
    selected_items: {},
    settings: {
      primary_color: "#00113A",
      font: "Inter",
      density: "normal",
      layout: "single",
      show_photo: true,
      show_contacts: true,
    },
  };

  return (
    <CurriculumEditor
      curriculumId={curriculum.id}
      curriculumTitle={curriculum.title}
      initialSnapshot={initialSnapshot}
      data={aggregatedData}
    />
  );
}
