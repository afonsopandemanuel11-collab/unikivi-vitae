"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

const PUBLICATION_TYPES = ["ARTICLE", "CONFERENCE", "BOOK", "BOOK_CHAPTER", "THESIS", "REPORT", "PREPRINT", "OTHER"] as const satisfies readonly Enums<"publication_type_enum">[];

export type PublicationInput = {
  title: string;
  journal?: string | null;
  year?: number | null;
  doi?: string | null;
  publication_type: Enums<"publication_type_enum">;
  coAuthors: string[];
};

export async function addPublication(profileId: string, data: PublicationInput) {
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

  // 1. Cria a publicação
  const { data: publication, error: pubError } = await supabase
    .from("publications")
    .insert({
      title: data.title,
      journal: data.journal || null,
      year: data.year || null,
      doi: data.doi || null,
      publication_type: PUBLICATION_TYPES.includes(data.publication_type) ? data.publication_type : "ARTICLE",
    })
    .select("id")
    .single();

  if (pubError || !publication) {
    console.error("[Supabase Error] publications insert:", pubError);
    if (pubError?.code === "23505") {
      return { success: false, error: "Já existe uma publicação com este DOI." };
    }
    return {
      success: false,
      error: pubError?.message || "Não foi possível guardar a publicação.",
    };
  }

  // 2. Insere autores
  const authorsToInsert = [
    {
      publication_id: publication.id,
      profile_id: profileId,
      author_order: 1,
      is_corresponding: true,
    },
    ...data.coAuthors
      .filter((name) => name.trim())
      .map((name, i) => ({
        publication_id: publication.id,
        external_name: name.trim(),
        author_order: i + 2,
        is_corresponding: false,
      })),
  ];

  const { error: authorsError } = await supabase
    .from("publication_authors")
    .insert(authorsToInsert);

  if (authorsError) {
    console.error("[Supabase Error] publication_authors insert:", authorsError);
    return {
      success: false,
      error:
        authorsError.message ||
        "Publicação criada, mas houve um erro ao associar os autores.",
    };
  }

  revalidatePath("/dashboard/publicacoes");
  revalidatePath(`/perfil/${profileId}`);
  return { success: true };
}

export async function deletePublication(publicationId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // Elimina relações em publication_authors
  await supabase
    .from("publication_authors")
    .delete()
    .eq("publication_id", publicationId);

  // Elimina a publicação
  const { error: pubError } = await supabase
    .from("publications")
    .delete()
    .eq("id", publicationId);

  if (pubError) {
    console.error("[Supabase Error] publications delete:", pubError);
    return { success: false, error: pubError.message };
  }

  revalidatePath("/dashboard/publicacoes");
  return { success: true };
}
