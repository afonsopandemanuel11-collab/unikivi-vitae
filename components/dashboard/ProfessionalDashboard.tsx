// components/dashboard/ProfessionalDashboard.tsx
// PLACEHOLDER — será substituído pelo design fiel do Google Stitch.

export default function ProfessionalDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      {/* Linha 1 — métricas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Experiências", icon: "work", value: "0" },
          { label: "Competências", icon: "psychology", value: "0" },
          { label: "Certificações", icon: "verified", value: "0" },
          { label: "Prémios", icon: "workspace_premium", value: "0" },
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

      {/* Linha 2 — experiência + competências */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-md text-headline-md text-primary mb-1">
            Experiência profissional
          </h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Histórico de cargos, empresas e responsabilidades
          </p>
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">
              work
            </span>
            <p className="text-sm text-on-surface-variant">
              Nenhuma experiência profissional adicionada.
            </p>
            <button className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Adicionar experiência
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-outline-variant p-6">
            <h2 className="font-headline-md text-headline-md text-primary mb-3">
              Competências-chave
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
