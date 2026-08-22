"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addExperience(profileId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const { data: ownProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .single();
  if (!ownProfile) return { success: false, error: "Perfil inválido." };

  const isCurrent = formData.get("is_current") === "on";
  const endDateRaw = formData.get("end_date") as string;

  const { error } = await supabase.from("experiences").insert({
    profile_id: profileId,
    organization: formData.get("organization"),
    position: formData.get("position"),
    location: formData.get("location") || null,
    employment_type: formData.get("employment_type") || null,
    start_date: formData.get("start_date") || null,
    end_date: isCurrent || !endDateRaw ? null : endDateRaw,
    is_current: isCurrent,
    description: formData.get("description") || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/experiencia");
  return { success: true };
}

export async function deleteExperience(experienceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const { error } = await supabase.from("experiences").delete().eq("id", experienceId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/experiencia");
  return { success: true };
}