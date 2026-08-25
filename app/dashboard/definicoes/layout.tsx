import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SettingsNav from "@/components/settings/SettingsNav";

export default async function DefinicoesLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!profile) redirect("/completar-perfil");

  return (
    <DashboardShell profile={profile}>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
        Central de Configuracoes
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8">
        Gerencie a sua conta, perfil publico, privacidade e preferencias.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <SettingsNav />
        <div className="md:col-span-3">{children}</div>
      </div>
    </DashboardShell>
  );
}