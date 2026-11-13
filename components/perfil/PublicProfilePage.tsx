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
import ProfileViewTracker from "@/components/perfil/ProfileViewTracker";

type Relation<T> = T | T[] | null;
type PublicProfileData = {
  id: string;
  user_id: string;
  full_name: string;
  professional_name: string | null;
  bio: string | null;
  photo_url: string | null;
  status: string;
  visibility: string;
  faculty: Relation<{ name: string }>;
  department: Relation<{ name: string }>;
  position: Relation<{ name: string }>;
  profile_identifiers: { identifier_type: string; identifier_value: string; url: string | null }[] | null;
  profile_skills: { level: string | null; years_experience: number | null; skills: Relation<{ name: string }> }[] | null;
  experiences: { organization: string; position: string; description: string | null; start_date: string | null; end_date: string | null; is_current: boolean }[] | null;
  education: { degree: string; course: string; institution: string; institution_country: string | null; start_year: number | null; end_year: number | null; description: string | null }[] | null;
  publication_authors: { publications: Relation<{ id: string; title: string; abstract: string | null; publication_type: string; year: number | null; journal: string | null; doi: string | null; url: string | null }> }[] | null;
  project_members: { role: string; projects: Relation<{ id: string; title: string; description: string | null; start_date: string | null; end_date: string | null; status: string; funding_amount: number | null; funding_currency: string | null; funding_source: string | null }> }[] | null;
  awards: { title: string; issuer: string; year: number | null; description: string | null }[] | null;
};

function normalizeRelation<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function PublicProfilePage({
  identifier,
  lookup,
}: {
  identifier: string;
  lookup: "id" | "slug";
}) {
  const supabase = await createClient();
  const profileQuery = supabase.from("profiles").select(`
    id, user_id, full_name, professional_name, bio, photo_url, status, visibility,
    faculty:faculties(name), department:departments(name), position:positions(name),
    profile_identifiers(identifier_type, identifier_value, url),
    profile_skills(level, years_experience, skills(name)),
    experiences(organization, position, description, start_date, end_date, is_current),
    education(degree, course, institution, institution_country, start_year, end_year, description),
    publication_authors(publications(id, title, abstract, publication_type, year, journal, doi, url)),
    project_members(role, projects(id, title, description, start_date, end_date, status, funding_amount, funding_currency, funding_source)),
    awards(title, issuer, year, description)
  `);
  const { data: profile, error } = await (lookup === "id"
    ? profileQuery.eq("id", identifier)
    : profileQuery.eq("slug", identifier)
  ).single();

  if (error || !profile) notFound();

  const raw = profile as unknown as PublicProfileData;
  const { data: viewerData } = await supabase.auth.getUser();
  const isOwner = viewerData.user?.id === raw.user_id;
  if (!isOwner) {
    if (raw.visibility === "PRIVATE") notFound();
    if ((raw.visibility === "RESTRICTED" || raw.visibility === "INSTITUTIONAL") && !viewerData.user) notFound();
  }

  const normalizedProfile = {
    ...raw,
    faculty: normalizeRelation(raw.faculty),
    department: normalizeRelation(raw.department),
    position: normalizeRelation(raw.position),
    profile_identifiers: raw.profile_identifiers ?? [],
  };
  const normalizedSkills = (raw.profile_skills ?? []).map((item) => ({ ...item, skills: normalizeRelation(item.skills) }));
  const normalizedPublications = (raw.publication_authors ?? []).map((item) => ({ ...item, publications: normalizeRelation(item.publications) }));
  const normalizedProjects = (raw.project_members ?? []).map((item) => ({ ...item, projects: normalizeRelation(item.projects) }));

  return (
    <>
      <ProfileViewTracker profileId={raw.id} enabled={!isOwner && raw.visibility === "PUBLIC" && raw.status === "ACTIVE"} />
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
