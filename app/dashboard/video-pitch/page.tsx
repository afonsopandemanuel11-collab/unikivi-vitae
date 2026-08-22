import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import VideoPitchForm from "@/components/VideoPitch/VideoPitchForm";

export default async function VideoPitchPage() {
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
      <h1 className="font-headline-lg text-headline-lg text-primary mb-3">
        Video Pitch
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-2xl">
        Apresente a sua pesquisa e trajetoria academica de forma dinamica. Um
        bom video pitch aumenta significativamente as chances de colaboracao
        institucional.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPitchForm
            userId={userData.user.id}
            currentUrl={profile.video_pitch_url}
            currentTitle={profile.video_pitch_title}
            currentVisibility={profile.video_pitch_visibility}
          />
        </div>

        <div className="bg-secondary-container/10 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-secondary">✨</span>
            <h2 className="font-headline-md text-headline-md text-primary text-lg">
              Dicas da IA para um Pitch Eficaz
            </h2>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-primary mb-1">Seja Conciso</p>
              <p className="text-on-surface-variant">
                O tempo ideal de engajamento e entre 60 e 90 segundos. Va
                direto ao ponto de impacto da sua pesquisa.
              </p>
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Estrutura Clara</p>
              <p className="text-on-surface-variant">
                Comece com o problema, apresente a sua solucao (pesquisa) e
                finalize com o convite a colaboracao.
              </p>
            </div>
            <div>
              <p className="font-bold text-primary mb-1">Qualidade de Audio</p>
              <p className="text-on-surface-variant">
                Grave num ambiente silencioso. O audio claro e frequentemente
                mais importante que a resolucao do video.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}