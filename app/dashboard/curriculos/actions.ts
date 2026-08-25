"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CurriculumSnapshot = {
  template: string;
  objective?: string;
  custom_title?: string;
  custom_summary?: string;
  sections: string[]; // e.g. ['summary', 'experience', 'education', 'skills', 'projects', 'publications', 'certifications', 'awards', 'languages', 'identifiers']
  selected_items: {
    experiences?: string[]; // IDs das experiências selecionadas
    education?: string[];   // IDs das formações selecionadas
    skills?: string[];      // IDs das competências selecionadas
    projects?: string[];    // IDs dos projetos selecionados
    publications?: string[];// IDs das publicações selecionadas
    certifications?: string[];// IDs das certificações selecionadas
    awards?: string[];      // IDs dos prémios selecionados
    languages?: string[];   // IDs dos idiomas selecionados
    identifiers?: string[]; // IDs dos identificadores selecionados
  };
  settings: {
    primary_color?: string;
    font?: string;
    density?: "compact" | "normal" | "spacious";
    layout?: "single" | "two-column";
    show_photo?: boolean;
    show_contacts?: boolean;
  };
};

export async function createCurriculum(
  profileId: string,
  data: {
    title: string;
    objective: string;
    template: string;
    selectedSections?: string[];
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const { data: ownProfile } = await supabase
    .from("profiles")
    .select("id, bio, professional_name, full_name")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .single();

  if (!ownProfile) return { success: false, error: "Perfil inválido ou não autorizado." };

  // Verifica se o utilizador já tem algum currículo. Se não tiver, define este como padrão
  const { count } = await supabase
    .from("curricula")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId);

  const isDefault = count === 0;

  // Secções padrão de acordo com o modelo/objetivo
  const defaultSections = data.selectedSections && data.selectedSections.length > 0
    ? data.selectedSections
    : data.template === "ACADEMIC" || data.template === "ACADEMIC_COMPACT"
    ? ["summary", "education", "publications", "projects", "certifications", "awards", "skills", "identifiers"]
    : data.template === "MODERN" || data.template === "MODERN_EDITORIAL"
    ? ["summary", "skills", "projects", "experience", "education", "identifiers", "certifications"]
    : ["summary", "experience", "education", "skills", "projects", "certifications", "identifiers"];

  // 1. Cria o registo do currículo
  const { data: curriculum, error: curriculumError } = await supabase
    .from("curricula")
    .insert({
      profile_id: profileId,
      title: data.title.trim(),
      summary: ownProfile.bio || null,
      template: data.template || "UNIKIVI_CLASSIC",
      status: "DRAFT",
      is_default: isDefault,
      language: "pt",
      current_version: 1,
    })
    .select("id")
    .single();

  if (curriculumError || !curriculum) {
    console.error("[Supabase Error] curricula insert:", curriculumError);
    return {
      success: false,
      error: curriculumError?.message || "Não foi possível criar o currículo.",
    };
  }

  // 2. Cria a versão inicial (snapshot)
  const initialSnapshot: CurriculumSnapshot = {
    template: data.template || "UNIKIVI_CLASSIC",
    objective: data.objective,
    custom_title: ownProfile.professional_name || ownProfile.full_name,
    custom_summary: ownProfile.bio || "",
    sections: defaultSections,
    selected_items: {}, // Por padrão, vazio significa selecionar tudo da secção ativa
    settings: {
      primary_color: "#00113A",
      font: "Inter",
      density: "normal",
      layout: "single",
      show_photo: true,
      show_contacts: true,
    },
  };

  const { error: versionError } = await supabase.from("curriculum_versions").insert({
    curriculum_id: curriculum.id,
    version: 1,
    snapshot: initialSnapshot,
    change_note: "Criação inicial do currículo",
  });

  if (versionError) {
    console.error("[Supabase Error] curriculum_versions insert:", versionError);
  }

  revalidatePath("/dashboard/curriculos");
  return { success: true, curriculumId: curriculum.id };
}

export async function deleteCurriculum(curriculumId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // 1. Elimina as versões associadas
  await supabase.from("curriculum_versions").delete().eq("curriculum_id", curriculumId);

  // 2. Elimina o currículo
  const { error } = await supabase.from("curricula").delete().eq("id", curriculumId);

  if (error) {
    console.error("[Supabase Error] curricula delete:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/curriculos");
  return { success: true };
}

export async function setDefaultCurriculum(curriculumId: string, profileId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // Remove o padrão dos outros
  await supabase
    .from("curricula")
    .update({ is_default: false })
    .eq("profile_id", profileId);

  // Define este como padrão
  const { error } = await supabase
    .from("curricula")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", curriculumId);

  if (error) {
    console.error("[Supabase Error] curricula setDefault:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/curriculos");
  return { success: true };
}

export async function duplicateCurriculum(curriculumId: string, profileId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // Procura o currículo original
  const { data: original, error: origError } = await supabase
    .from("curricula")
    .select("*, curriculum_versions(snapshot)")
    .eq("id", curriculumId)
    .single();

  if (origError || !original) {
    return { success: false, error: "Currículo original não encontrado." };
  }

  // Cria cópia na tabela curricula
  const { data: copy, error: copyError } = await supabase
    .from("curricula")
    .insert({
      profile_id: profileId,
      title: `${original.title} (Cópia)`,
      summary: original.summary,
      template: original.template,
      status: "DRAFT",
      is_default: false,
      language: original.language || "pt",
      current_version: 1,
    })
    .select("id")
    .single();

  if (copyError || !copy) {
    return { success: false, error: copyError?.message || "Erro ao duplicar currículo." };
  }

  // Copia o snapshot mais recente
  const lastSnapshot = original.curriculum_versions?.[0]?.snapshot || {
    template: original.template,
    sections: ["summary", "experience", "education", "skills"],
    selected_items: {},
    settings: {},
  };

  await supabase.from("curriculum_versions").insert({
    curriculum_id: copy.id,
    version: 1,
    snapshot: lastSnapshot,
    change_note: `Duplicado de ${original.title}`,
  });

  revalidatePath("/dashboard/curriculos");
  return { success: true, newCurriculumId: copy.id };
}

export async function saveCurriculumSnapshot(
  curriculumId: string,
  snapshot: CurriculumSnapshot,
  summaryText?: string,
  changeNote?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  // Obtém versão atual
  const { data: curr } = await supabase
    .from("curricula")
    .select("current_version")
    .eq("id", curriculumId)
    .single();

  const nextVersion = (curr?.current_version ?? 1) + 1;

  // Atualiza curricula
  const { error: updateError } = await supabase
    .from("curricula")
    .update({
      template: snapshot.template,
      summary: summaryText || snapshot.custom_summary || null,
      current_version: nextVersion,
      updated_at: new Date().toISOString(),
    })
    .eq("id", curriculumId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Insere nova versão
  const { error: versionError } = await supabase.from("curriculum_versions").insert({
    curriculum_id: curriculumId,
    version: nextVersion,
    snapshot,
    change_note: changeNote || `Atualização da versão ${nextVersion}`,
  });

  if (versionError) {
    console.error("[Supabase Error] version insert:", versionError);
  }

  revalidatePath("/dashboard/curriculos");
  revalidatePath(`/dashboard/curriculos/${curriculumId}`);
  return { success: true, version: nextVersion };
}
