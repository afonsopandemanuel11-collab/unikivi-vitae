// components/auth/RegisterWizard.tsx
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StepPerfil, { ProfileType } from "./steps/StepPerfil";
import StepDados, { DadosState } from "./steps/StepDados";
import StepAcesso from "./steps/StepAcesso";

// ---------------------------------------------------------------------------
// Helper: log de erros Supabase sempre legível
// O cliente JS serializa os erros como Proxy/object; fazer console.log(err)
// pode mostrar "{}" dependendo do browser. Esta função extrai os campos reais.
// ---------------------------------------------------------------------------
function logSupabaseError(context: string, err: unknown) {
  if (!err) return;
  // PostgrestError tem estas propriedades definidas explicitamente:
  const e = err as Record<string, unknown>;
  console.error(
    `[Supabase] ${context} →`,
    JSON.stringify({
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
    })
  );
}

const STEPS = ["Perfil", "Dados", "Acesso"] as const;

const NEEDS_ACADEMIC_UNIT: ProfileType[] = ["STUDENT", "TEACHER", "RESEARCHER"];
const NEEDS_POSITION: ProfileType[] = ["TEACHER"];

export default function RegisterWizard() {
  const router = useRouter();

  // qual passo do wizard está ativo (0, 1, 2)
  const [step, setStep] = useState(0);

  // dados recolhidos ao longo dos 3 passos
  const [profileType, setProfileType] = useState<ProfileType>("TEACHER");
  const [dados, setDados] = useState<DadosState>({
    fullName: "",
    birthDate: "",
    gender: "",
    nationality: "",
    idNumber: "",
    institutionalEmail: "",
    facultyId: "",
    departmentId: "",
    positionId: "",
    photoFile: null,
  });

  // estado da submissão final
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isSubmitting = useRef(false); // trava síncrona contra duplo clique

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function finish(email: string, password: string) {
    if (isSubmitting.current) return; // já está a processar, ignora clique extra
    isSubmitting.current = true;

    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. cria o utilizador de autenticação
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Não foi possível criar a conta.");
      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    // GUARDA DE SESSÃO — se o Supabase tiver "Email Confirmations" activo,
    // data.session é null após signUp e o client fica sem JWT.
    // Sem JWT, qualquer write com RLS (auth.uid() = user_id) falha com "{}"
    // porque o utilizador é tratado como anónimo.
    // Para resolver: vai ao painel Supabase → Authentication → Providers →
    // Email → desactiva "Confirm email" (em desenvolvimento).
    if (!data.session) {
      setError(
        "Conta criada! Confirma o teu e-mail antes de entrar — " +
          "ou desactiva a confirmação de e-mail no painel Supabase (Authentication → Email)."
      );
      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    // 2. upload da foto — só agora, porque só agora existe auth.uid()
    let photoUrl: string | null = null;

    if (dados.photoFile) {
      const ext = dados.photoFile.name.split(".").pop();
      const path = `${data.user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, dados.photoFile, { upsert: true });

      if (uploadError) {
        logSupabaseError("storage upload", uploadError);
        setError("Conta criada, mas houve um erro ao carregar a foto.");
        setLoading(false);
        isSubmitting.current = false;
        return;
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    const showAcademicUnit = NEEDS_ACADEMIC_UNIT.includes(profileType);
    const showPosition = NEEDS_POSITION.includes(profileType);

    // 3. cria/atualiza o perfil de negócio — upsert para tolerar retries sem duplicar
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        user_id: data.user.id,
        full_name: dados.fullName,
        profile_type: profileType,
        photo_url: photoUrl,
        institutional_email: dados.institutionalEmail || null,
        faculty_id: showAcademicUnit ? dados.facultyId || null : null,
        department_id: showAcademicUnit ? dados.departmentId || null : null,
        position_id: showPosition ? dados.positionId || null : null,
      },
      { onConflict: "user_id" }
    );

    if (profileError) {
      logSupabaseError("profiles upsert", profileError);

      if (profileError.code === "23505") {
        setError("Já existe um perfil associado a esta conta. Tenta entrar em vez de criar uma nova.");
      } else {
        setError("Conta criada, mas houve um erro ao guardar o perfil.");
      }

      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    // 4. role atribuído automaticamente pelo trigger `on_profile_created`
    //    (handle_new_profile_role, SECURITY DEFINER) — não é necessário fazer
    //    nada aqui no cliente.

    // 5. sucesso — mostra confirmação antes de redirecionar
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }


  return (
    <main className="w-full max-w-[1100px] mx-auto my-8 flex flex-col md:flex-row bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,17,58,0.04)] border border-outline-variant/30 overflow-hidden relative">
      {/* Painel esquerdo — marca */}
      <aside className="md:w-5/12 bg-surface-container-low p-8 md:p-12 flex-col justify-between relative overflow-hidden hidden md:flex border-r border-outline-variant/30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-headline-md text-headline-md font-extrabold text-primary mb-4 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
            UNIKIVI Vitae
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-8">
            Junte-se à principal rede de pesquisa académica. Registe a sua
            trajetória, conecte-se com investigadores e amplie o impacto do
            seu conhecimento.
          </p>
        </div>
        <div className="relative z-10 mt-12 w-full aspect-square rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm">
          <img
            src="/images/auth/registo-visual.jpg"
            alt="ola amigo"
            className="object-cover w-full h-full"
          />
        </div>
      </aside>

      {/* Painel direito — wizard */}
      <section className="w-full md:w-7/12 p-8 md:p-16 flex flex-col bg-surface-container-lowest relative z-10">
        <h1 className="md:hidden font-headline-md text-headline-md font-extrabold text-primary mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">hub</span>
          UNIKIVI Vitae
        </h1>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <span className="material-symbols-outlined text-secondary text-5xl mb-4">
              check_circle
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">
              Conta criada com sucesso!
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              A preparar o seu perfil...
            </p>
          </div>
        ) : (
          <>
            {/* Stepper */}
            <div className="w-full mb-12">
              <div className="flex items-center w-full gap-4">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full ${
                      i <= step ? "bg-primary" : "bg-surface-variant"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {STEPS.map((label, i) => (
                  <span
                    key={label}
                    className={`text-label-sm font-label-sm ${
                      i === step ? "font-bold text-primary" : "text-outline"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-error text-sm font-body-md mb-4">{error}</p>
            )}

            {step === 0 && (
              <StepPerfil
                value={profileType}
                onChange={setProfileType}
                onNext={goNext}
              />
            )}

            {step === 1 && (
              <StepDados
                profileType={profileType}
                value={dados}
                onChange={setDados}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === 2 && (
              <StepAcesso onBack={goBack} onSubmit={finish} loading={loading} />
            )}

            <div className="mt-12 pt-8 border-t border-outline-variant/30 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Já possui um perfil?{" "}
                <a      
                  href="/login"
                  className="font-bold text-primary hover:text-secondary-container transition-colors"
                >
                  Iniciar sessão
                </a>
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}