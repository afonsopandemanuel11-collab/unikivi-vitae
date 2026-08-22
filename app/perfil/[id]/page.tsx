// app/perfil/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileSidebar from "@/components/perfil/ProfileSidebar";
import SkillsSection from "@/components/perfil/SkillsSection";
import ExperienceTimeline from "@/components/perfil/ExperienceTimeline";
import EducationTimeline from "@/components/perfil/EducationTimeline";
import PublicationsGrid from "@/components/perfil/PublicationsGrid";
import ProjectsList from "@/components/perfil/ProjectsList";
import AwardsList from "@/components/perfil/AwardsList";

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      id, user_id, full_name, professional_name, bio, photo_url, status, visibility,
      faculty:faculties(name),
      department:departments(name),
      position:positions(name),
      profile_identifiers(identifier_type, identifier_value, url),
      profile_skills(level, years_experience, skills(name)),
      experiences(organization, position, description, start_date, end_date, is_current),
      education(degree, course, institution, institution_country, start_year, end_year, description),
      publication_authors(publications(id, title, abstract, publication_type, year, journal, doi, url)),
      project_members(role, projects(id, title, description, start_date, end_date, status, funding_amount, funding_currency, funding_source)),
      awards(title, issuer, year, description)
      `
    )
    .eq("id", id)
    .single();

  if (error || !profile) {
    notFound();
  }

  const raw = profile as any;

  const { data: viewerData } = await supabase.auth.getUser();
  const isOwner = viewerData.user?.id === raw.user_id;

  if (!isOwner) {
    if (raw.visibility === "PRIVATE") notFound();
    if ((raw.visibility === "RESTRICTED" || raw.visibility === "INSTITUTIONAL") && !viewerData.user) {
      notFound();
    }
  }

  const normalizedProfile = {
    ...raw,
    faculty: Array.isArray(raw.faculty) ? raw.faculty[0] ?? null : raw.faculty ?? null,
    department: Array.isArray(raw.department) ? raw.department[0] ?? null : raw.department ?? null,
    position: Array.isArray(raw.position) ? raw.position[0] ?? null : raw.position ?? null,
    profile_identifiers: raw.profile_identifiers ?? [],
  };

  const normalizedSkills = (raw.profile_skills ?? []).map((s: any) => ({
    ...s,
    skills: Array.isArray(s.skills) ? s.skills[0] ?? null : s.skills ?? null,
  }));

  const normalizedPublications = (raw.publication_authors ?? []).map((pa: any) => ({
    ...pa,
    publications: Array.isArray(pa.publications) ? pa.publications[0] ?? null : pa.publications ?? null,
  }));

  const normalizedProjects = (raw.project_members ?? []).map((pm: any) => ({
    ...pm,
    projects: Array.isArray(pm.projects) ? pm.projects[0] ?? null : pm.projects ?? null,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <ProfileSidebar profile={normalizedProfile} />
          <div className="lg:col-span-8 mt-12 lg:mt-0 space-y-section-gap">
            <SkillsSection skills={normalizedSkills} />
            <ExperienceTimeline experiences={raw.experiences ?? []} />
            <EducationTimeline education={raw.education ?? []} />
            <PublicationsGrid publicationAuthors={normalizedPublications} />
            <ProjectsList projectMembers={normalizedProjects} />
            <AwardsList awards={raw.awards ?? []} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}