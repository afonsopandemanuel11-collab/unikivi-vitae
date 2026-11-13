"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString, optionalFormString } from "@/lib/form-data";
import type { Enums } from "@/lib/supabase/database.types";

const PUBLICATION_TYPES = ["ARTICLE", "CONFERENCE", "BOOK", "BOOK_CHAPTER", "THESIS", "REPORT", "PREPRINT", "OTHER"] as const satisfies readonly Enums<"publication_type_enum">[];

export async function addPublication(profileId: string, formData: FormData) {
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

  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .insert({
      title: formString(formData, "title"),
      journal: optionalFormString(formData, "journal"),
      year: formString(formData, "year") ? Number(formString(formData, "year")) : null,
      doi: optionalFormString(formData, "doi"),
      publication_type: PUBLICATION_TYPES.includes(formString(formData, "publication_type") as Enums<"publication_type_enum">)
        ? formString(formData, "publication_type") as Enums<"publication_type_enum">
        : "ARTICLE",
    })
    .select("id")
    .single();

  if (pubError || !publication) return { success: false, error: pubError?.message ?? "Erro ao criar publicação." };

  const authorNames = formData.getAll("author_name").map((n) => String(n).trim()).filter(Boolean);

  const authorRows = authorNames.map((name, index) => ({
    publication_id: publication.id,
    profile_id: index === 0 ? profileId : null, // o primeiro autor és sempre tu
    external_name: index === 0 ? null : name,
    author_order: index + 1,
    is_corresponding: index === 0,
  }));

  const { error: authorsError } = await supabase.from("publication_authors").insert(authorRows);
  if (authorsError) return { success: false, error: authorsError.message };

  revalidatePath("/dashboard/producao-cientifica");
  return { success: true };
}

export async function deletePublication(publicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const { error } = await supabase.from("publications").delete().eq("id", publicationId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/producao-cientifica");
  return { success: true };
}
