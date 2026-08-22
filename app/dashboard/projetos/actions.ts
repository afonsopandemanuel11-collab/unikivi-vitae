"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProjectInput = {
  title: string;
  role: string;
  funding_source?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  status: string;
  description?: string | null;
};

export async function addProject(profileId: string, data: ProjectInput) {
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

  // 1. Cria o projeto
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      title: data.title,
      description: data.description || null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      status: data.status,
      funding_source: data.funding_source || null,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    console.error("[Supabase Error] projects insert:", projectError);
    return {
      success: false,
      error:
        projectError?.message ||
        "Não foi possível criar o projeto. Verifique as permissões da tabela 'projects'.",
    };
  }

  // 2. Associa o perfil ao projeto através de project_members
  const { error: memberError } = await supabase.from("project_members").insert({
    project_id: project.id,
    profile_id: profileId,
    role: data.role || "Membro",
  });

  if (memberError) {
    console.error("[Supabase Error] project_members insert:", memberError);
    return {
      success: false,
      error:
        memberError?.message ||
        "Projeto criado, mas ocorreu um erro ao associar o perfil como membro.",
    };
  }

  revalidatePath("/dashboard/projetos");
  revalidatePath(`/perfil/${profileId}`);
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // Elimina a relação em project_members
  const { error: memberError } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", projectId);

  if (memberError) {
    console.error("[Supabase Error] delete project_members:", memberError);
  }

  // Elimina o projeto
  const { error: projectError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  revalidatePath("/dashboard/projetos");
  return { success: true };
}
