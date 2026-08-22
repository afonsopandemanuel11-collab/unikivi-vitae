// components/dashboard/StudentDashboard.tsx
export default function StudentDashboard({ profile }: { profile: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-6">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          O seu percurso
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Ainda nao adicionou formacao. Comece por preencher o seu percurso academico.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant p-6">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Estado do perfil
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Estado: {profile.status}
        </p>
      </div>
    </div>
  );
}