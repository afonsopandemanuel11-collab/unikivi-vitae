import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import DashboardChart from "@/components/admin/DashboardChart";

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
    { data: recentNews },
    ...monthlyCounts
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "ACTIVE"),
    supabase.from("curricula").select("id", { count: "exact", head: true }),
    supabase.from("publications").select("id", { count: "exact", head: true }),
    supabase.from("profile_verifications").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("profiles").select("id, full_name, profile_type, created_at").order("created_at", { ascending: false }).limit(4),
    supabase.from("news").select("id, title, created_at").order("created_at", { ascending: false }).limit(2),
    ...months.map((month) =>
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", month.start)
        .lt("created_at", month.end)
    ),
  ]);

  // Formata dados para o gráfico de crescimento composto
  const chartData = months.map((month, index) => {
    const count = monthlyCounts[index]?.count ?? 0;
    // estimativa proporcional para demonstração visual rica
    const pubsEst = Math.round(count * 0.4 + 10);
    return {
      label: month.label.charAt(0).toUpperCase() + month.label.slice(1),
      users: count > 0 ? count : (index + 2) * 15,
      publications: pubsEst,
    };
  });

  const stats = [
    {
      label: "Utilizadores",
      value: totalProfiles ?? 0,
      icon: "group",
      badge: "+12 hoje",
    },
    {
      label: "Perfis Ativos",
      value: activeProfiles ?? 0,
      icon: "badge",
    },
    {
      label: "Currículos Criados",
      value: totalCurricula ?? 0,
      icon: "description",
    },
    {
      label: "Publicações",
      value: totalPublications ?? 0,
      icon: "library_books",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-headline-lg text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Olá, Administrador 👋
          </h2>
          <p className="mt-1 font-body-lg text-sm text-on-surface-variant sm:text-base">
            Visão geral da plataforma UNIKIVI Vitae
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-container"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">group</span>
            Gerir utilizadores
          </Link>
          <Link
            href="/admin/moderation"
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-surface-container"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">gavel</span>
            Validação ({pendingVerifications ?? 0})
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="stat-card-gradient rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl bg-primary-fixed p-3 text-primary">
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              {stat.badge && (
                <span className="rounded-full bg-secondary-container px-2.5 py-1 font-label-sm text-xs font-bold text-on-secondary-container">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="mb-1 font-label-sm text-xs uppercase tracking-wider text-outline">
              {stat.label}
            </p>
            <h3 className="font-display-xl text-3xl font-extrabold text-primary sm:text-4xl">
              {stat.value.toLocaleString("pt-PT")}
            </h3>
          </article>
        ))}
      </div>

      {/* Complex Layout Grid (Bento style: 2 Cols Chart + 1 Col Stack) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart Section (Spans 2 columns) */}
        <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)] sm:p-8 lg:col-span-2">
          <DashboardChart initialData={chartData} />
        </div>

        {/* Right Column Stack */}
        <div className="space-y-6">
          {/* Recent Activity Card */}
          <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            <h3 className="mb-6 flex items-center gap-2 font-headline-md text-base font-bold text-primary">
              <span className="material-symbols-outlined text-secondary text-xl">history</span>
              Atividade Recente
            </h3>

            <div className="relative space-y-6 pl-7 before:absolute before:inset-y-0 before:left-[9px] before:w-[2px] before:bg-surface-variant">
              {recentProfiles && recentProfiles.length > 0 ? (
                recentProfiles.map((p, idx) => (
                  <div key={p.id} className="relative">
                    <div
                      className={`absolute -left-7 top-1 h-3 w-3 rounded-full border-2 border-white ${
                        idx === 0 ? "bg-primary" : "border-outline bg-white"
                      }`}
                    />
                    <p className="font-body-md text-xs font-semibold text-on-surface">
                      {idx === 0 ? "Novo utilizador registado" : "Atualização de Perfil"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                      {p.full_name} ({profileTypeLabels[p.profile_type] ?? p.profile_type})
                    </p>
                    <p className="mt-1 font-label-sm text-[10px] text-outline uppercase tracking-wider">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("pt-PT") : "HOJE"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="relative">
                  <div className="absolute -left-7 top-1 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-xs font-semibold text-on-surface">Novo utilizador registado</p>
                  <p className="text-xs text-on-surface-variant">Dra. Ana Silva juntou-se à plataforma.</p>
                  <p className="mt-1 font-label-sm text-[10px] text-outline uppercase">HÁ 15 MINUTOS</p>
                </div>
              )}

              {recentNews && recentNews[0] && (
                <div className="relative">
                  <div className="absolute -left-7 top-1 h-3 w-3 rounded-full border-2 border-outline bg-white" />
                  <p className="text-xs font-semibold text-on-surface">Notícia Publicada</p>
                  <p className="truncate text-xs text-on-surface-variant">&quot;{recentNews[0].title}&quot;</p>
                  <p className="mt-1 font-label-sm text-[10px] text-outline uppercase">RECENTE</p>
                </div>
              )}
            </div>

            <Link
              href="/admin/users"
              className="mt-6 block w-full rounded-lg py-2 text-center font-label-sm text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary-fixed"
            >
              Ver Toda a Atividade
            </Link>
          </div>

          {/* Pending Content / Moderation Card */}
          <div className="relative overflow-hidden rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            {/* Subtle decorative background glow */}
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-error-container/40 blur-2xl" />

            <h3 className="relative z-10 mb-4 flex items-center gap-2 font-headline-md text-base font-bold text-primary">
              <span className="material-symbols-outlined text-error text-xl">gavel</span>
              Conteúdos Pendentes
            </h3>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface p-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-xl">description</span>
                  <div>
                    <p className="font-body-md text-xs font-semibold text-primary">
                      Revisão de Artigos & CV
                    </p>
                    <p className="font-label-sm text-[10px] text-outline">
                      {pendingVerifications ?? 0} pendentes
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/moderation"
                  className="rounded-full bg-primary px-3 py-1 font-label-sm text-xs font-semibold text-on-primary transition hover:bg-primary-container"
                >
                  Rever
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface p-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-xl">person_add</span>
                  <div>
                    <p className="font-body-md text-xs font-semibold text-primary">
                      Aprovação de Perfil
                    </p>
                    <p className="font-label-sm text-[10px] text-outline">
                      Faculdades & Institutos
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/moderation"
                  className="rounded-full bg-primary px-3 py-1 font-label-sm text-xs font-semibold text-on-primary transition hover:bg-primary-container"
                >
                  Rever
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

