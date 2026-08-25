"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
    name: formData.get("name"),
    issuer: formData.get("issuer"),
    issue_date: formData.get("issue_date") || null,
    expiry_date: formData.get("expiry_date") || null,
    credential_id: formData.get("credential_id") || null,
    credential_url: formData.get("credential_url") || null,
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