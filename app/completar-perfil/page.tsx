import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeMissingProfile } from "./actions";

const profileTypes = [
  ["TEACHER", "Docente"],
  ["RESEARCHER", "Investigador"],
  ["STUDENT", "Estudante"],
  ["PROFESSIONAL", "Profissional"],
  ["TALENT", "Talento"],
] as const;

export default async function CompletarPerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile) redirect("/dashboard");

  const { erro } = await searchParams;
  const errorMessage = erro
    ? erro === "nome"
      ? "Indique o seu nome completo (entre 2 e 160 caracteres)."
      : erro === "tipo"
        ? "Escolha uma categoria de perfil válida."
        : "Não foi possível guardar os dados. Atualize a página e tente novamente."
    : null;

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-on-background">
      <section className="mx-auto max-w-xl rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm sm:p-10">
        <span className="material-symbols-outlined mb-4 text-3xl text-primary">person_add</span>
        <h1 className="font-headline-lg text-3xl font-bold text-primary">Complete o seu perfil</h1>
        <p className="mt-3 text-on-surface-variant">
          Falta apenas esta informação para abrir o seu painel e começar a organizar o seu percurso.
        </p>

        {errorMessage && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}

        <form action={completeMissingProfile} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-primary">
            Nome completo
            <input
              name="full_name"
              required
              minLength={2}
              maxLength={160}
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-normal text-on-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="block text-sm font-semibold text-primary">
            Tipo de perfil
            <select name="profile_type" required defaultValue="" className="mt-2 w-full rounded-lg border border-outline-variant bg-white px-4 py-3 font-normal text-on-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option value="" disabled>Selecione uma categoria</option>
              {profileTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="submit" className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary/90">
            Guardar e continuar
          </button>
        </form>
      </section>
    </main>
  );
}
