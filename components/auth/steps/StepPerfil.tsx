// components/auth/steps/StepPerfil.tsx
"use client";

export type ProfileType =
  | "TEACHER"
  | "RESEARCHER"
  | "STUDENT"
  | "PROFESSIONAL"
  | "TALENT";

const OPTIONS: {
  value: ProfileType;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    value: "TEACHER",
    icon: "school",
    title: "Docente",
    description: "Professores e corpo docente universitário",
  },
  {
    value: "RESEARCHER",
    icon: "biotech",
    title: "Investigador",
    description: "Cientistas e investigadores independentes",
  },
  {
    value: "STUDENT",
    icon: "history_edu",
    title: "Estudante",
    description: "Alunos de graduação e pós-graduação",
  },
  {
    value: "PROFESSIONAL",
    icon: "work",
    title: "Profissional",
    description: "Ex-alunos e especialistas do setor",
  },
  {
    value: "TALENT",
    icon: "star",
    title: "Talento",
    description: "Novos talentos à procura de oportunidades",
  },
];

export default function StepPerfil({
  value,
  onChange,
  onNext,
}: {
  value: ProfileType;
  onChange: (v: ProfileType) => void;
  onNext: () => void;
}) {
  const selected = OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="flex-1">
      <header className="mb-8">
        <h2 className="font-headline-md text-headline-md text-on-background mb-2">
          Selecione o seu perfil
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Escolha a categoria que melhor descreve a sua atividade
          institucional.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {OPTIONS.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors text-left ${
                isActive
                  ? "border-primary bg-primary-fixed-dim/10"
                  : "border-outline-variant hover:border-primary hover:bg-primary-fixed-dim/10"
              }`}
            >
              <span className="material-symbols-outlined text-primary p-2 bg-surface-container-high rounded-lg">
                {opt.icon}
              </span>
              <div>
                <div className="font-bold text-on-background flex items-center gap-2">
                  {opt.title}
                  {isActive && (
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                  )}
                </div>
                <div className="text-label-sm text-on-surface-variant">
                  {opt.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
        <a href="/" className="text-label-sm text-on-surface-variant hover:text-primary">
          Cancelar
        </a>
        <button
          type="button"
          onClick={onNext}
          className="bg-primary text-on-primary font-label-sm text-label-sm py-3 px-10 rounded flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
        >
          Continuar como {selected.title}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}