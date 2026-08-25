import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DangerZoneForm from "@/components/settings/DangerZoneForm";

export default async function ZonaDePerigoPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  return <DangerZoneForm profile={profile} />;
}