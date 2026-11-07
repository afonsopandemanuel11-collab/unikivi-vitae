// components/landing/CurriculumTemplates.tsx
import Link from "next/link";

const TEMPLATES = [
  {
    value: "UNIKIVI_CLASSIC",
    name: "UNIKIVI Classic",
    description: "ATS Friendly, 1 coluna, layout sóbrio e direto.",
    badge: "ATS",
    badgeColor: "bg-emerald-100 text-emerald-800",
    preview: "classic",
  },
  {
    value: "EXECUTIVE",
    name: "UNIKIVI Professional",
    description: "Corporativo, hierarquia visual forte, 2 colunas.",
    badge: "PRO",
    badgeColor: "bg-blue-100 text-blue-800",
    preview: "professional",
  },
  {
    value: "CIENCIA_VITAE",
    name: "UNIKIVI Academic",
    description: "Formal, focado em extensa lista de publicações.",
    badge: "ACADÉMICO",
    badgeColor: "bg-violet-100 text-violet-800",
    preview: "academic",
  },
  {
    value: "MODERN_EDITORIAL",
    name: "UNIKIVI Modern",
    description: "Criativo, barra lateral colorida, ideal tech.",
    badge: "MODERNO",
    badgeColor: "bg-orange-100 text-orange-800",
    preview: "modern",
  },
  {
    value: "ACADEMIC_COMPACT",
    name: "UNIKIVI Compact",
    description: "Denso e conciso, ideal para currículos de uma página.",
    badge: "1 PÁGINA",
    badgeColor: "bg-slate-100 text-slate-700",
    preview: "compact",
  },
];

