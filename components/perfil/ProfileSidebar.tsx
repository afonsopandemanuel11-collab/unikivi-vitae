type ProfileSidebarProps = {
  profile: {
    full_name: string;
    professional_name: string | null;
    bio: string | null;
    photo_url: string | null;
    faculty: { name: string } | null;
    department: { name: string } | null;
    position: { name: string } | null;
    profile_identifiers: { identifier_type: string; identifier_value: string; url: string | null }[];
  };
};

const IDENTIFIER_ICONS: Record<string, string> = {
  ORCID: "qr_code",
  SCOPUS: "article",
  CIENCIA_ID: "fingerprint",
};

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const displayName = profile.professional_name || profile.full_name;

  return (
    <aside className="lg:col-span-4 relative">
      <div className="sticky top-24 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0_10px_20px_-5px_rgba(0,17,58,0.04)] overflow-hidden">
        <div className="w-full aspect-square relative">
          <img
            src={profile.photo_url || "/images/avatar-placeholder.png"}
            alt={displayName}
            className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            {profile.position && (
              <span className="inline-block bg-primary text-on-primary font-label-sm px-2 py-1 rounded-sm mb-2 shadow-sm">
                {profile.position.name}
              </span>
            )}
            <h1 className="font-headline-md text-on-primary text-2xl leading-tight">{displayName}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined filled-icon text-primary mt-1 shrink-0">location_on</span>
            <div>
              <p className="font-body-md font-medium text-on-surface">Universidade Kimpa Vita</p>
              {profile.faculty && (
                <p className="font-body-md text-sm">
                  {profile.faculty.name}
                  {profile.department ? `, ${profile.department.name}` : ""}
                </p>
              )}
              <p className="font-label-sm mt-1">Uíge, Angola</p>
            </div>
          </div>

          {profile.bio && (
            <>
              <hr className="border-outline-variant my-4" />
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-6">{profile.bio}</p>
            </>
          )}

          {profile.profile_identifiers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2">
                Identificadores Científicos
              </h3>
              {profile.profile_identifiers.map((idf) => (
                
                <a  key={idf.identifier_type}
                  href={idf.url ?? "#"}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-sm">
                        {IDENTIFIER_ICONS[idf.identifier_type] ?? "badge"}
                      </span>
                    </div>
                    <span className="font-body-md text-sm font-medium text-on-surface">{idf.identifier_type}</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    {idf.identifier_value}
                  </span>
                </a>
              ))}
            </div>
          )}

          <button className="mt-8 w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-body-md font-medium py-3 rounded-lg shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all">
            <span className="material-symbols-outlined text-secondary-fixed animate-pulse">auto_awesome</span>
            <span>Perguntar à IA sobre {displayName.split(" ")[0]}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}