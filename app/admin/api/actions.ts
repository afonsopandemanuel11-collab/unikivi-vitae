"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { formString } from "@/lib/form-data";
import { API_FIELDS, API_PROFILE_TYPES, buildApiScopes, type ApiField, type ApiProfileType } from "@/lib/api/scopes";
import { requireSuperAdmin } from "@/lib/admin/requireSuperAdmin";

export type ApiActionResult =
  | { success: true; apiKey?: string }
  | { success: false; error: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const allowedProfileTypes = new Set<string>(API_PROFILE_TYPES);
const allowedFields = new Set<string>(API_FIELDS.map((field) => field.key));

function selectedStrings(formData: FormData, key: string, allowed: Set<string>) {
  return [...new Set(formData.getAll(key).filter((value): value is string => typeof value === "string"))]
    .filter((value) => allowed.has(value));
}

function expirationFromDays(value: string): string | null {
  const days = Number(value);
  if (![30, 90, 180].includes(days)) return null;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function generateApiKey() {
  const value = `ukv_live_${randomBytes(32).toString("base64url")}`;
  return {
    value,
    hash: createHash("sha256").update(value).digest("hex"),
    prefix: value.slice(0, 17),
  };
}

async function insertApiKey(
  supabase: Awaited<ReturnType<typeof requireSuperAdmin>>,
  clientId: string,
  expiresAt: string,
): Promise<ApiActionResult> {
  const key = generateApiKey();
  const { error } = await supabase.from("api_keys").insert({
    client_id: clientId,
    key_hash: key.hash,
    key_prefix: key.prefix,
    status: "ACTIVE",
    expires_at: expiresAt,
  });

  if (error) return { success: false, error: "Não foi possível criar a chave. Tente novamente." };
  revalidatePath("/admin/api");
  return { success: true, apiKey: key.value };
}

function parseScopes(formData: FormData) {
  const profileTypes = selectedStrings(formData, "profileTypes", allowedProfileTypes) as ApiProfileType[];
  const fields = selectedStrings(formData, "fields", allowedFields) as ApiField[];
  if (profileTypes.length === 0) return { error: "Selecione pelo menos um tipo de perfil." } as const;
  if (fields.length === 0) return { error: "Selecione pelo menos um campo para disponibilizar." } as const;
  return { profileTypes, fields } as const;
}

export async function createApiIntegration(formData: FormData): Promise<ApiActionResult> {
  try {
    const supabase = await requireSuperAdmin();
    const name = formString(formData, "name");
    const description = formString(formData, "description");
    const contact = formString(formData, "contact");
    const expiresAt = expirationFromDays(formString(formData, "expires_days"));
    const scopes = parseScopes(formData);

    if (name.length < 3 || name.length > 100) {
      return { success: false, error: "O nome da integração deve ter entre 3 e 100 caracteres." };
    }
    if (description.length > 500 || contact.length > 180) {
      return { success: false, error: "A descrição ou o contacto excede o limite permitido." };
    }
    if ("error" in scopes) return { success: false, error: scopes.error ?? "Seleção de permissões inválida." };
    if (!expiresAt) return { success: false, error: "Escolha uma validade de 30, 90 ou 180 dias." };

    const { data: client, error: clientError } = await supabase
      .from("api_clients")
      .insert({
        name,
        description: description || null,
        contact: contact || null,
        status: "ACTIVE",
        scopes: buildApiScopes(scopes.profileTypes, scopes.fields),
      })
      .select("id")
      .single();

    if (clientError || !client) {
      return {
        success: false,
        error: clientError?.code === "23505"
          ? "Já existe uma integração com este nome."
          : "Não foi possível registar a integração.",
      };
    }

    const result = await insertApiKey(supabase, client.id, expiresAt);
    if (result.success === false) {
      await supabase.from("api_clients").delete().eq("id", client.id);
      return result;
    }
    return result;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível concluir a operação." };
  }
}

export async function saveApiScopes(clientId: string, formData: FormData): Promise<ApiActionResult> {
  try {
    if (!UUID_PATTERN.test(clientId)) return { success: false, error: "Integração inválida." };
    const supabase = await requireSuperAdmin();
    const scopes = parseScopes(formData);
    if ("error" in scopes) return { success: false, error: scopes.error ?? "Seleção de permissões inválida." };

    const { error } = await supabase
      .from("api_clients")
      .update({ scopes: buildApiScopes(scopes.profileTypes, scopes.fields), updated_at: new Date().toISOString() })
      .eq("id", clientId);

    if (error) return { success: false, error: "Não foi possível guardar as permissões desta integração." };
    revalidatePath("/admin/api");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível concluir a operação." };
  }
}

export async function createApiKey(clientId: string, formData: FormData): Promise<ApiActionResult> {
  try {
    if (!UUID_PATTERN.test(clientId)) return { success: false, error: "Integração inválida." };
    const supabase = await requireSuperAdmin();
    const { data: client, error } = await supabase
      .from("api_clients")
      .select("id, status")
      .eq("id", clientId)
      .maybeSingle();

    if (error || !client || client.status !== "ACTIVE") {
      return { success: false, error: "Ative a integração antes de criar uma chave." };
    }

    const expiresAt = expirationFromDays(formString(formData, "expires_days"));
    if (!expiresAt) return { success: false, error: "Escolha uma validade de 30, 90 ou 180 dias." };
    return await insertApiKey(supabase, clientId, expiresAt);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível criar a chave." };
  }
}

export async function revokeApiKey(keyId: string): Promise<ApiActionResult> {
  try {
    if (!UUID_PATTERN.test(keyId)) return { success: false, error: "Chave inválida." };
    const supabase = await requireSuperAdmin();
    const { error } = await supabase.from("api_keys").update({ status: "REVOKED" }).eq("id", keyId);
    if (error) return { success: false, error: "Não foi possível revogar a chave." };
    revalidatePath("/admin/api");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível revogar a chave." };
  }
}

export async function setApiClientStatus(clientId: string, status: "ACTIVE" | "SUSPENDED"): Promise<ApiActionResult> {
  try {
    if (!UUID_PATTERN.test(clientId)) return { success: false, error: "Integração inválida." };
    if (status !== "ACTIVE" && status !== "SUSPENDED") return { success: false, error: "Estado inválido." };
    const supabase = await requireSuperAdmin();
    const { error } = await supabase
      .from("api_clients")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", clientId);
    if (error) return { success: false, error: "Não foi possível atualizar o estado da integração." };
    revalidatePath("/admin/api");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Não foi possível atualizar a integração." };
  }
}