function TemplatePreview({ type }: { type: string }) {
  if (type === "classic") {
    return (
      <svg viewBox="0 0 280 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="180" fill="#f8f9fa" />
        <rect x="20" y="16" width="240" height="40" rx="4" fill="#00113a" />
        <circle cx="44" cy="36" r="12" fill="#ffffff33" />
        <rect x="62" y="26" width="80" height="7" rx="2" fill="#ffffff" />
        <rect x="62" y="37" width="50" height="4" rx="2" fill="#ffffff80" />
        <rect x="20" y="62" width="240" height="1" fill="#e0e3e8" />
        <rect x="20" y="72" width="60" height="5" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="82" width="240" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="89" width="200" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="96" width="220" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="109" width="60" height="5" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="119" width="240" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="126" width="180" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="140" width="60" height="5" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="150" width="90" height="8" rx="4" fill="#006970" opacity="0.3" />
        <rect x="116" y="150" width="70" height="8" rx="4" fill="#006970" opacity="0.3" />
      </svg>
    );
  }
  if (type === "professional") {
    return (
      <svg viewBox="0 0 280 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="180" fill="#f8f9fa" />
        <rect x="0" y="0" width="90" height="180" fill="#00113a" />
        <circle cx="45" cy="32" r="18" fill="#ffffff20" />
        <rect x="20" y="56" width="50" height="5" rx="2" fill="#ffffff" />
        <rect x="25" y="65" width="40" height="3" rx="1.5" fill="#ffffff60" />
        <rect x="10" y="80" width="70" height="1" fill="#ffffff20" />
        <rect x="10" y="90" width="30" height="4" rx="2" fill="#006970" opacity="0.9" />
        <rect x="10" y="99" width="70" height="3" rx="1.5" fill="#ffffff40" />
        <rect x="10" y="106" width="60" height="3" rx="1.5" fill="#ffffff40" />
        <rect x="10" y="118" width="30" height="4" rx="2" fill="#006970" opacity="0.9" />
        <rect x="10" y="127" width="70" height="8" rx="4" fill="#ffffff20" />
        <rect x="10" y="140" width="70" height="8" rx="4" fill="#ffffff20" />
        <rect x="106" y="16" width="80" height="7" rx="2" fill="#00113a" />
        <rect x="106" y="28" width="60" height="4" rx="2" fill="#c5c6d2" />
        <rect x="106" y="44" width="40" height="5" rx="2" fill="#00113a" opacity="0.6" />
        <rect x="106" y="54" width="164" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="106" y="61" width="140" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="106" y="75" width="40" height="5" rx="2" fill="#00113a" opacity="0.6" />
        <rect x="106" y="85" width="164" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="106" y="92" width="130" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="106" y="106" width="40" height="5" rx="2" fill="#00113a" opacity="0.6" />
        <rect x="106" y="116" width="164" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="106" y="123" width="150" height="3" rx="1.5" fill="#c5c6d2" />
      </svg>
    );
  }
  if (type === "academic") {
    return (
      <svg viewBox="0 0 280 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="180" fill="#f8f9fa" />
        <rect x="20" y="12" width="160" height="10" rx="2" fill="#00113a" />
        <rect x="20" y="26" width="100" height="5" rx="2" fill="#006970" />
        <rect x="20" y="44" width="240" height="2" fill="#00113a" />
        <rect x="20" y="52" width="110" height="4" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="61" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="68" width="90" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="78" width="110" height="4" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="87" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="94" width="100" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="104" width="110" height="4" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="20" y="113" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="52" width="110" height="4" rx="2" fill="#00113a" opacity="0.7" />
        <rect x="150" y="62" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="69" width="80" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="84" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="91" width="80" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="106" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="113" width="80" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="128" width="110" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="150" y="135" width="80" height="3" rx="1.5" fill="#c5c6d2" />
      </svg>
    );
  }
  if (type === "modern") {
    return (
      <svg viewBox="0 0 280 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="280" height="180" fill="#f0f4ff" />
        <rect x="0" y="0" width="280" height="8" fill="#00113a" />
        <rect x="0" y="8" width="6" height="172" fill="#006970" />
        <rect x="20" y="18" width="120" height="10" rx="2" fill="#00113a" />
        <rect x="20" y="32" width="80" height="5" rx="2" fill="#006970" />
        <circle cx="244" cy="30" r="20" fill="#00113a" opacity="0.1" />
        <circle cx="244" cy="30" r="14" fill="#00113a" opacity="0.15" />
        <rect x="20" y="52" width="50" height="5" rx="2" fill="#006970" />
        <rect x="20" y="62" width="230" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="69" width="200" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="82" width="50" height="5" rx="2" fill="#006970" />
        <rect x="20" y="92" width="230" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="99" width="180" height="3" rx="1.5" fill="#c5c6d2" />
        <rect x="20" y="115" width="50" height="10" rx="5" fill="#00113a" />
        <rect x="76" y="115" width="50" height="10" rx="5" fill="#006970" opacity="0.5" />
        <rect x="132" y="115" width="50" height="10" rx="5" fill="#c5c6d2" />
        <rect x="20" y="135" width="230" height="3" rx="1.5" fill="#e0e3e8" />
        <rect x="20" y="135" width="170" height="3" rx="1.5" fill="#006970" opacity="0.6" />
        <rect x="20" y="145" width="230" height="3" rx="1.5" fill="#e0e3e8" />
        <rect x="20" y="145" width="130" height="3" rx="1.5" fill="#00113a" opacity="0.4" />
        <rect x="20" y="155" width="230" height="3" rx="1.5" fill="#e0e3e8" />
        <rect x="20" y="155" width="200" height="3" rx="1.5" fill="#006970" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="180" fill="#f8f9fa" />
      <rect x="20" y="12" width="140" height="8" rx="2" fill="#00113a" />
      <rect x="20" y="24" width="90" height="4" rx="2" fill="#006970" />
      <rect x="20" y="38" width="240" height="1" fill="#c5c6d2" />
      <rect x="20" y="46" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="20" y="55" width="76" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="61" width="66" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="106" y="46" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="106" y="55" width="76" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="106" y="61" width="66" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="192" y="46" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="192" y="55" width="68" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="192" y="61" width="58" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="77" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="20" y="86" width="76" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="92" width="60" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="106" y="77" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="106" y="86" width="76" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="106" y="92" width="60" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="192" y="77" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="192" y="86" width="68" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="192" y="92" width="50" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="104" width="240" height="1" fill="#c5c6d2" />
      <rect x="20" y="112" width="50" height="4" rx="2" fill="#00113a" opacity="0.7" />
      <rect x="20" y="121" width="240" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="127" width="200" height="2.5" rx="1.25" fill="#c5c6d2" />
      <rect x="20" y="140" width="240" height="1" fill="#c5c6d2" />
      <rect x="20" y="150" width="80" height="8" rx="4" fill="#006970" opacity="0.2" />
      <rect x="106" y="150" width="80" height="8" rx="4" fill="#00113a" opacity="0.1" />
    </svg>
  );
}

export default function CurriculumTemplates() {
  return (
    <section className="py-section-gap bg-surface-container-lowest overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="font-headline-lg text-primary mb-4 text-3xl md:text-4xl">Modelos de Currículo</h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            Exporte o seu perfil para diferentes formatos adaptados a cada contexto, desde o ambiente
            académico ao setor empresarial.
          </p>
        </div>
        <Link
          href="/registo"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Criar o meu currículo
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto">
        {TEMPLATES.map((t) => (
          <div
            key={t.value}
            className="min-w-[260px] md:min-w-[300px] snap-start shrink-0 bg-white rounded-2xl border border-outline-variant hover:border-primary shadow-sm hover:shadow-lg transition-all group cursor-pointer hover:-translate-y-1 overflow-hidden"
          >
            <div className="h-44 bg-surface-container-low overflow-hidden border-b border-outline-variant">
              <TemplatePreview type={t.preview} />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline-md text-base font-bold text-primary">{t.name}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">{t.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
