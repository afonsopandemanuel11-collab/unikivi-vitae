"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString, optionalFormString } from "@/lib/form-data";

export async function addEducation(profileId: string, formData: FormData) {
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

  const endYearRaw = formString(formData, "end_year");
  const isOngoing = formData.get("is_ongoing") === "on";

  const { error } = await supabase.from("education").insert({
    profile_id: profileId,
    degree: formString(formData, "degree"),
    course: formString(formData, "course"),
    institution: formString(formData, "institution"),
    institution_country: formString(formData, "institution_country") || "Angola",
    start_year: formString(formData, "start_year") ? Number(formString(formData, "start_year")) : null,
    end_year: isOngoing || !endYearRaw ? null : Number(endYearRaw),
    field_of_study: optionalFormString(formData, "field_of_study"),
    description: optionalFormString(formData, "description"),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/educacao");
  return { success: true };
}

export async function deleteEducation(educationId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const { error } = await supabase.from("education").delete().eq("id", educationId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/educacao");
  return { success: true };
}
