"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
      title: formData.get("title"),
      journal: formData.get("journal") || null,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      doi: formData.get("doi") || null,
      publication_type: formData.get("publication_type") || "ARTICLE",
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