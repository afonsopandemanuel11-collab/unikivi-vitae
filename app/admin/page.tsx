import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-PT", { month: "short" }).replace(".", "");
}

const profileTypeLabels: Record<string, string> = {
  STUDENT: "Estudante",
  TEACHER: "Docente",
  RESEARCHER: "Investigador",
  PROFESSIONAL: "Profissional",
  TALENT: "Talento",
  VISITOR: "Visitante",
  ADMIN: "Administrador",
};

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return { date, start: date.toISOString(), end: end.toISOString(), label: monthLabel(date) };
  });

  const [
    { count: totalProfiles },
    { count: activeProfiles },
    { count: totalCurricula },
    { count: totalPublications },
    { count: pendingVerifications },
    { data: recentProfiles },
    ...monthlyCounts
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "ACTIVE"),
    supabase.from("curricula").select("id", { count: "exact", head: true }),
    supabase.from("publications").select("id", { count: "exact", head: true }),
    supabase.from("profile_verifications").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("profiles").select("id, full_name, profile_type, created_at").order("created_at", { ascending: false }).limit(6),
    ...months.map((month) => supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", month.start).lt("created_at", month.end)),
  ]);

  const chart = monthlyCounts.map((result, index) => ({ label: months[index].label, count: result.count ?? 0 }));
  const maxCount = Math.max(...chart.map((month) => month.count), 1);
  const stats = [
    { label: "Utilizadores", value: totalProfiles ?? 0, icon: "group", tone: "bg-primary-fixed text-primary" },
    { label: "Perfis ativos", value: activeProfiles ?? 0, icon: "verified_user", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Currículos", value: totalCurricula ?? 0, icon: "description", tone: "bg-blue-50 text-blue-700" },
    { label: "Publicações", value: totalPublications ?? 0, icon: "library_books", tone: "bg-cyan-50 text-cyan-800" },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 font-label-sm text-secondary">PAINEL INSTITUCIONAL</p><h2 className="font-headline-lg text-3xl font-bold text-primary sm:text-4xl">Olá, Administrador 👋</h2><p className="mt-2 text-on-surface-variant">Resumo da atividade e das validações da UNIKIVI Vitae.</p></div>
        <Link href="/admin/users" className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-container"><span aria-hidden="true" className="material-symbols-outlined">group</span>Gerir utilizadores</Link>
      </section>

      <section aria-label="Indicadores da plataforma" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <article key={item.label} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)]"><span aria-hidden="true" className={`material-symbols-outlined inline-flex rounded-xl p-3 ${item.tone}`}>{item.icon}</span><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-outline">{item.label}</p><p className="mt-1 text-3xl font-extrabold text-primary">{item.value.toLocaleString("pt-PT")}</p></article>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <article className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sm:p-7">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-headline-md text-lg font-bold text-primary">Crescimento de utilizadores</h3><p className="mt-1 text-sm text-on-surface-variant">Novos perfis registados nos últimos seis meses.</p></div><span className="rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant">Por mês</span></div>
          <div className="flex h-64 items-end gap-3 border-b border-l border-outline-variant px-2 pb-2 sm:gap-5 sm:px-5">
            {chart.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-bold text-primary">{month.count}</span><div className="w-full max-w-14 rounded-t-lg bg-secondary transition-all" style={{ height: `${Math.max(4, (month.count / maxCount) * 170)}px` }} /><span className="text-[11px] font-semibold capitalize text-on-surface-variant">{month.label}</span></div>)}
          </div>
        </article>

        <article className="rounded-2xl border border-outline-variant bg-white p-5 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-headline-md text-lg font-bold text-primary">Validação institucional</h3><p className="mt-1 text-sm text-on-surface-variant">Pedidos que aguardam revisão.</p></div><span className="rounded-xl bg-amber-50 p-3 text-amber-700"><span aria-hidden="true" className="material-symbols-outlined">pending_actions</span></span></div>
          <p className="mt-5 text-4xl font-extrabold text-primary">{(pendingVerifications ?? 0).toLocaleString("pt-PT")}</p>
          <Link href="/admin/moderation" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary">Abrir fila de validação<span aria-hidden="true" className="material-symbols-outlined text-base">arrow_forward</span></Link>
          <div className="mt-6 border-t border-outline-variant pt-5"><h4 className="text-sm font-bold text-primary">Registos recentes</h4>{recentProfiles?.length ? <ul className="mt-3 divide-y divide-outline-variant">{recentProfiles.map((profile) => <li key={profile.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-on-surface">{profile.full_name}</p><p className="text-xs text-on-surface-variant">{profileTypeLabels[profile.profile_type] ?? profile.profile_type}</p></div><time className="shrink-0 text-xs text-on-surface-variant" dateTime={profile.created_at}>{profile.created_at.slice(0, 10)}</time></li>)}</ul> : <p className="mt-3 text-sm text-on-surface-variant">Ainda não há registos.</p>}</div>
        </article>
      </section>
    </div>
  );
}
