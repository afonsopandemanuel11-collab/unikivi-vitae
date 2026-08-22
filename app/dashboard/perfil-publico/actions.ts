"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export async function updatePublicProfileSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const rawSlug = (formData.get("slug") as string) || "";
  const slug = slugify(rawSlug);
  if (!slug) return { success: false, error: "O slug não pode ficar vazio." };

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("slug", slug)
    .neq("user_id", user.id)
    .maybeSingle();

  if (existing) return { success: false, error: "Este URL já está a ser usado por outro perfil." };

  const section_visibility = {
    education: formData.get("visibility_education") === "on",
    experience: formData.get("visibility_experience") === "on",
    publications: formData.get("visibility_publications") === "on",
    projects: formData.get("visibility_projects") === "on",
    awards: formData.get("visibility_awards") === "on",
    skills: formData.get("visibility_skills") === "on",
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      slug,
      search_indexable: formData.get("search_indexable") === "on",
      section_visibility,
    })
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/perfil-publico");
  return { success: true };
}