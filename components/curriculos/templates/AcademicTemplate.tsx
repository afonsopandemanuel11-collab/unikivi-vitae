"use client";

import { TemplateProps } from "../types";

function fmtDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("pt-PT", { month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function AcademicTemplate({ data, snapshot }: TemplateProps) {
  const { profile, education, experiences, skills, projects, publications, certifications, awards, languages, identifiers } = data;
  const sections = snapshot.sections || [];
  const selected = snapshot.selected_items || {};
  const settings = snapshot.settings || {};

  const primaryColor = settings.primary_color || "#1e3a5f";

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

  // Académico usa serif por defeito
  const fontFamily =
    settings.font === "JetBrains Mono"
      ? "'JetBrains Mono', monospace"
      : settings.font === "Inter"
      ? "Inter, system-ui, sans-serif"
      : "Georgia, 'Times New Roman', serif";

  const itemGap = settings.density === "compact" ? "10px" : settings.density === "spacious" ? "24px" : "16px";
  const sectionGap = settings.density === "compact" ? "18px" : settings.density === "spacious" ? "36px" : "24px";

  return (
    <div
      style={{
        fontFamily,
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 20mm",
        backgroundColor: "#ffffff",
        color: "#1a2332",
        fontSize: "10pt",
        lineHeight: "1.55",
        boxSizing: "border-box",
      }}
    >
      {/* ── CABEÇALHO ACADÉMICO FORMAL ── */}
      <header style={{ textAlign: "center", marginBottom: sectionGap, paddingBottom: "10px", borderBottom: `1.5px solid ${primaryColor}` }}>
        <h1 style={{ fontSize: "20pt", fontWeight: 700, letterSpacing: "0.03em", margin: 0, color: "#0f172a" }}>
          {displayName}
        </h1>
        {professionalTitle && (
          <p style={{ fontSize: "10.5pt", fontStyle: "italic", color: "#374151", marginTop: "4px" }}>
            {professionalTitle}
          </p>
        )}

        {/* Linha de contactos centrada */}
        {settings.show_contacts !== false && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 16px", fontSize: "8.5pt", color: "#64748b", marginTop: "8px" }}>
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>|</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {(profile.city || profile.country) && <span>|</span>}
            {(profile.city || profile.country) && (
              <span>{[profile.city, profile.country || "Angola"].filter(Boolean).join(", ")}</span>
            )}
            {profile.faculty && <><span>|</span><span>{profile.faculty.name}</span></>}
          </div>
        )}

        {/* Identificadores académicos */}
        {sections.includes("identifiers") && filteredIdentifiers.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 14px", fontSize: "8pt", color: "#374151", marginTop: "6px" }}>
            {filteredIdentifiers.map((ident) => (
              <span key={ident.id}>
                <strong>{ident.identifier_type}:</strong>{" "}
                {ident.url ? (
                  <a href={ident.url} style={{ color: primaryColor }}>{ident.identifier_value}</a>
                ) : (
                  ident.identifier_value
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── SECÇÕES ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "summary":
              if (!summaryText) return null;
              return (
                <section key="summary" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "8px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Sumário
                  </h2>
                  <p style={{ color: "#374151", textAlign: "justify", fontStyle: "italic", margin: 0 }}>{summaryText}</p>
                </section>
              );

            case "education":
              if (filteredEducation.length === 0) return null;
              return (
                <section key="education" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "10px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Formação Académica
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredEducation.map((edu) => (
                      <div key={edu.id} className="resume-entry">
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                          <strong style={{ fontSize: "10.5pt", color: "#0f172a" }}>
                            {edu.degree}{edu.course ? ` em ${edu.course}` : ""}
                          </strong>
                          <span style={{ fontSize: "8.5pt", color: "#64748b", fontStyle: "italic" }}>
                            {edu.start_year ?? ""}{edu.start_year && edu.end_year ? "–" : ""}{edu.end_year ?? (edu.start_year ? "Presente" : "")}
                          </span>
                        </div>
                        <p style={{ fontSize: "9.5pt", color: "#374151", margin: "2px 0 0" }}>
                          <em>{edu.institution}{edu.institution_country ? `, ${edu.institution_country}` : ""}</em>
                        </p>
                        {edu.description && <p style={{ color: "#64748b", margin: "5px 0 0", fontSize: "9pt" }}>{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "experience":
              if (filteredExperiences.length === 0) return null;
              return (
                <section key="experience" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "10px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Experiência Profissional e Docente
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredExperiences.map((exp) => (
                      <div key={exp.id} className="resume-entry">
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                          <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{exp.position}</strong>
                          <span style={{ fontSize: "8.5pt", color: "#64748b", fontStyle: "italic" }}>
                            {fmtDate(exp.start_date)} – {exp.is_current ? "Presente" : fmtDate(exp.end_date)}
                          </span>
                        </div>
                        <p style={{ fontSize: "9.5pt", color: "#374151", margin: "2px 0 0" }}>
                          <em>{exp.organization}{exp.location ? `, ${exp.location}` : ""}</em>
                        </p>
                        {exp.description && <p style={{ color: "#4b5563", margin: "5px 0 0", fontSize: "9pt" }}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "publications":
              if (filteredPublications.length === 0) return null;
              return (
                <section key="publications" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "10px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Publicações Científicas
                  </h2>
                  <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {filteredPublications.map((pub, idx) => (
                      <li key={pub.id} className="resume-entry" style={{ fontSize: "9pt", color: "#374151" }}>
                        <span style={{ color: "#64748b", fontWeight: 600 }}>[{idx + 1}]</span>{" "}
                        <strong style={{ color: "#0f172a" }}>{pub.title}.</strong>
                        {pub.journal && <em> {pub.journal}.</em>}
                        {pub.year && <span> {pub.year}.</span>}
                        {pub.doi && (
                          <>
                            {" "}
                            <a href={`https://doi.org/${pub.doi}`} style={{ color: primaryColor, textDecoration: "none" }}>
                              doi:{pub.doi}
                            </a>
                          </>
                        )}
                        {pub.url && !pub.doi && (
                          <>
                            {" "}
                            <a href={pub.url} style={{ color: primaryColor, textDecoration: "none" }}>
                              [Link]
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              );

            case "projects":
              if (filteredProjects.length === 0) return null;
              return (
                <section key="projects" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "10px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Projetos de Investigação e Desenvolvimento
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                    {filteredProjects.map((p) => (
                      <div key={p.id} className="resume-entry">
                        <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{p.title}</strong>
                        {p.role && <span style={{ fontSize: "8.5pt", color: "#64748b", fontStyle: "italic" }}> · {p.role}</span>}
                        {p.description && <p style={{ color: "#4b5563", margin: "4px 0 0", fontSize: "9pt" }}>{p.description}</p>}
                        {p.funding_source && <p style={{ fontSize: "8.5pt", color: "#64748b", margin: "2px 0 0" }}>Financiamento: {p.funding_source}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "skills":
              if (filteredSkills.length === 0) return null;
              return (
                <section key="skills" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "8px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Competências & Áreas de Investigação
                  </h2>
                  <p style={{ color: "#374151", lineHeight: "1.8" }}>
                    {filteredSkills.map((s) => s.name).join(" · ")}
                  </p>
                </section>
              );

            case "certifications":
              if (filteredCertifications.length === 0) return null;
              return (
                <section key="certifications" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "8px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Certificações & Formação Complementar
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {filteredCertifications.map((c) => (
                      <div key={c.id} className="resume-entry" style={{ fontSize: "9pt" }}>
                        <strong style={{ color: "#0f172a" }}>{c.name}</strong>
                        <span style={{ color: "#64748b" }}> — {c.issuer}{c.issue_date ? ` (${c.issue_date})` : ""}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "awards":
              if (filteredAwards.length === 0) return null;
              return (
                <section key="awards" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "8px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Distinções & Prémios
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {filteredAwards.map((a) => (
                      <div key={a.id} className="resume-entry" style={{ fontSize: "9pt" }}>
                        <strong style={{ color: "#0f172a" }}>{a.title}</strong>
                        <span style={{ color: "#64748b" }}> — {a.issuer}{a.year ? ` (${a.year})` : ""}</span>
                        {a.description && <p style={{ color: "#64748b", margin: "2px 0 0", fontStyle: "italic" }}>{a.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );

            case "languages":
              if (filteredLanguages.length === 0) return null;
              return (
                <section key="languages" className="resume-section">
                  <h2 className="resume-section-title" style={{ fontSize: "10pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, marginBottom: "8px", borderBottom: `1px solid ${primaryColor}40`, paddingBottom: "3px" }}>
                    Línguas
                  </h2>
                  <p style={{ color: "#374151" }}>
                    {filteredLanguages.map((l) => `${l.name} (${l.proficiency})`).join(" · ")}
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
