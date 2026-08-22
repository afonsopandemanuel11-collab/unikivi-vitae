// scripts/seed.ts
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("A semear faculdades...");

  const { data: faculties, error: facultiesError } = await supabase
    .from("faculties")
    .upsert(
      [
        { name: "Instituto Politécnico da UNIKIVI", code: "IP", description: "Formação em engenharias e ciências tecnológicas.", status: "ACTIVE" },
        { name: "Faculdade de Direito", code: "FD", status: "ACTIVE" },
        { name: "Faculdade de Economia", code: "FEU", status: "ACTIVE" },
        { name: "Faculdade de Medicina", code: "FM", status: "ACTIVE" },
        { name: "Faculdade de Ciências da Educação", code: "FCE", description: "Herdeira histórica do ISCED Uíge.", status: "ACTIVE" },
        { name: "Faculdade de Ciências Agrárias", code: "FCA", status: "ACTIVE" },
        { name: "Escola Superior de Enfermagem", code: "ESE", status: "ACTIVE" },
      ],
      { onConflict: "code" }
    )
    .select();

  if (facultiesError) throw facultiesError;
  console.log(`✓ ${faculties.length} faculdades semeadas.`);

  // mapa código → id, para usar nos departamentos
  const facultyIdByCode = Object.fromEntries(
    faculties.map((f) => [f.code, f.id])
  );

  console.log("A semear departamentos...");

  const { data: departments, error: departmentsError } = await supabase
    .from("departments")
    .upsert(
      [
        { faculty_id: facultyIdByCode["IP"], name: "Departamento de Engenharia Informática", code: "IP-INFO", status: "ACTIVE" },
        { faculty_id: facultyIdByCode["FEU"], name: "Departamento de Economia Fundamental", code: "FEU-EF", status: "ACTIVE" },
        { faculty_id: facultyIdByCode["FEU"], name: "Departamento de Economia Aplicada", code: "FEU-EA", status: "ACTIVE" },
        { faculty_id: facultyIdByCode["FD"], name: "Departamento de Ciências Jurídicas", code: "FD-CJ", status: "ACTIVE" },
      ],
      { onConflict: "code" }
    )
    .select();

  if (departmentsError) throw departmentsError;
  console.log(`✓ ${departments.length} departamentos semeados.`);

  console.log("A semear cargos académicos...");

  const { data: positions, error: positionsError } = await supabase
    .from("positions")
    .upsert(
      [
        { name: "Monitor", is_academic: true, rank_order: 1 },
        { name: "Assistente Estagiário", is_academic: true, rank_order: 2 },
        { name: "Assistente", is_academic: true, rank_order: 3 },
        { name: "Professor Auxiliar", is_academic: true, rank_order: 4 },
        { name: "Professor Associado", is_academic: true, rank_order: 5 },
        { name: "Professor Catedrático", is_academic: true, rank_order: 6 },
      ],
      { onConflict: "name" }
    )
    .select();

  if (positionsError) throw positionsError;
  console.log(`✓ ${positions.length} cargos semeados.`);

  console.log("Seed concluído.");
}

seed().catch((err) => {
  console.error("Erro ao semear:", err.message);
  process.exit(1);
});