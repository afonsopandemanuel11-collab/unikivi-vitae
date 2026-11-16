"use server";

import { revalidatePath } from "next/cache";
import { formString } from "@/lib/form-data";
import { requireAdmin } from "@/lib/admin/requireAdmin";

const CATEGORIES = ["PLATAFORMA", "COMUNIDADE", "INSTITUCIONAL"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function newsInput(formData: FormData) {
  const title = formString(formData, "title");
  const excerpt = formString(formData, "excerpt");
  const content = formString(formData, "content");
  const category = formString(formData, "category");
  const status = formString(formData, "status");
  const imageUrl = formString(formData, "image_url");
  const publishedAtValue = formString(formData, "published_at");

  if (!title || title.length > 180) return { error: "O título é obrigatório e pode ter até 180 caracteres." } as const;
  if (excerpt.length > 280 || content.length > 50000) return { error: "O resumo ou conteúdo excede o limite permitido." } as const;
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return { error: "Escolha uma categoria válida." } as const;
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return { error: "Escolha um estado válido." } as const;

  let safeImageUrl: string | null = null;
  if (imageUrl) {
    try {
      const parsed = new URL(imageUrl);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password || imageUrl.length > 2000) {
        return { error: "A imagem deve usar um endereço HTTPS válido." } as const;
      }
      safeImageUrl = parsed.toString();
    } catch {
      return { error: "Indique um endereço HTTPS válido para a imagem." } as const;
    }
  }

  const publishedAt = publishedAtValue && !Number.isNaN(Date.parse(publishedAtValue))
    ? new Date(publishedAtValue).toISOString()
    : new Date().toISOString();

  return {
    value: {
      title,
      excerpt: excerpt || null,
      content: content || null,
      category: category as (typeof CATEGORIES)[number],
      status: status as (typeof STATUSES)[number],
      image_url: safeImageUrl,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    },
  } as const;
}

export type NewsActionResult = { success: true } | { success: false; error: string };

export async function createNews(formData: FormData): Promise<NewsActionResult> {
  try {
    const supabase = await requireAdmin();
    const input = newsInput(formData);
    if ("error" in input) return { success: false, error: input.error ?? "Os dados da notícia são inválidos." };
    const { error } = await supabase.from("news").insert(input.value);
    if (error) return { success: false, error: "Não foi possível criar a notícia." };
    revalidatePath("/admin/news");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível criar a notícia." };
  }
}

export async function updateNews(id: string, formData: FormData): Promise<NewsActionResult> {
  try {
    if (!UUID_PATTERN.test(id)) return { success: false, error: "Notícia inválida." };
    const supabase = await requireAdmin();
    const input = newsInput(formData);
    if ("error" in input) return { success: false, error: input.error ?? "Os dados da notícia são inválidos." };
    const { error } = await supabase.from("news").update(input.value).eq("id", id);
    if (error) return { success: false, error: "Não foi possível atualizar a notícia." };
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível atualizar a notícia." };
  }
}

export async function archiveNews(id: string): Promise<NewsActionResult> {
  try {
    if (!UUID_PATTERN.test(id)) return { success: false, error: "Notícia inválida." };
    const supabase = await requireAdmin();
    const { error } = await supabase.from("news").update({ status: "ARCHIVED", updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return { success: false, error: "Não foi possível arquivar a notícia." };
    revalidatePath("/admin/news");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível arquivar a notícia." };
  }
}
