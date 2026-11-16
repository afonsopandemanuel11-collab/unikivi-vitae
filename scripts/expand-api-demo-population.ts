import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Faltam as credenciais de servidor do Supabase em .env.local.");

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const MARKER = "PERFIL FICTÍCIO PARA TESTE DA API. Não representa uma pessoa, currículo, instituição ou experiência real.";
const EMAIL_PREFIX = "investigador.teste.";
const TEST_DOMAIN = "example.invalid";
const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Moxico Leste", "Namibe", "Cubango", "Zaire",
];
const SKILLS = ["Python", "SQL / PostgreSQL", "Machine Learning", "pgvector", "Next.js / React", "LaTeX", "Investigação Qualitativa", "Epidemiologia"];
const IT_SKILLS = ["Python", "SQL / PostgreSQL", "Machine Learning", "pgvector", "Next.js / React", "LaTeX"];
const OTHER_SKILLS = ["LaTeX", "Investigação Qualitativa", "Epidemiologia"];
const AREA_CHOICES = [
  "Tecnologias da Informação e Comunicação", "Bases de Dados", "Inteligência Artificial", "Cibersegurança",
  "Ciências Agrárias e Desenvolvimento Rural", "Ciências da Saúde e Medicina Tropical", "Epidemiologia",
  "Economia e Gestão", "Ciências Jurídicas e Governação", "Ciências Sociais e Humanidades",
];

type ExistingProfile = { id: string; user_id: string; full_name: string; bio: string | null };
type DemoProfile = { number: number; name: string; type: "TEACHER" | "RESEARCHER" | "TALENT" | "PROFESSIONAL"; province: string; area: string; isIt: boolean; course: string };

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
}

async function mapLimited<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index]);
    }
  }));
  return results;
}

function typeFor(number: number): DemoProfile["type"] {
  if (number <= 122) return "TEACHER";
  if (number <= 172) return "RESEARCHER";
  if (number <= 236) return "TALENT";
  return "PROFESSIONAL";
}

function nameFor(number: number, type: DemoProfile["type"]) {
  const label = { TEACHER: "Docente", RESEARCHER: "Investigador", TALENT: "Talento", PROFESSIONAL: "Profissional" }[type];
  return `${label} de Teste ${String(number).padStart(3, "0")}`;
}

function parseProvince(bio: string | null, number: number) {
  const province = bio?.match(/Província simulada: ([^.]+)\./)?.[1];
  return province ?? (number <= 30 ? "Uíge" : PROVINCES[(number - 31) % PROVINCES.length]);
}

function isItNumber(number: number) {
  return number <= 20 || (number >= 31 && number <= 100);
}

function areaFor(number: number, isIt: boolean) {
  if (isIt) return AREA_CHOICES[(number - 1) % 4];
  return AREA_CHOICES[4 + ((number - 1) % 6)];
}

function courseFor(number: number, isIt: boolean) {
  if (isIt) return ["Informática", "Engenharia Informática", "Sistemas de Informação", "Tecnologias de Informação"][(number - 1) % 4];
  return ["Ciências Agrárias", "Saúde Pública", "Economia", "Ciências Sociais", "Gestão"][(number - 1) % 5];
}

function bioFor(type: DemoProfile["type"], province: string, area: string, isIt: boolean) {
  const typeLabel = { TEACHER: "docente", RESEARCHER: "investigador", TALENT: "talento académico", PROFESSIONAL: "profissional" }[type];
  const capabilities = isIt
    ? "Competências simuladas: fundamentos de informática, literacia digital, algoritmos, programação, bases de dados e sistemas de informação."
    : "Competências e percurso inteiramente simulados para testar recomendações e composição de júris.";
  return `${MARKER} Tipo de perfil simulado: ${typeLabel}. Nacionalidade simulada: angolana. Província simulada: ${province}. Área de investigação simulada: ${area}. ${capabilities}`;
}

function emailFor(number: number) {
  return `${EMAIL_PREFIX}${String(number).padStart(3, "0")}@${TEST_DOMAIN}`;
}

