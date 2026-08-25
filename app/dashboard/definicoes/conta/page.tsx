import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountSettingsForm from "@/components/settings/AccountSettingsForm";

export default async function ContaSettingsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return (
    <AccountSettingsForm
      profile={profile}
      email={userData.user.email ?? ""}
      provider={userData.user.app_metadata?.provider ?? "email"}
    />
  );
}