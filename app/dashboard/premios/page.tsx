import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import AwardsForm from "@/components/premios/AwardsForm";
import CertificationsForm from "@/components/premios/CertificationsForm";

export default async function PremiosPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: awards } = await supabase
    .from("awards")
    .select("*")
    .eq("profile_id", profile.id)
    .order("year", { ascending: false });

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("profile_id", profile.id)
    .order("issue_date", { ascending: false });

  return (
    <DashboardShell profile={profile}>
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
        Edicao de Perfil - Fase 6
      </span>
      <h1 className="font-headline-lg text-headline-lg text-primary mt-2 mb-3">
        Premios e Certificacoes
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
        Destaque os seus reconhecimentos academicos e profissionais. Estas
        informacoes fortalecem a credibilidade do seu perfil no ecossistema
        UNIKIVI.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-md text-headline-md text-primary mb-4 text-lg">
            Boas Praticas
          </h2>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li>
              Inclua apenas premios relevantes para a sua area de
              investigacao ou atuacao academica.
            </li>
            <li>
              Sempre que possivel, forneca o link (URL) para verificar a
              credencial online.
            </li>
            <li>
              Certificacoes expiradas podem ser omitidas, a menos que tenham
              relevancia historica significativa.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <AwardsForm profileId={profile.id} awards={awards ?? []} />
          <CertificationsForm profileId={profile.id} certifications={certifications ?? []} />
        </div>
      </div>
    </DashboardShell>
  );
}