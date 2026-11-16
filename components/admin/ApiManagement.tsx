"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import ApiScopesFields from "@/components/admin/ApiScopesFields";
import { parseApiScopes, type ApiField } from "@/lib/api/scopes";
import { createApiIntegration, createApiKey, revokeApiKey, saveApiScopes, setApiClientStatus } from "@/app/admin/api/actions";

type ApiKey = { id: string; key_prefix: string; status: string; created_at: string; expires_at: string | null; last_used_at: string | null; request_count: number };
type ApiClient = { id: string; name: string; description: string | null; contact: string | null; status: string; scopes: string[]; created_at: string; keys: ApiKey[] };
const defaultFields: ApiField[] = ["full_name", "faculty", "department", "position", "education", "experience", "competencies", "research_areas", "publications", "projects"];
const dateLabel = (value: string | null) => value ? value.slice(0, 10) : "Nunca utilizada";

function OneTimeKey({ value, onClose }: { value: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div role="alert" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="font-bold text-amber-950">Guarde esta chave agora</h3><p className="mt-1 text-sm text-amber-900">O valor completo só é apresentado uma vez.</p></div>
        <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-amber-950 hover:bg-amber-100">Fechar</button>
      </div>
      <code className="mt-4 block overflow-x-auto rounded-xl bg-white px-4 py-3 text-sm text-primary">{value}</code>
      <button type="button" onClick={() => { void navigator.clipboard.writeText(value).then(() => setCopied(true)); }} className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100">{copied ? "Chave copiada" : "Copiar chave"}</button>
    </div>
  );
}

function NewIntegration() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const result = await createApiIntegration(data);
      if (result.success && result.apiKey) {
        setIssuedKey(result.apiKey);
        setMessage("Integração criada com sucesso.");
        form.reset();
        router.refresh();
      } else if (result.success === false) setMessage(result.error);
    });
  }

  return (
    <section className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_30px_rgba(0,17,58,0.04)] sm:p-7">
      <div className="mb-6 flex items-start gap-3"><span aria-hidden="true" className="material-symbols-outlined rounded-xl bg-primary-fixed p-3 text-primary">key</span><div><h2 className="text-xl font-bold text-primary">Nova integração</h2><p className="mt-1 text-sm text-on-surface-variant">Defina a finalidade, os perfis e os dados que este cliente poderá consultar.</p></div></div>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label><span className="mb-1.5 block text-sm font-semibold text-primary">Nome da integração</span><input name="name" required minLength={3} maxLength={100} placeholder="Ex.: Juri IA" className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
          <label><span className="mb-1.5 block text-sm font-semibold text-primary">Contacto responsável</span><input name="contact" maxLength={180} placeholder="Equipa ou endereço institucional" className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
          <label><span className="mb-1.5 block text-sm font-semibold text-primary">Validade da chave</span><select name="expires_days" defaultValue="90" className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-3 text-sm"><option value="30">30 dias</option><option value="90">90 dias</option><option value="180">180 dias</option></select></label>
          <label className="md:col-span-3"><span className="mb-1.5 block text-sm font-semibold text-primary">Finalidade</span><textarea name="description" maxLength={500} rows={2} placeholder="Quem vai consumir estes dados e para quê?" className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-3 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20" /></label>
        </div>
        <ApiScopesFields selectedTypes={["TEACHER"]} selectedFields={defaultFields} />
        <div className="flex flex-col gap-3 border-t border-outline-variant pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-xs leading-5 text-on-surface-variant">Email, telefone, data de nascimento e documentos privados não são disponibilizados. A API respeita a visibilidade configurada por cada pessoa.</p><button disabled={pending} className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-container disabled:cursor-wait disabled:opacity-60">{pending ? "A criar…" : "Criar integração e chave"}</button></div>
      </form>
      {message && <p role="status" className="mt-3 rounded-lg bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant">{message}</p>}
      {issuedKey && <OneTimeKey value={issuedKey} onClose={() => setIssuedKey(null)} />}
    </section>
  );
}

