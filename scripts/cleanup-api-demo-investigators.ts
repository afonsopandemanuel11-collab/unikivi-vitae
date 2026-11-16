import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Faltam as credenciais de servidor do Supabase em .env.local.");

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const TEST_PROFILE_MARKER = "PERFIL FICTÍCIO PARA TESTE DA API. Não representa uma pessoa, currículo, instituição ou experiência real.";
const APPLY = process.argv.includes("--apply");

async function main() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, bio")
    .ilike("bio", `${TEST_PROFILE_MARKER}%`);
  if (profilesError) throw profilesError;
  const targets = (profiles ?? []).filter((profile) => profile.bio?.startsWith(TEST_PROFILE_MARKER));
  console.log(`Encontrados ${targets.length} utilizadores com o marcador exclusivo do conjunto de investigadores de teste.`);
  if (!targets.length) return;
  if (!APPLY) {
    console.log("Modo de pré-visualização: nada foi apagado. Para aplicar, execute npm run clean:api-demo -- --apply.");
    return;
  }

  let deleted = 0;
  for (const profile of targets) {
    const { error } = await supabase.auth.admin.deleteUser(profile.user_id);
    if (error) throw new Error(`Falha ao apagar o utilizador do perfil ${profile.user_id}: ${error.message}`);
    deleted += 1;
  }
  console.log(`✓ ${deleted} contas de teste removidas. Os perfis e os registos dependentes com exclusão em cascata também foram removidos.`);
}

main().catch((error: unknown) => {
  console.error("Falha ao limpar investigadores de teste:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
