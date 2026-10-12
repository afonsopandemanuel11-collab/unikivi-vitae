import { createAdminClient } from "@/lib/supabase/admin";

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-PT", { month: "short" });
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: totalProfiles },
    { count: activeProfiles },
    { count: totalCurricula },
    { count: totalPublications },
    { data: recentProfiles },
    { data: pendingVerifications },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "ACTIVE"),
    supabase.from("curricula").select("*", { count: "exact", head: true }),
    supabase.from("publications").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("created_at").order("created_at", { ascending: false }).limit(500),
    supabase
      .from("profile_verifications")
      .select("id, title, description, profiles(full_name)")
      .eq("verification_status", "PENDING")
      .limit(5),
  ]);

  // Agrupar perfis criados por mês (últimos 6 meses) para o gráfico simplificado
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { label: monthLabel(d), year: d.getFullYear(), month: d.getMonth(), count: 0 };
  });
  (recentProfiles ?? []).forEach((p) => {
    const d = new Date(p.created_at);
    const bucket = months.find((m) => m.year === d.getFullYear() && m.month === d.getMonth());
    if (bucket) bucket.count += 1;
  });
  const maxCount = Math.max(...months.map((m) => m.count), 1);

  const stats = [
    { label: "Utilizadores", value: totalProfiles ?? 0, icon: "group" },
    { label: "Perfis Ativos", value: activeProfiles ?? 0, icon: "badge" },
    { label: "Currículos Criados", value: totalCurricula ?? 0, icon: "description" },
    { label: "Publicações", value: totalPublications ?? 0, icon: "library_books" },
  ];

  return (
    <div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-3xl text-primary mb-2">Olá, Administrador 👋</h2>
        <p className="font-body-lg text-on-surface-variant">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
            <div className="p-3 bg-primary-fixed rounded-lg w-fit mb-4">
              <span className="material-symbols-outlined text-primary">{s.icon}</span>
            </div>
            <p className="font-label-sm text-outline uppercase tracking-wider mb-1">{s.label}</p>
            <h3 className="font-display-xl text-3xl text-primary">{s.value.toLocaleString("pt-PT")}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
          <h3 className="font-headline-md text-lg text-primary mb-6">Novos Perfis (últimos 6 meses)</h3>
          <div className="flex items-end gap-4 h-[220px]">
            {months.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-secondary-container rounded-t-lg transition-all"
                  style={{ height: `${(m.count / maxCount) * 180 || 2}px` }}
                />
                <span className="font-label-sm text-on-surface-variant">{m.label}</span>
                <span className="font-label-sm text-primary font-bold">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant shadow-[0_10px_20px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-error-container rounded-full opacity-50 blur-3xl" />
            <h3 className="font-headline-md text-lg text-primary mb-4 relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">gavel</span>
              Conteúdos Pendentes
            </h3>
            {pendingVerifications && pendingVerifications.length > 0 ? (
              <div className="space-y-3 relative z-10">
                {pendingVerifications.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-surface-variant">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-outline">person_add</span>
                      <div>
                        <p className="font-body-md font-medium text-sm">{v.title}</p>
                        <p className="font-label-sm text-outline">{v.profiles?.full_name}</p>
                      </div>
                    </div>
                    <a href={`/admin/moderation`} className="px-3 py-1 bg-primary text-on-primary rounded-full font-label-sm">
                      Rever
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-md text-sm text-on-surface-variant relative z-10">Sem pendências.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}