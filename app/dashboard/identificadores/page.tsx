import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import IdentifiersManager from "@/components/IdentifiersManager/IdentifiersManager";

export default async function IdentificadoresPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  const { data: identifiers } = await supabase
    .from("profile_identifiers")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at");

  return (
    <DashboardShell profile={profile}>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="max-w-2xl">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-3">
            Identificadores Academicos
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Faca a gestao dos seus perfis de investigacao e redes
            profissionais. Ligar estes identificadores permite que o
            UNIKIVI Vitae organize as suas publicacoes, metricas de
            impacto e afiliacoes.
          </p>
        </div>
      </div>

      <IdentifiersManager profileId={profile.id} identifiers={identifiers ?? []} />
    </DashboardShell>
  );
}