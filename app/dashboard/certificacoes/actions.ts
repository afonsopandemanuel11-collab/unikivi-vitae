"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString, optionalFormString } from "@/lib/form-data";

export async function addCertification(profileId: string, formData: FormData) {
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

  const { error } = await supabase.from("certifications").insert({
    profile_id: profileId,
    name: formString(formData, "name"),
    issuer: formString(formData, "issuer"),
    issue_date: optionalFormString(formData, "issue_date"),
    expiry_date: optionalFormString(formData, "expiry_date"),
    credential_id: optionalFormString(formData, "credential_id"),
    credential_url: optionalFormString(formData, "credential_url"),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/certificacoes");
  return { success: true };
}

export async function deleteCertification(certificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const { error } = await supabase.from("certifications").delete().eq("id", certificationId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/certificacoes");
  return { success: true };
}
