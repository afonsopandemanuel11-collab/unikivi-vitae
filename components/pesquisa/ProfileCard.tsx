import Link from "next/link";

type ProfileCardProps = {
  profile: {
    id: string;
    full_name: string;
    professional_name?: string | null;
    photo_url?: string | null;
    position?: { name: string } | { name: string }[] | null;
    faculty?: { name: string } | { name: string }[] | null;
    profile_research_areas?:
      | {
          research_areas?: { name: string } | { name: string }[] | null;
        }[]
      | null;
  };
};

export default function ProfileCard({ profile }: ProfileCardProps) {
  const displayName = profile.professional_name || profile.full_name;
  const position = Array.isArray(profile.position)
    ? profile.position[0] ?? null
    : profile.position ?? null;
  const faculty = Array.isArray(profile.faculty)
    ? profile.faculty[0] ?? null
    : profile.faculty ?? null;

  const areas = (profile.profile_research_areas ?? [])
    .map((pra) => {
      if (Array.isArray(pra.research_areas)) {
        return pra.research_areas[0]?.name;
      }
      return pra.research_areas?.name;
    })
    .filter(Boolean)
    .slice(0, 2);

  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-[0_10px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <img
            src={profile.photo_url || "/images/avatar-placeholder.png"}
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover border border-outline-variant shadow-sm"
          />
          <div>
            <h3 className="font-headline-md text-primary leading-tight group-hover:text-surface-tint transition-colors text-lg">
              {displayName}
            </h3>
            {position && (
              <p className="font-body-md text-on-surface-variant mt-1">{position.name}</p>
            )}
            {faculty && (
              <div className="flex items-center gap-1 text-on-surface-variant/80 mt-1">
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span className="text-sm">{faculty.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {areas.map((areaName) => (
            <span
              key={areaName}
              className="bg-surface-container-low text-primary px-3 py-1 rounded-full font-label-sm border border-outline-variant/20"
            >
              {areaName}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={`/perfil/${profile.id}`}
        className="w-full text-center border border-primary text-primary hover:bg-primary hover:text-on-primary py-2 rounded-lg font-label-sm transition-colors uppercase tracking-wider"
      >
        Ver Perfil
      </Link>
    </article>
  );
}