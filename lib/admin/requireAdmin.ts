import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("A sessão expirou. Inicie sessão novamente.");

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (rolesError || !roles?.some((entry) => entry.role === "institution_admin" || entry.role === "super_admin")) {
    throw new Error("É necessário ter acesso de administrador.");
  }

  return createAdminClient();
}
