import { notFound } from "next/navigation";
import ApiManagement from "@/components/admin/ApiManagement";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

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
  const activeKeys = (keysResult.data ?? []).filter((key) => key.status === "ACTIVE").length;
  const requests = (keysResult.data ?? []).reduce((total, key) => total + key.request_count, 0);
  const hasError = Boolean(clientsResult.error || keysResult.error);

  return (
    <div>
      <header className="mb-8">
        <p className="mb-2 font-label-sm text-secondary">INTEGRAÇÕES INSTITUCIONAIS</p>
        <h1 className="font-headline-lg text-3xl font-bold text-primary sm:text-4xl">API UNIKIVI Vitae</h1>
        <p className="mt-2 max-w-3xl text-on-surface-variant">Configure clientes, escolha os perfis e campos autorizados e gira chaves de acesso sem expor credenciais internas.</p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Integrações registadas", value: clients.length, icon: "hub" },
          { label: "Chaves ativas", value: activeKeys, icon: "key" },
          { label: "Pedidos contabilizados", value: requests, icon: "query_stats" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            <span aria-hidden="true" className="material-symbols-outlined rounded-lg bg-primary-fixed p-2 text-primary">{item.icon}</span>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-outline">{item.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-primary">{item.value.toLocaleString("pt-PT")}</p>
          </div>
        ))}
      </div>

      {hasError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">Não foi possível carregar as integrações. Confirme as tabelas de chaves API no Supabase.</div>
      ) : (
        <ApiManagement clients={clients} />
      )}
    </div>
  );
}
