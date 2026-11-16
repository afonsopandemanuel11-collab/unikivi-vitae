import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Faltam as credenciais de servidor do Supabase em .env.local.");

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const COUNT = 200;
const EMAIL_PREFIX = "investigador.teste.";
const RESERVED_TEST_DOMAIN = "example.invalid";
const NON_UIGE_PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando", "Cuanza Norte", "Cuanza Sul",
  "Cunene", "Huambo", "Huíla", "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul",
  "Malanje", "Moxico", "Moxico Leste", "Namibe", "Cubango", "Zaire",
];

type Profile = { id: string; user_id: string };

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
}

async function runLimited<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

function emailFor(index: number) {
  return `${EMAIL_PREFIX}${String(index + 1).padStart(3, "0")}@${RESERVED_TEST_DOMAIN}`;
}

function isItProfile(index: number) {
  return index < 20 || (index >= 30 && index < 100);
}

function areaNameFor(index: number, isIt: boolean) {
  if (isIt) {
    const choices = ["Tecnologias da Informação e Comunicação", "Bases de Dados", "Inteligência Artificial", "Cibersegurança"];
    return choices[index % choices.length];
  }
  const choices = [
    "Ciências Agrárias e Desenvolvimento Rural",
    "Ciências da Saúde e Medicina Tropical",
    "Epidemiologia",
    "Economia e Gestão",
    "Ciências Jurídicas e Governação",
    "Ciências Sociais e Humanidades",
  ];
  return choices[index % choices.length];
}

function courseFor(index: number, isIt: boolean) {
  if (isIt) return ["Informática", "Engenharia Informática", "Sistemas de Informação", "Tecnologias de Informação"][index % 4];
  return ["Ciências Agrárias", "Saúde Pública", "Economia", "Ciências Sociais", "Gestão"][index % 5];
}

function bioFor(index: number, province: string, area: string, isIt: boolean) {
  const capabilities = isIt
    ? "Competências simuladas: fundamentos de informática, literacia digital, algoritmos, programação, bases de dados e sistemas de informação."
    : "Competências e percurso inteiramente simulados para testar a diversidade do conjunto de investigadores.";
  return `PERFIL FICTÍCIO PARA TESTE DA API. Não representa uma pessoa, currículo, instituição ou experiência real. Nacionalidade simulada: angolana. Província simulada: ${province}. Área de investigação simulada: ${area}. ${capabilities}`;
}

