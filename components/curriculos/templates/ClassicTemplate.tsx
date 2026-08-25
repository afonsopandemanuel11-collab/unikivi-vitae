"use client";

import { TemplateProps } from "../types";

// Utilitário: formata data para "Jan 2024"
function fmtDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("pt-PT", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function ClassicTemplate({ data, snapshot }: TemplateProps) {
  const { profile, education, experiences, skills, projects, publications, certifications, awards, languages, identifiers } = data;
  const sections = snapshot.sections || [];
  const selected = snapshot.selected_items || {};
  const settings = snapshot.settings || {};

  // Filtrar itens conforme seleção (lista vazia = todos incluídos)
  const filteredExperiences = experiences.filter((e) => !selected.experiences?.length || selected.experiences.includes(e.id));
  const filteredEducation = education.filter((e) => !selected.education?.length || selected.education.includes(e.id));
  const filteredSkills = skills.filter((s) => !selected.skills?.length || selected.skills.includes(s.id));
  const filteredProjects = projects.filter((p) => !selected.projects?.length || selected.projects.includes(p.id));
  const filteredPublications = publications.filter((p) => !selected.publications?.length || selected.publications.includes(p.id));
  const filteredCertifications = certifications.filter((c) => !selected.certifications?.length || selected.certifications.includes(c.id));
  const filteredAwards = awards.filter((a) => !selected.awards?.length || selected.awards.includes(a.id));
  const filteredLanguages = languages.filter((l) => !selected.languages?.length || selected.languages.includes(l.id));
  const filteredIdentifiers = identifiers.filter((i) => !selected.identifiers?.length || selected.identifiers.includes(i.id));

  const displayName = profile.full_name;
  const professionalTitle = snapshot.custom_title || profile.professional_name || profile.position?.name;
  const summaryText = snapshot.custom_summary || profile.bio;

  const fontFamily =
    settings.font === "JetBrains Mono"
      ? "'JetBrains Mono', monospace"
      : settings.font === "Georgia"
      ? "Georgia, serif"
      : "Inter, system-ui, sans-serif";

  // Densidade → espaçamento entre itens
  const itemGap = settings.density === "compact" ? "8px" : settings.density === "spacious" ? "20px" : "12px";
  const sectionGap = settings.density === "compact" ? "16px" : settings.density === "spacious" ? "32px" : "20px";

  return (
    <div
      style={{
        fontFamily,
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm 18mm",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        fontSize: "10pt",
        lineHeight: "1.5",
        boxSizing: "border-box",
      }}
    >
      {/* ── CABEÇALHO ATS FRIENDLY ── */}
      <header
        style={{
          borderBottom: "2px solid #0f172a",
          paddingBottom: "10px",
          marginBottom: sectionGap,
        }}
      >
        <h1 style={{ fontSize: "22pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", margin: 0 }}>
          {displayName}
        </h1>
        {professionalTitle && (
          <p style={{ fontSize: "10pt", fontWeight: 600, textTransform: "uppercase", color: "#475569", margin: "4px 0 0" }}>
            {professionalTitle}
          </p>
        )}

        {/* Contactos em linha simples — amigável para ATS */}
        {settings.show_contacts !== false && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px", fontSize: "9pt", color: "#64748b", marginTop: "6px" }}>
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>• {profile.phone}</span>}
            {(profile.city || profile.country) && (
              <span>• {[profile.city, profile.country || "Angola"].filter(Boolean).join(", ")}</span>
            )}
            {profile.faculty && <span>• {profile.faculty.name}</span>}
          </div>
        )}

        {/* Identificadores / Links */}
        {sections.includes("identifiers") && filteredIdentifiers.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 12px", fontSize: "8.5pt", color: "#475569", marginTop: "6px", borderTop: "1px solid #e2e8f0", paddingTop: "5px" }}>
            {filteredIdentifiers.map((id) => (
              <span key={id.id}>
                <strong>{id.identifier_type}:</strong>{" "}
                {id.url ? (
                  <a href={id.url} style={{ color: "#1e40af", textDecoration: "none" }}>{id.identifier_value}</a>
                ) : (
                  id.identifier_value
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── SECÇÕES DINÂMICAS ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
        {sections.map((sectionId) => {
          switch (sectionId) {
            // ── RESUMO ──
            case "summary":
              if (!summaryText) return null;
              return (
                <section key="summary" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "8px" }}>
                    Resumo Profissional
                  </h2>
                  <p style={{ color: "#374151", textAlign: "justify", margin: 0 }}>{summaryText}</p>
                </section>
              );

            // ── EXPERIÊNCIA ──
            case "experience":
              if (filteredExperiences.length === 0) return null;
              return (
                <section key="experience" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Experiência Profissional
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredExperiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                          <strong style={{ fontSize: "10pt", color: "#0f172a" }}>
                            {exp.position}
                            {exp.organization && <span style={{ fontWeight: 500 }}> — {exp.organization}</span>}
                          </strong>
                          <span style={{ fontSize: "8.5pt", color: "#64748b", whiteSpace: "nowrap" }}>
                            {fmtDate(exp.start_date)}{" "}–{" "}
                            {exp.is_current ? "Presente" : fmtDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.location && <p style={{ fontSize: "8.5pt", color: "#64748b", margin: "2px 0 0" }}>{exp.location}</p>}
                        {exp.description && <p style={{ color: "#374151", margin: "4px 0 0", fontSize: "9.5pt" }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ── EDUCAÇÃO ──
            case "education":
              if (filteredEducation.length === 0) return null;
              return (
                <section key="education" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Educação e Formação Académica
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredEducation.map((edu) => (
                      <div key={edu.id} className="resume-entry">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                          <strong style={{ fontSize: "10pt", color: "#0f172a" }}>
                            {edu.degree}{edu.course ? ` em ${edu.course}` : ""}
                          </strong>
                          <span style={{ fontSize: "8.5pt", color: "#64748b", whiteSpace: "nowrap" }}>
                            {edu.start_year ?? ""}
                            {edu.start_year && edu.end_year ? " – " : ""}
                            {edu.end_year ?? (edu.start_year ? "Presente" : "")}
                          </span>
                        </div>
                        <p style={{ fontSize: "9pt", color: "#374151", fontWeight: 500, margin: "2px 0 0" }}>
                          {edu.institution}{edu.institution_country ? `, ${edu.institution_country}` : ""}
                        </p>
                        {edu.description && <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "9pt" }}>{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ── COMPETÊNCIAS ──
            case "skills":
              if (filteredSkills.length === 0) return null;
              return (
                <section key="skills" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "8px" }}>
                    Competências
                  </h2>
                  <p style={{ color: "#374151", lineHeight: "1.8" }}>
                    {filteredSkills.map((s) => s.name).join(" • ")}
                  </p>
                </section>
              );

            // ── PROJETOS ──
            case "projects":
              if (filteredProjects.length === 0) return null;
              return (
                <section key="projects" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Projetos & Investigações
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredProjects.map((p) => (
                      <div key={p.id} className="resume-entry">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px" }}>
                          <strong style={{ color: "#0f172a" }}>{p.title}</strong>
                          {p.role && <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{p.role}</span>}
                        </div>
                        {p.description && <p style={{ color: "#374151", margin: "4px 0 0", fontSize: "9pt" }}>{p.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            // ── PUBLICAÇÕES ──
            case "publications":
              if (filteredPublications.length === 0) return null;
              return (
                <section key="publications" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Publicações Científicas
                  </h2>
                  <ul style={{ listStyle: "disc", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {filteredPublications.map((pub) => (
                      <li key={pub.id} className="resume-entry" style={{ color: "#374151", fontSize: "9pt" }}>
                        <strong style={{ color: "#0f172a" }}>{pub.title}</strong>
                        {pub.journal && <em> — {pub.journal}</em>}
                        {pub.year && ` (${pub.year})`}
                        {pub.doi && (
                          <>
                            {" "}[DOI:{" "}
                            <a href={`https://doi.org/${pub.doi}`} style={{ color: "#1e40af" }}>{pub.doi}</a>]
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            // ── CERTIFICAÇÕES ──
            case "certifications":
              if (filteredCertifications.length === 0) return null;
              return (
                <section key="certifications" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Certificações
                  </h2>
                  <ul style={{ listStyle: "disc", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {filteredCertifications.map((c) => (
                      <li key={c.id} className="resume-entry" style={{ color: "#374151", fontSize: "9pt" }}>
                        <strong style={{ color: "#0f172a" }}>{c.name}</strong> — {c.issuer}
                        {c.issue_date && ` (${c.issue_date})`}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            // ── PRÉMIOS ──
            case "awards":
              if (filteredAwards.length === 0) return null;
              return (
                <section key="awards" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "10px" }}>
                    Prémios & Distinções
                  </h2>
                  <ul style={{ listStyle: "disc", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {filteredAwards.map((a) => (
                      <li key={a.id} className="resume-entry" style={{ color: "#374151", fontSize: "9pt" }}>
                        <strong style={{ color: "#0f172a" }}>{a.title}</strong> — {a.issuer}
                        {a.year && ` (${a.year})`}
                      </li>
                    ))}
                  </ul>
                </section>
              );

            // ── IDIOMAS ──
            case "languages":
              if (filteredLanguages.length === 0) return null;
              return (
                <section key="languages" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid #cbd5e1", paddingBottom: "3px", marginBottom: "8px" }}>
                    Idiomas
                  </h2>
                  <p style={{ color: "#374151" }}>
                    {filteredLanguages.map((l) => `${l.name} (${l.proficiency})`).join(" • ")}
                  </p>
                </section>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
