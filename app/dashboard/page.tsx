// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import ResearcherDashboard from "@/components/dashboard/ResearcherDashboard";
import ProfessionalDashboard from "@/components/dashboard/ProfessionalDashboard";
import TalentDashboard from "@/components/dashboard/TalentDashboard";

// Tipos espelhados do esquema Supabase
type ProfileType =
  | "STUDENT"
  | "TEACHER"
  | "RESEARCHER"
  | "PROFESSIONAL"
  | "TALENT"
  | "ADMIN"
  | "VISITOR";

type ProfileStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

interface Profile {
  id: string;
  user_id: string;
  profile_type: ProfileType;
  full_name: string;
  institutional_email: string | null;
  faculty_id: string | null;
  department_id: string | null;
  position_id: string | null;
  status: ProfileStatus;
  visibility: string;
  photo_url: string | null;
  created_at: string;
}

function DashboardContent({ profile }: { profile: Profile }) {
  switch (profile.profile_type) {
    case "STUDENT":
      return <StudentDashboard profile={profile} />;
    case "TEACHER":
      return <TeacherDashboard profile={profile} />;
    case "RESEARCHER":
      return <ResearcherDashboard profile={profile} />;
    case "PROFESSIONAL":
      return <ProfessionalDashboard profile={profile} />;
    case "TALENT":
      return <TalentDashboard profile={profile} />;
    default:
      // ADMIN, VISITOR ou tipos futuros — fallback neutro
      return (
        <div className="bg-white rounded-xl border border-outline-variant p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-outline mb-2 block">
            manage_accounts
          </span>
          <p className="text-on-surface-variant text-sm">
            Tipo de perfil <strong>{profile.profile_type}</strong> — dashboard
            específico em desenvolvimento.
          </p>
        </div>
      );
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) {
    redirect("/completar-perfil");
  }

  return (
    <DashboardShell profile={profile}>
      <DashboardContent profile={profile} />
    </DashboardShell>
  );
}