async function main() {
  const { data: existingProfiles, error: existingProfilesError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("bio", "PERFIL FICTÍCIO PARA TESTE DA API. Não representa uma pessoa, currículo, instituição ou experiência real.%");
  if (existingProfilesError) throw existingProfilesError;
  if (existingProfiles?.length) {
    throw new Error(`Já existem ${existingProfiles.length} perfis com o marcador exclusivo deste conjunto. Execute primeiro npm run clean:api-demo -- --apply para evitar duplicados.`);
  }

  const [{ data: skills, error: skillError }, { data: researchAreas, error: areaError }] = await Promise.all([
    supabase.from("skills").select("id, name"),
    supabase.from("research_areas").select("id, name").eq("status", "ACTIVE"),
  ]);
  if (skillError) throw skillError;
  if (areaError) throw areaError;

  const skillByName = new Map((skills ?? []).map((skill) => [skill.name, skill.id]));
  const areaByName = new Map((researchAreas ?? []).map((area) => [area.name, area.id]));
  const requiredAreas = [
    "Tecnologias da Informação e Comunicação", "Bases de Dados", "Inteligência Artificial", "Cibersegurança",
    "Ciências Agrárias e Desenvolvimento Rural", "Ciências da Saúde e Medicina Tropical", "Epidemiologia",
    "Economia e Gestão", "Ciências Jurídicas e Governação", "Ciências Sociais e Humanidades",
  ];
  const missingAreas = requiredAreas.filter((area) => !areaByName.has(area));
  if (missingAreas.length) throw new Error(`Faltam áreas de investigação de referência: ${missingAreas.join(", ")}`);
  const skillNames = ["Python", "SQL / PostgreSQL", "Machine Learning", "pgvector", "Next.js / React", "LaTeX", "Investigação Qualitativa", "Epidemiologia"];
  const missingSkills = skillNames.filter((name) => !skillByName.has(name));
  if (missingSkills.length) throw new Error(`Faltam competências de referência: ${missingSkills.join(", ")}`);

  const profilesToCreate = Array.from({ length: COUNT }, (_, index) => {
    const province = index < 30 ? "Uíge" : NON_UIGE_PROVINCES[(index - 30) % NON_UIGE_PROVINCES.length];
    const isIt = isItProfile(index);
    const area = areaNameFor(index, isIt);
    return { index, email: emailFor(index), fullName: `Investigador de Teste ${String(index + 1).padStart(3, "0")}`, province, area, isIt, course: courseFor(index, isIt) };
  });

  console.log(`A criar ${COUNT} perfis de investigação fictícios; 30 terão localização simulada no Uíge.`);
  console.log(`Os emails usam @${RESERVED_TEST_DOMAIN}; nenhuma mensagem de convite será enviada.`);

  const users = await runLimited(profilesToCreate, 4, async (candidate) => {
    const password = `Aa1!${randomBytes(32).toString("base64url")}`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: candidate.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: candidate.fullName, test_dataset: "api-jury-investigators-v1" },
    });
    if (error || !data.user) throw new Error(`Falha ao criar ${candidate.email}: ${error?.message ?? "utilizador vazio"}`);
    return { ...candidate, userId: data.user.id };
  });
  console.log(`✓ ${users.length} contas técnicas criadas; as palavras-passe aleatórias não são guardadas nem apresentadas.`);

  const profiles: Profile[] = [];
  for (const batch of chunks(users, 50)) {
    const { data, error } = await supabase.from("profiles").upsert(
      batch.map((candidate) => ({
        user_id: candidate.userId,
        full_name: candidate.fullName,
        profile_type: "RESEARCHER" as const,
        nationality: "Angolana",
        bio: bioFor(candidate.index, candidate.province, candidate.area, candidate.isIt),
        status: "ACTIVE" as const,
        visibility: "INSTITUTIONAL" as const,
        faculty_id: null,
        department_id: null,
        position_id: null,
        photo_url: null,
        search_indexable: false,
        field_visibility: { phone: false, photo: false, institutional_email: false, skills: true, projects: false, education: true, experience: true, publications: false },
        section_visibility: { awards: false, skills: true, projects: false, education: true, experience: true, publications: false },
      })),
      { onConflict: "user_id" },
    ).select("id, user_id");
    if (error) throw error;
    profiles.push(...(data ?? []));
  }
  if (profiles.length !== COUNT) throw new Error(`Esperava ${COUNT} perfis criados; recebi ${profiles.length}.`);
  console.log(`✓ ${profiles.length} perfis marcados como fictícios e não indexáveis na pesquisa pública.`);

  const profileByUserId = new Map(profiles.map((profile) => [profile.user_id, profile.id]));
  const educationRows = users.map((candidate) => {
    const profileId = profileByUserId.get(candidate.userId);
    if (!profileId) throw new Error(`Não encontrei o perfil de ${candidate.email}.`);
    const startYear = 2002 + (candidate.index % 18);
    return {
      profile_id: profileId,
      degree: ["Licenciatura", "Mestrado", "Doutoramento"][candidate.index % 3],
      course: candidate.course,
      institution: "Instituição Académica Fictícia de Teste",
      institution_country: "Angola",
      start_year: startYear,
      end_year: startYear + (candidate.index % 3 === 2 ? 5 : 4),
      field_of_study: candidate.course,
      description: "Registo totalmente sintético, criado apenas para teste de API; não é um diploma real.",
      verified: false,
    };
  });
  for (const batch of chunks(educationRows, 100)) {
    const { error } = await supabase.from("education").insert(batch);
    if (error) throw error;
  }

  const experienceRows = users.map((candidate) => {
    const profileId = profileByUserId.get(candidate.userId);
    if (!profileId) throw new Error(`Não encontrei o perfil de ${candidate.email}.`);
    return {
      profile_id: profileId,
      organization: "Laboratório Fictício de Teste",
      position: candidate.isIt ? "Investigador de Informática (simulado)" : "Investigador (simulado)",
      description: `Experiência inteiramente fictícia na área de ${candidate.area}; dado criado apenas para testar recomendações de júri.`,
      start_date: `${2010 + (candidate.index % 12)}-01-01`,
      end_date: null,
      is_current: true,
      location: `${candidate.province}, Angola (localização simulada)`,
      employment_type: "OTHER",
    };
  });
  for (const batch of chunks(experienceRows, 100)) {
    const { error } = await supabase.from("experiences").insert(batch);
    if (error) throw error;
  }

  const itSkills = ["Python", "SQL / PostgreSQL", "Machine Learning", "pgvector", "Next.js / React", "LaTeX"];
  const nonItSkills = ["LaTeX", "Investigação Qualitativa", "Epidemiologia"];
  const skillRows = users.flatMap((candidate) => {
    const profileId = profileByUserId.get(candidate.userId);
    if (!profileId) throw new Error(`Não encontrei o perfil de ${candidate.email}.`);
    const selectedSkills = candidate.isIt ? itSkills.filter((_, index) => (index + candidate.index) % 3 !== 0).slice(0, 4) : nonItSkills.filter((_, index) => (index + candidate.index) % 2 === 0);
    return selectedSkills.map((name, index) => ({
      profile_id: profileId,
      skill_id: skillByName.get(name)!,
      level: (["INTERMEDIATE", "ADVANCED", "EXPERT"] as const)[(candidate.index + index) % 3],
      years_experience: 1 + ((candidate.index + index * 2) % 15),
      evidence: "Competência fictícia associada a um perfil sintético de teste; não constitui validação real.",
    }));
  });
  for (const batch of chunks(skillRows, 200)) {
    const { error } = await supabase.from("profile_skills").upsert(batch, { onConflict: "profile_id,skill_id" });
    if (error) throw error;
  }

  const researchAreaRows = users.flatMap((candidate) => {
    const profileId = profileByUserId.get(candidate.userId);
    const areaId = areaByName.get(candidate.area);
    if (!profileId || !areaId) throw new Error(`Área ou perfil em falta para ${candidate.email}.`);
    return [{ profile_id: profileId, research_area_id: areaId, relevance: 5 }];
  });
  for (const batch of chunks(researchAreaRows, 200)) {
    const { error } = await supabase.from("profile_research_areas").upsert(batch, { onConflict: "profile_id,research_area_id" });
    if (error) throw error;
  }

  const uigeCount = users.filter((candidate) => candidate.province === "Uíge").length;
  const itCount = users.filter((candidate) => candidate.isIt).length;
  console.log(`✓ Dados sintéticos: ${users.length} investigadores; ${uigeCount} no Uíge; ${itCount} em áreas de informática/TIC.`);
  console.log("Cada perfil inclui formação, experiência, competências e área de investigação fictícias.");
  console.log("Para remover apenas estes utilizadores e os respetivos dados dependentes: npm run clean:api-demo -- --apply");
}

main().catch((error: unknown) => {
  console.error("Falha ao semear os investigadores de teste:", error instanceof Error ? error.message : error);
  console.error("Se algumas contas já foram criadas, use o script de limpeza com --apply e repita a semeadura.");
  process.exitCode = 1;
});
