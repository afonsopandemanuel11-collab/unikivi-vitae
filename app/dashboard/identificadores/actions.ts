"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function formatIdentifierUrl(type: string, value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  switch (type) {
    case "ORCID":
      return `https://orcid.org/${trimmed}`;
    case "CIENCIA_ID":
      return `https://www.cienciavitae.pt/${trimmed}`;
    case "SCOPUS":
      return `https://www.scopus.com/authid/detail.uri?authorId=${trimmed}`;
    case "GOOGLE_SCHOLAR":
      return `https://scholar.google.com/citations?user=${trimmed}`;
    case "LATTES":
      return `http://lattes.cnpq.br/${trimmed}`;
    case "GITHUB":
      return `https://github.com/${trimmed}`;
    case "LINKEDIN":
      return `https://linkedin.com/in/${trimmed}`;
    case "PORTFOLIO":
    case "WEBSITE":
    case "OTHER":
    default:
      return `https://${trimmed}`;
  }
}

export async function addIdentifier(
  profileId: string,
  identifierType: string,
  identifierValue: string
) {
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

  const { error } = await supabase.from("profile_identifiers").upsert(
    {
      profile_id: profileId,
      identifier_type: identifierType,
      identifier_value: identifierValue,
      url: formatIdentifierUrl(identifierType, identifierValue),
    },
    { onConflict: "profile_id, identifier_type" }
  );

  if (error) {
    console.error("[Supabase Error] profile_identifiers upsert:", error);
    if (error.code === "23505") {
      return {
        success: false,
        error: "Já existe um identificador registado para esta categoria. Remova o anterior antes de adicionar outro.",
      };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/identificadores");
  return { success: true };
}

export async function deleteIdentifier(identifierId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { error } = await supabase
    .from("profile_identifiers")
    .delete()
    .eq("id", identifierId);

  if (error) {
    console.error("[Supabase Error] profile_identifiers delete:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/identificadores");
  return { success: true };
}