function IntegrationCard({ client }: { client: ApiClient }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const selection = parseApiScopes(client.scopes);
  const selectedTypes = selection.profileTypes.length ? selection.profileTypes : ["TEACHER" as const];
  const selectedFields = selection.fields.length ? selection.fields : defaultFields;

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => { const result = await saveApiScopes(client.id, data); setMessage(result.success ? "Permissões atualizadas." : result.success === false ? result.error : ""); if (result.success) router.refresh(); });
  }
  function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(async () => { const result = await createApiKey(client.id, data); if (result.success && result.apiKey) { setIssuedKey(result.apiKey); setMessage("Nova chave criada. As anteriores continuam válidas até serem revogadas."); router.refresh(); } else if (result.success === false) setMessage(result.error); });
  }
  function changeStatus() {
    const next = client.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    startTransition(async () => { const result = await setApiClientStatus(client.id, next); setMessage(result.success ? `Integração ${next === "ACTIVE" ? "ativada" : "suspensa"}.` : result.success === false ? result.error : ""); if (result.success) router.refresh(); });
  }
  function revoke(keyId: string) {
    startTransition(async () => { const result = await revokeApiKey(keyId); setMessage(result.success ? "Chave revogada; já não será aceite." : result.success === false ? result.error : ""); if (result.success) router.refresh(); });
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-[0_10px_30px_rgba(0,17,58,0.05)]">
      <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface-container-low px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-primary">{client.name}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${client.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{client.status === "ACTIVE" ? "Ativa" : client.status === "SUSPENDED" ? "Suspensa" : "Revogada"}</span></div><p className="mt-1 text-sm text-on-surface-variant">{client.description || "Sem descrição de finalidade."}</p><p className="mt-2 text-xs text-on-surface-variant">Criada em {dateLabel(client.created_at)}{client.contact ? ` · Contacto: ${client.contact}` : ""}</p></div>{client.status !== "REVOKED" && <button type="button" onClick={changeStatus} disabled={pending} className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-primary disabled:opacity-50">{client.status === "ACTIVE" ? "Suspender" : "Reativar"}</button>}</div>
      <form onSubmit={save} className="space-y-6 p-5 sm:p-6"><ApiScopesFields selectedTypes={selectedTypes} selectedFields={selectedFields} /><div className="flex justify-end border-t border-outline-variant pt-4"><button disabled={pending || client.status === "REVOKED"} className="rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm font-bold text-primary hover:border-primary disabled:opacity-50">Guardar permissões</button></div></form>
      <div className="border-t border-outline-variant bg-surface-container-low/60 px-5 py-5 sm:px-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h4 className="font-bold text-primary">Chaves de acesso</h4><p className="mt-1 text-xs text-on-surface-variant">A base guarda apenas o hash; o valor completo não pode ser recuperado.</p></div><form onSubmit={createKey} className="flex flex-wrap items-center gap-2"><select name="expires_days" defaultValue="90" aria-label="Validade da nova chave" className="rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm"><option value="30">30 dias</option><option value="90">90 dias</option><option value="180">180 dias</option></select><button disabled={pending || client.status !== "ACTIVE"} className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-container disabled:opacity-50">Criar nova chave</button></form></div>
        {client.keys.length ? <div className="mt-4 divide-y divide-outline-variant rounded-xl border border-outline-variant bg-white">{client.keys.map((key) => <div key={key.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><code className="text-sm font-semibold text-primary">{key.key_prefix}…</code><p className="mt-1 text-xs text-on-surface-variant">{key.status === "ACTIVE" ? "Ativa" : "Revogada"} · {key.request_count.toLocaleString("pt-PT")} pedidos · Último uso: {dateLabel(key.last_used_at)}</p><p className="text-xs text-on-surface-variant">Expira: {dateLabel(key.expires_at)}</p></div>{key.status === "ACTIVE" && <button type="button" onClick={() => revoke(key.id)} disabled={pending} className="self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50 sm:self-center">Revogar</button>}</div>)}</div> : <p className="mt-4 rounded-xl border border-dashed border-outline-variant bg-white px-4 py-5 text-sm text-on-surface-variant">Ainda não há chaves para esta integração.</p>}
        {message && <p role="status" className="mt-3 rounded-lg bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant">{message}</p>}{issuedKey && <OneTimeKey value={issuedKey} onClose={() => setIssuedKey(null)} />}
      </div>
    </article>
  );
}

export default function ApiManagement({ clients }: { clients: ApiClient[] }) {
  return <div className="space-y-8"><NewIntegration /><section className="space-y-4"><div><h2 className="text-xl font-bold text-primary">Integrações registadas</h2><p className="mt-1 text-sm text-on-surface-variant">Revise tipos de perfil, campos, validade e atividade dos clientes.</p></div>{clients.length ? clients.map((client) => <IntegrationCard key={client.id} client={client} />) : <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center text-sm text-on-surface-variant">Ainda não foram criadas integrações.</div>}</section>
    <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-outline-variant bg-white p-5 sm:p-6"><h2 className="font-bold text-primary">Endpoint</h2><p className="mt-1 text-sm text-on-surface-variant">Só aceita leitura de perfis ativos com visibilidade pública ou institucional.</p><code className="mt-4 block overflow-x-auto rounded-xl bg-primary px-4 py-3 text-sm text-white">GET /api/v1/profiles?limit=20&amp;offset=0</code><pre className="mt-3 overflow-x-auto rounded-xl bg-surface-container-low p-4 text-xs leading-6 text-on-surface-variant"><code>{`curl "$UNIKIVI_URL/api/v1/profiles?limit=20" -H "Authorization: Bearer $UNIKIVI_API_KEY"`}</code></pre></div><div className="rounded-2xl border border-secondary/40 bg-secondary/5 p-5 sm:p-6"><h2 className="font-bold text-primary">Proteção de dados</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-on-surface-variant"><li>• Chaves mostradas uma única vez e guardadas apenas como hash.</li><li>• Validade limitada, revogação individual e suspensão por cliente.</li><li>• Limite de 120 pedidos por minuto por chave.</li><li>• Email, telefone, data de nascimento e documentos privados ficam excluídos.</li><li>• Tipos e campos são verificados em cada pedido.</li></ul></div></section></div>;
}
