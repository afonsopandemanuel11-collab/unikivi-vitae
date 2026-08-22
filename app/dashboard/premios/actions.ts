"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AwardInput = {
  title: string;
  issuer: string;
  year?: number | null;
  url?: string | null;
  description?: string | null;
};

export type CertificationInput = {
  name: string;
  issuer: string;
  credential_id?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  credential_url?: string | null;
  description?: string | null;
};

export async function addAward(profileId: string, data: AwardInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { data: ownProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .single();

  if (!ownProfile) return { success: false, error: "Perfil inválido ou não autorizado." };

  const { error } = await supabase.from("awards").insert({
    profile_id: profileId,
    title: data.title,
    issuer: data.issuer,
    year: data.year || null,
    url: data.url || null,
    description: data.description || null,
  });

  if (error) {
    console.error("[Supabase Error] awards insert:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/premios");
  revalidatePath(`/perfil/${profileId}`);
  return { success: true };
}

export async function deleteAward(awardId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { error } = await supabase.from("awards").delete().eq("id", awardId);

  if (error) {
    console.error("[Supabase Error] awards delete:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/premios");
  return { success: true };
}

export async function addCertification(profileId: string, data: CertificationInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { data: ownProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .single();

  if (!ownProfile) return { success: false, error: "Perfil inválido ou não autorizado." };

  const { error } = await supabase.from("certifications").insert({
    profile_id: profileId,
    name: data.name,
    issuer: data.issuer,
    credential_id: data.credential_id || null,
    issue_date: data.issue_date || null,
    expiry_date: data.expiry_date || null,
    credential_url: data.credential_url || null,
    description: data.description || null,
  });

  if (error) {
    console.error("[Supabase Error] certifications insert:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/premios");
  revalidatePath(`/perfil/${profileId}`);
  return { success: true };
}

export async function deleteCertification(certificationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", certificationId);

  if (error) {
    console.error("[Supabase Error] certifications delete:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/premios");
  return { success: true };
}
