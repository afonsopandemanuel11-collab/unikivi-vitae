import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TemplateRenderer from "@/components/curriculos/templates/TemplateRenderer";
import PrintButton from "@/components/curriculos/PrintButton";
import { FullCurriculumData } from "@/components/curriculos/types";
import { CurriculumSnapshot } from "@/app/dashboard/curriculos/actions";

export default async function VisualizarCurriculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  // Procura o currículo
  const { data: curriculum } = await supabase
    .from("curricula")
    .select("*, curriculum_versions(*)")
    .eq("id", id)
    .single();

  if (!curriculum) redirect("/dashboard/curriculos");

  // Perfil associado ao currículo
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, faculty:faculties(name), department:departments(name), position:positions(name)")
    .eq("id", curriculum.profile_id)
    .single();

  if (!profile) redirect("/dashboard/curriculos");

  // Dados agregados (paralelos para performance)
  const [
    { data: education },
    { data: experiences },
    { data: profileSkills },
    { data: projectMemberships },
    { data: authoredPubs },
    { data: certifications },
    { data: awards },
    { data: profileLanguages },
    { data: identifiers },
  ] = await Promise.all([
    supabase.from("education").select("*").eq("profile_id", profile.id).order("start_year", { ascending: false }),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false }),
    supabase.from("profile_skills").select("skills(id, name, skill_categories(name))").eq("profile_id", profile.id),
    supabase.from("project_members").select("role, projects(*)").eq("profile_id", profile.id),
    supabase.from("publication_authors").select("publications(*)").eq("profile_id", profile.id),
    supabase.from("certifications").select("*").eq("profile_id", profile.id).order("issue_date", { ascending: false }),
    supabase.from("awards").select("*").eq("profile_id", profile.id).order("year", { ascending: false }),
    supabase.from("profile_languages").select("proficiency, languages(id, name)").eq("profile_id", profile.id),
    supabase.from("profile_identifiers").select("*").eq("profile_id", profile.id),
  ]);

  const normalizedFaculty = Array.isArray(profile.faculty) ? profile.faculty[0] : profile.faculty;
  const normalizedDept = Array.isArray(profile.department) ? profile.department[0] : profile.department;
  const normalizedPos = Array.isArray(profile.position) ? profile.position[0] : profile.position;

  const aggregatedData: FullCurriculumData = {
    profile: {
      ...profile,
      faculty: normalizedFaculty,
      department: normalizedDept,
      position: normalizedPos,
    },
    education: education ?? [],
    experiences: experiences ?? [],
    skills: (profileSkills ?? []).map((ps: any) => {
      const s = Array.isArray(ps.skills) ? ps.skills[0] : ps.skills;
      return {
        id: s?.id ?? "",
        name: s?.name ?? "",
        category_name: s?.skill_categories?.name ?? null,
      };
    }).filter((s) => s.id),
    projects: (projectMemberships ?? []).map((pm: any) => {
      const p = Array.isArray(pm.projects) ? pm.projects[0] : pm.projects;
      return {
        id: p?.id ?? "",
        title: p?.title ?? "",
        role: pm.role ?? "Membro",
        description: p?.description ?? null,
        start_date: p?.start_date ?? null,
        end_date: p?.end_date ?? null,
        status: p?.status ?? "ACTIVE",
        funding_source: p?.funding_source ?? null,
      };
    }).filter((p) => p.id),
    publications: (authoredPubs ?? []).map((ap: any) => {
      const pub = Array.isArray(ap.publications) ? ap.publications[0] : ap.publications;
      return {
        id: pub?.id ?? "",
        title: pub?.title ?? "",
        journal: pub?.journal ?? null,
        year: pub?.year ?? null,
        doi: pub?.doi ?? null,
        url: pub?.url ?? null,
        publication_type: pub?.publication_type ?? "ARTICLE",
      };
    }).filter((pub) => pub.id),
    certifications: certifications ?? [],
    awards: awards ?? [],
    languages: (profileLanguages ?? []).map((pl: any) => {
      const lang = Array.isArray(pl.languages) ? pl.languages[0] : pl.languages;
      return {
        id: lang?.id ?? "",
        name: lang?.name ?? "",
        proficiency: pl.proficiency ?? "Básico",
      };
    }).filter((l) => l.id),
    identifiers: identifiers ?? [],
  };

  const sortedVersions = (curriculum.curriculum_versions ?? []).sort(
    (a: any, b: any) => b.version - a.version
  );

  const snapshot: CurriculumSnapshot = sortedVersions[0]?.snapshot || {
    template: curriculum.template || "UNIKIVI_CLASSIC",
    custom_title: profile.professional_name || profile.full_name,
    custom_summary: curriculum.summary || profile.bio || "",
    sections: ["summary", "experience", "education", "skills", "projects", "certifications", "identifiers"],
    selected_items: {},
    settings: {
      primary_color: "#00113A",
      font: "Inter",
      density: "normal",
      layout: "single",
      show_photo: true,
      show_contacts: true,
    },
  };

  const pdfName = profile.full_name?.replace(/\s+/g, "_") ?? "Curriculo";

  return (
    /*
     * ARQUITECTURA DE IMPRESSÃO
     * ─────────────────────────
     * Temos DOIS blocos:
     *   1. .visualizar-chrome   → barra de topo + canvas de preview (print-hidden)
     *   2. #resume-document     → currículo isolado (visível apenas no print)
     *
     * Em ecrã:
     *   - .visualizar-chrome está visível (inclui o preview do currículo)
     *   - #resume-document está visível (fora do fluxo normal → position:fixed fora do viewport)
     *
     * Ao imprimir (@media print):
     *   - .visualizar-chrome → display:none (print-hidden)
     *   - #resume-document   → display:block; position:static
     *
     * Desta forma, o PDF contém APENAS o currículo.
     */
    <div className="relative">
      {/* ── 1. CHROME DA APLICAÇÃO (visível em ecrã, oculta no print) ── */}
      <div className="visualizar-chrome print-hidden min-h-screen bg-slate-200 flex flex-col">
        {/* Barra de navegação superior */}
        <div className="bg-white border-b border-slate-200 px-5 py-3 sticky top-0 z-50 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/curriculos/${curriculum.id}/editar`}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-primary p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span className="hidden sm:inline">Voltar ao Editor</span>
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-sm">
              {curriculum.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Pré-visualização
            </span>
            <PrintButton pdfName={pdfName} />
          </div>
        </div>

        {/* Canvas: simulação de folha A4 sobre fundo cinza */}
        <div className="flex-1 py-10 px-4 flex flex-col items-center overflow-y-auto">
          {/* Sombra e moldura de papel */}
          <div
            className="w-full max-w-[794px] bg-white shadow-2xl"
            style={{ minHeight: "1123px" /* 297mm × 96dpi */ }}
          >
            <TemplateRenderer data={aggregatedData} snapshot={snapshot} />
          </div>
        </div>
      </div>

      {/* ── 2. DOCUMENTO PARA IMPRESSÃO (oculto em ecrã, visível no print) ──
           Está posicionado fora do viewport visível em ecrã normal.
           O @media print remove o position:fixed e torna-o o conteúdo principal. */}
      <div
        id="resume-document"
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "210mm",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <TemplateRenderer data={aggregatedData} snapshot={snapshot} />
      </div>
    </div>
  );
}
