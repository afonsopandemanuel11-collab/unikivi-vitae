// components/dashboard/ProfileHeader.tsx
export default function ProfileHeader({
  fullName,
  isVerified,
}: {
  fullName: string;
  isVerified: boolean;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-3">
          Ola, {fullName}
        </h1>
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-label-sm border ${
            isVerified
              ? "bg-secondary-container/20 text-secondary border-secondary/20"
              : "bg-surface-container text-on-surface-variant border-outline-variant"
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isVerified ? "check_circle" : "cancel"}
          </span>
          {isVerified ? "Verificado" : "Nao verificado"}
        </span>
      </div>

      <a
        href="/dashboard/perfil"
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary-container transition-colors"
      >
        Editar Perfil
      </a>
    </div>
  );
}