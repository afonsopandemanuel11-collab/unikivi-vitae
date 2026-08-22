// components/dashboard/TalentDashboard.tsx
// PLACEHOLDER — será substituído pelo design fiel do Google Stitch.

export default function TalentDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      {/* Linha 1 — métricas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Competências", icon: "psychology", value: "0" },
          { label: "Projectos", icon: "rocket_launch", value: "0" },
          { label: "Prémios", icon: "workspace_premium", value: "0" },
          { label: "Visualizações do perfil", icon: "visibility", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-outline-variant p-5 flex flex-col gap-2"
          >
            <span className="material-symbols-outlined text-primary text-2xl">
              {stat.icon}
            </span>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Linha 2 — video pitch + competências */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-md text-headline-md text-primary mb-1">
            Video Pitch
          </h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Apresenta-te em 60 segundos — é o teu cartão de visita digital
          </p>
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">
              videocam
            </span>
            <p className="text-sm text-on-surface-variant">
              Ainda não adicionaste um video pitch.
            </p>
            <button className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Adicionar video pitch
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              Competências em destaque
            </h2>
            <p className="text-sm text-on-surface-variant">
              Nenhuma competência adicionada ainda.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              Estado do perfil
            </h2>
            <p className="text-sm text-on-surface-variant">
              Estado:{" "}
              <span className="font-semibold text-primary">{profile.status}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
