// app/login/page.tsx
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6 md:p-margin-desktop">
      <main className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-xl border border-outline-variant shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Lado da imagem — só desktop */}
        <div className="relative hidden md:block md:w-1/2 overflow-hidden bg-ink-black">
          <img
            src="/images/auth/lo.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
            <h2 className="font-headline-md text-headline-md mb-2">
              Investigacao e Impacto Academico
            </h2>
            <p className="font-body-md text-body-md text-white/80">
              Portal dedicado ao avanco da ciencia e conhecimento na
              Universidade Kimpa Vita.
            </p>
          </div>
        </div>

        {/* Lado do formulario */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[380px] flex flex-col gap-8">
            <div className="text-center flex flex-col gap-2">
              <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
                UNIKIVI Vitae
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Portal de Investigacao e Impacto Academico
              </p>
            </div>

            <LoginForm />

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="flex-shrink-0 mx-4 font-label-sm text-label-sm text-outline uppercase tracking-widest">
                ou
              </span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            <div className="text-center">
              <Link
                href="/registo"
                className="inline-flex items-center justify-center gap-2 font-body-md text-body-md text-primary hover:text-primary-container font-semibold transition-colors group"
              >
                <span>Primeiro acesso / Criar perfil</span>
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>

            <p className="text-center font-label-sm text-label-sm text-on-surface-variant">
              (c) 2026 Universidade Kimpa Vita.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}