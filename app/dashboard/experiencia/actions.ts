"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString, optionalFormString } from "@/lib/form-data";

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
  const endDateRaw = formString(formData, "end_date");

  const { error } = await supabase.from("experiences").insert({
    profile_id: profileId,
    organization: formString(formData, "organization"),
    position: formString(formData, "position"),
    location: optionalFormString(formData, "location"),
    employment_type: optionalFormString(formData, "employment_type"),
    start_date: optionalFormString(formData, "start_date"),
    end_date: isCurrent || !endDateRaw ? null : endDateRaw,
    is_current: isCurrent,
    description: optionalFormString(formData, "description"),
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
