import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CurriculumPreferencesForm from "@/components/settings/CurriculumPreferencesForm";

export default async function CurriculosSettingsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return <CurriculumPreferencesForm profile={profile} />;
}