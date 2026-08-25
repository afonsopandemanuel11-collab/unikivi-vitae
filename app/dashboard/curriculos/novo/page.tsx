import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateCurriculumWizard from "@/components/curriculos/CreateCurriculumWizard";

export default async function NovoCurriculoPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <CreateCurriculumWizard profileId={profile.id} />
    </div>
  );
}