"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const PROFILE_TYPES = ["TEACHER", "RESEARCHER", "STUDENT", "PROFESSIONAL", "TALENT"] as const;

export async function completeMissingProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const rawType = String(formData.get("profile_type") ?? "");
  if (fullName.length < 2 || fullName.length > 160) {
    redirect("/completar-perfil?erro=nome");
  }
  if (!PROFILE_TYPES.includes(rawType as (typeof PROFILE_TYPES)[number])) {
    redirect("/completar-perfil?erro=tipo");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const profileData = {
    user_id: user.id,
    full_name: fullName,
    profile_type: rawType as (typeof PROFILE_TYPES)[number],
  };

  const { error } = currentProfile
    ? await supabase.from("profiles").update(profileData).eq("user_id", user.id)
    : await supabase.from("profiles").insert(profileData);

  if (error) redirect("/completar-perfil?erro=guardar");

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
