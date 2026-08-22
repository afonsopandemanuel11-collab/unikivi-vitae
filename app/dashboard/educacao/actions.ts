"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const endYearRaw = formData.get("end_year") as string;
  const isOngoing = formData.get("is_ongoing") === "on";

  const { error } = await supabase.from("education").insert({
    profile_id: profileId,
    degree: formData.get("degree"),
    course: formData.get("course"),
    institution: formData.get("institution"),
    institution_country: formData.get("institution_country") || "Angola",
    start_year: formData.get("start_year") ? Number(formData.get("start_year")) : null,
    end_year: isOngoing || !endYearRaw ? null : Number(endYearRaw),
    field_of_study: formData.get("field_of_study") || null,
    description: formData.get("description") || null,
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