async function main() {
  const { data: existingProfiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, bio")
    .ilike("bio", `${MARKER}%`);
  if (profileError) throw profileError;
  if (existingProfiles?.length !== 200) throw new Error(`Esperava encontrar exatamente 200 perfis sintéticos existentes; encontrei ${existingProfiles?.length ?? 0}.`);

  const existingByNumber = new Map<number, ExistingProfile>();
  for (const profile of existingProfiles as ExistingProfile[]) {
    const match = profile.full_name.match(/^(?:Investigador|Docente|Talento|Profissional) de Teste (\d{3})$/);
    if (!match) throw new Error(`Perfil sintético fora do padrão reconhecido: ${profile.id}.`);
    existingByNumber.set(Number(match[1]), profile);
  }
  for (let number = 1; number <= 200; number += 1) {
    if (!existingByNumber.has(number)) throw new Error(`Está em falta o perfil sintético ${String(number).padStart(3, "0")}.`);
  }

  const [{ data: skills, error: skillError }, { data: areas, error: areaError }] = await Promise.all([
    supabase.from("skills").select("id, name"),
    supabase.from("research_areas").select("id, name").eq("status", "ACTIVE"),
  ]);
  if (skillError) throw skillError;
  if (areaError) throw areaError;
  const skillIds = new Map((skills ?? []).map((row) => [row.name, row.id]));
  const areaIds = new Map((areas ?? []).map((row) => [row.name, row.id]));
  const missingSkills = SKILLS.filter((name) => !skillIds.has(name));
  const missingAreas = AREA_CHOICES.filter((name) => !areaIds.has(name));
  if (missingSkills.length || missingAreas.length) throw new Error(`Referências em falta — competências: ${missingSkills.join(", ")}; áreas: ${missingAreas.join(", ")}.`);

  const existingRows = Array.from({ length: 200 }, (_, index) => {
    const number = index + 1;
    const previous = existingByNumber.get(number)!;
    const type = typeFor(number);
    const province = parseProvince(previous.bio, number);
    const isIt = isItNumber(number);
    const area = areaFor(number, isIt);
    return { ...previous, number, name: nameFor(number, type), type, province, isIt, area, course: courseFor(number, isIt) };
  });

  for (const batch of chunks(existingRows, 50)) {
    const { error } = await supabase.from("profiles").upsert(batch.map((profile) => ({
      user_id: profile.user_id,
      full_name: profile.name,
      profile_type: profile.type,
      bio: bioFor(profile.type, profile.province, profile.area, profile.isIt),
      search_indexable: false,
    })), { onConflict: "user_id" });
    if (error) throw error;
  }

  const newCandidates = Array.from({ length: 100 }, (_, index) => {
    const number = index + 201;
    const type = typeFor(number);
    const province = PROVINCES[(number - 31) % PROVINCES.length];
    const isIt = isItNumber(number);
    const area = areaFor(number, isIt);
    return { number, type, name: nameFor(number, type), province, isIt, area, course: courseFor(number, isIt), email: emailFor(number) };
  });

  const createdUsers = await mapLimited(newCandidates, 4, async (candidate) => {
    const password = `Aa1!${randomBytes(32).toString("base64url")}`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: candidate.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: candidate.name, test_dataset: "api-jury-investigators-v1" },
    });
    if (error || !data.user) throw new Error(`Falha ao criar ${candidate.email}: ${error?.message ?? "utilizador vazio"}`);
    return { ...candidate, user_id: data.user.id };
  });

  const { data: insertedProfiles, error: insertError } = await supabase.from("profiles").upsert(createdUsers.map((candidate) => ({
    user_id: candidate.user_id,
    full_name: candidate.name,
    profile_type: candidate.type,
    nationality: "Angolana",
    bio: bioFor(candidate.type, candidate.province, candidate.area, candidate.isIt),
    status: "ACTIVE" as const,
    visibility: "INSTITUTIONAL" as const,
    faculty_id: null,
    department_id: null,
    position_id: null,
    photo_url: null,
    search_indexable: false,
    field_visibility: { phone: false, photo: false, institutional_email: false, skills: true, projects: false, education: true, experience: true, publications: false },
    section_visibility: { awards: false, skills: true, projects: false, education: true, experience: true, publications: false },
  })), { onConflict: "user_id" }).select("id,user_id");
  if (insertError) throw insertError;
  if (insertedProfiles?.length !== 100) throw new Error(`Esperava 100 perfis novos; foram devolvidos ${insertedProfiles?.length ?? 0}.`);

  const profileIdByUserId = new Map(insertedProfiles.map((profile) => [profile.user_id, profile.id]));
  const educationRows = createdUsers.map((candidate) => {
    const profileId = profileIdByUserId.get(candidate.user_id);
    if (!profileId) throw new Error(`Perfil novo em falta para ${candidate.email}.`);
    const startYear = 2002 + (candidate.number % 18);
    return {
      profile_id: profileId,
      degree: ["Licenciatura", "Mestrado", "Doutoramento"][candidate.number % 3],
      course: candidate.course,
      institution: "Instituição Académica Fictícia de Teste",
      institution_country: "Angola",
      start_year: startYear,
      end_year: startYear + (candidate.number % 3 === 2 ? 5 : 4),
      field_of_study: candidate.course,
      description: "Registo totalmente sintético, criado apenas para teste de API; não é um diploma real.",
      verified: false,
    };
  });
  for (const batch of chunks(educationRows, 100)) {
    const { error } = await supabase.from("education").insert(batch);
    if (error) throw error;
  }

  const experienceRows = createdUsers.map((candidate) => ({
    profile_id: profileIdByUserId.get(candidate.user_id)!,
    organization: "Laboratório Fictício de Teste",
    position: `${{ TEACHER: "Docente", RESEARCHER: "Investigador", TALENT: "Talento académico", PROFESSIONAL: "Profissional" }[candidate.type]} (simulado)`,
    description: `Experiência inteiramente fictícia na área de ${candidate.area}; dado criado apenas para testar recomendações de júri.`,
    start_date: `${2010 + (candidate.number % 12)}-01-01`,
    end_date: null,
    is_current: true,
    location: `${candidate.province}, Angola (localização simulada)`,
    employment_type: "OTHER",
  }));
  for (const batch of chunks(experienceRows, 100)) {
    const { error } = await supabase.from("experiences").insert(batch);
    if (error) throw error;
  }

  const itSkills = SKILLS.filter((name) => IT_SKILLS.includes(name));
  const otherSkills = SKILLS.filter((name) => OTHER_SKILLS.includes(name));
  const skillRows = createdUsers.flatMap((candidate) => {
    const selectedSkills = candidate.isIt
      ? itSkills.filter((_, index) => (index + candidate.number) % 3 !== 0).slice(0, 4)
      : otherSkills.filter((_, index) => (index + candidate.number) % 2 === 0);
    return selectedSkills.map((name, index) => ({
      profile_id: profileIdByUserId.get(candidate.user_id)!,
      skill_id: skillIds.get(name)!,
      level: (["INTERMEDIATE", "ADVANCED", "EXPERT"] as const)[(candidate.number + index) % 3],
      years_experience: 1 + ((candidate.number + index * 2) % 15),
      evidence: "Competência fictícia associada a um perfil sintético de teste; não constitui validação real.",
    }));
  });
  for (const batch of chunks(skillRows, 200)) {
    const { error } = await supabase.from("profile_skills").upsert(batch, { onConflict: "profile_id,skill_id" });
    if (error) throw error;
  }

  const areaRows = createdUsers.map((candidate) => ({
    profile_id: profileIdByUserId.get(candidate.user_id)!,
    research_area_id: areaIds.get(candidate.area)!,
    relevance: 5,
  }));
  for (const batch of chunks(areaRows, 200)) {
    const { error } = await supabase.from("profile_research_areas").upsert(batch, { onConflict: "profile_id,research_area_id" });
    if (error) throw error;
  }

  const { error: scopeError } = await supabase.from("api_clients").update({
    scopes: [
      "read:profiles", "profile_type:TEACHER", "profile_type:RESEARCHER", "profile_type:TALENT", "profile_type:PROFESSIONAL",
      "field:full_name", "field:professional_name", "field:bio", "field:faculty", "field:department", "field:position",
      "field:education", "field:experience", "field:competencies", "field:research_areas", "field:publications", "field:projects",
    ],
    updated_at: new Date().toISOString(),
  }).eq("name", "Juri teste");
  if (scopeError) throw scopeError;

  console.log("✓ População sintética ajustada para 300 perfis: 122 docentes, 50 investigadores, 64 talentos e 64 profissionais.");
  console.log("✓ Os 300 perfis estão ativos, institucionais, fora da pesquisa pública e marcados como fictícios.");
  console.log("✓ A integração Juri teste passou a permitir consultar os quatro tipos e áreas de investigação.");
  console.log("A chave anteriormente exposta foi revogada. Crie uma nova chave para continuar a testar.");
}

main().catch((error: unknown) => {
  console.error("Falha ao expandir a população de teste:", error instanceof Error ? error.message : error);
  console.error("Os registos já criados continuam marcados para limpeza com npm run clean:api-demo -- --apply.");
  process.exitCode = 1;
});
