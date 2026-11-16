import { notFound } from "next/navigation";
import ApiManagement from "@/components/admin/ApiManagement";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Gerador de Acesso & API Institucional - UNIKIVI Admin",
};

export default async function AdminApiPage() {
  const sessionClient = await createClient();
  const { data: { user } } = await sessionClient.auth.getUser();
  if (!user) notFound();

  const { data: roles } = await sessionClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (!roles?.some((entry) => entry.role === "super_admin")) notFound();

  const admin = createAdminClient();
  const [clientsResult, keysResult] = await Promise.all([
    admin
      .from("api_clients")
      .select("id, name, description, contact, status, scopes, created_at")
      .order("created_at", { ascending: false }),
    admin
      .from("api_keys")
      .select("id, client_id, key_prefix, status, created_at, expires_at, last_used_at, request_count")
      .order("created_at", { ascending: false }),
  ]);

  const clients = (clientsResult.data ?? []).map((client) => ({
    ...client,
    keys: (keysResult.data ?? []).filter((key) => key.client_id === client.id),
  }));

  return <ApiManagement clients={clients} />;
}

