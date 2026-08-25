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

export default function ModernTemplate({ data, snapshot }: TemplateProps) {
  const { profile, education, experiences, skills, projects, publications, certifications, awards, languages, identifiers } = data;
  const sections = snapshot.sections || [];
  const selected = snapshot.selected_items || {};
  const settings = snapshot.settings || {};

  const primaryColor = settings.primary_color || "#0f766e"; // Teal moderno por defeito

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

  const itemGap = settings.density === "compact" ? "10px" : settings.density === "spacious" ? "22px" : "14px";
  const sectionGap = settings.density === "compact" ? "18px" : settings.density === "spacious" ? "34px" : "22px";

  // Secções do sidebar direito (coluna de apoio)
  const SIDEBAR_SECTIONS = new Set(["skills", "languages", "identifiers", "certifications"]);
  const MAIN_SECTIONS = sections.filter((s) => !SIDEBAR_SECTIONS.has(s));
  const sidebarSections = sections.filter((s) => SIDEBAR_SECTIONS.has(s));

  function Chip({ label }: { label: string }) {
    return (
      <span
        style={{
          display: "inline-block",
          border: `1px solid ${primaryColor}50`,
          color: primaryColor,
          fontSize: "7.5pt",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "99px",
          backgroundColor: `${primaryColor}08`,
        }}
      >
        {label}
      </span>
    );
  }

  function SectionTitle({ label }: { label: string }) {
    return (
      <div
        className="resume-section-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}
      >
        <div style={{ width: "14px", height: "2px", backgroundColor: primaryColor, borderRadius: "2px" }} />
        <h2 style={{ fontSize: "8.5pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: primaryColor, margin: 0 }}>
          {label}
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily,
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        fontSize: "9.5pt",
        lineHeight: "1.5",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── CABEÇALHO MODERNO com banda de cor lateral ── */}
      <header
        style={{
          display: "flex",
          alignItems: "stretch",
          minHeight: "52mm",
        }}
      >
        {/* Banda de cor à esquerda */}
        <div
          style={{
            width: "5mm",
            backgroundColor: primaryColor,
            flexShrink: 0,
          }}
        />

        {/* Conteúdo do cabeçalho */}
        <div
          style={{
            flex: 1,
            padding: "16mm 16mm 14mm 12mm",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            backgroundColor: "#f8fafc",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22pt", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
              {displayName}
            </h1>
            {professionalTitle && (
              <p style={{ fontSize: "10.5pt", color: primaryColor, fontWeight: 600, marginTop: "3px" }}>
                {professionalTitle}
              </p>
            )}
            {settings.show_contacts !== false && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", fontSize: "8pt", color: "#64748b", marginTop: "10px" }}>
                {profile.email && <span>✉ {profile.email}</span>}
                {profile.phone && <span>📞 {profile.phone}</span>}
                {(profile.city || profile.country) && (
                  <span>📍 {[profile.city, profile.country || "Angola"].filter(Boolean).join(", ")}</span>
                )}
              </div>
            )}

            {/* Links rápidos modernos */}
            {sections.includes("identifiers") && filteredIdentifiers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "10px" }}>
                {filteredIdentifiers.slice(0, 4).map((ident) => (
                  <span key={ident.id} style={{ fontSize: "7.5pt", backgroundColor: `${primaryColor}12`, color: primaryColor, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                    {ident.identifier_type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {settings.show_photo !== false && profile.photo_url && (
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${primaryColor}`,
                flexShrink: 0,
              }}
            >
              <img src={profile.photo_url} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </div>
      </header>

      {/* ── GRID PRINCIPAL ── */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 62mm",
        }}
      >
        {/* ── COLUNA PRINCIPAL ── */}
        <div
          style={{
            borderLeft: `5mm solid ${primaryColor}`,
            padding: "12mm 12mm 12mm 10mm",
            display: "flex",
            flexDirection: "column",
            gap: sectionGap,
          }}
        >
          {MAIN_SECTIONS.map((sectionId) => {
            switch (sectionId) {
              case "summary":
                if (!summaryText) return null;
                return (
                  <section key="summary" className="resume-section">
                    <SectionTitle label="Sobre Mim" />
                    <p style={{ color: "#374151", margin: 0 }}>{summaryText}</p>
                  </section>
                );

              case "experience":
                if (filteredExperiences.length === 0) return null;
                return (
                  <section key="experience" className="resume-section">
                    <SectionTitle label="Experiência" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredExperiences.map((exp) => (
                        <div key={exp.id} className="resume-entry">
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                            <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{exp.position}</strong>
                            <span
                              style={{
                                fontSize: "7.5pt",
                                backgroundColor: `${primaryColor}12`,
                                color: primaryColor,
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {fmtDate(exp.start_date)} → {exp.is_current ? "Hoje" : fmtDate(exp.end_date)}
                            </span>
                          </div>
                          <p style={{ fontSize: "9pt", fontWeight: 600, color: primaryColor, margin: "2px 0 0" }}>
                            {exp.organization}{exp.location ? ` — ${exp.location}` : ""}
                          </p>
                          {exp.description && <p style={{ color: "#374151", margin: "5px 0 0", fontSize: "9pt" }}>{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "education":
                if (filteredEducation.length === 0) return null;
                return (
                  <section key="education" className="resume-section">
                    <SectionTitle label="Educação" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredEducation.map((edu) => (
                        <div key={edu.id} className="resume-entry">
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                            <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{edu.degree}{edu.course ? ` em ${edu.course}` : ""}</strong>
                            <span style={{ fontSize: "7.5pt", color: "#64748b" }}>
                              {edu.start_year ?? ""}{edu.start_year && edu.end_year ? " – " : ""}{edu.end_year ?? (edu.start_year ? "Presente" : "")}
                            </span>
                          </div>
                          <p style={{ fontSize: "9pt", color: "#374151", margin: "2px 0 0" }}>
                            {edu.institution}{edu.institution_country ? `, ${edu.institution_country}` : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "projects":
                if (filteredProjects.length === 0) return null;
                return (
                  <section key="projects" className="resume-section">
                    <SectionTitle label="Projetos" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredProjects.map((p) => (
                        <div key={p.id} className="resume-entry">
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", alignItems: "baseline" }}>
                            <strong style={{ color: "#0f172a" }}>{p.title}</strong>
                            {p.role && <Chip label={p.role} />}
                          </div>
                          {p.description && <p style={{ color: "#374151", margin: "5px 0 0", fontSize: "9pt" }}>{p.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "publications":
                if (filteredPublications.length === 0) return null;
                return (
                  <section key="publications" className="resume-section">
                    <SectionTitle label="Publicações" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {filteredPublications.map((pub) => (
                        <div key={pub.id} className="resume-entry" style={{ fontSize: "9pt", color: "#374151" }}>
                          <strong style={{ color: "#0f172a" }}>{pub.title}</strong>
                          {pub.journal && <em> — {pub.journal}</em>}
                          {pub.year && ` (${pub.year})`}
                          {pub.doi && (
                            <a href={`https://doi.org/${pub.doi}`} style={{ color: primaryColor, marginLeft: "4px", fontSize: "8pt" }}>
                              doi:{pub.doi}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "awards":
                if (filteredAwards.length === 0) return null;
                return (
                  <section key="awards" className="resume-section">
                    <SectionTitle label="Prémios" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {filteredAwards.map((a) => (
                        <div key={a.id} className="resume-entry" style={{ fontSize: "9pt" }}>
                          <strong style={{ color: "#0f172a" }}>{a.title}</strong>
                          <span style={{ color: "#64748b" }}> — {a.issuer}{a.year ? ` (${a.year})` : ""}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* ── SIDEBAR DIREITO ── */}
        <div
          style={{
            backgroundColor: "#f1f5f9",
            padding: "12mm 10mm",
            display: "flex",
            flexDirection: "column",
            gap: sectionGap,
          }}
        >
          {sidebarSections.map((sectionId) => {
            switch (sectionId) {
              case "skills":
                if (filteredSkills.length === 0) return null;
                return (
                  <section key="skills" className="resume-section">
                    <SectionTitle label="Competências" />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {filteredSkills.map((s) => (
                        <Chip key={s.id} label={s.name} />
                      ))}
                    </div>
                  </section>
                );

              case "languages":
                if (filteredLanguages.length === 0) return null;
                return (
                  <section key="languages" className="resume-section">
                    <SectionTitle label="Idiomas" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {filteredLanguages.map((l) => (
                        <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "8.5pt" }}>
                          <span style={{ fontWeight: 600, color: "#0f172a" }}>{l.name}</span>
                          <span style={{ color: "#64748b", fontSize: "7.5pt" }}>{l.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "certifications":
                if (filteredCertifications.length === 0) return null;
                return (
                  <section key="certifications" className="resume-section">
                    <SectionTitle label="Certificações" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {filteredCertifications.map((c) => (
                        <div key={c.id} className="resume-entry" style={{ fontSize: "8pt" }}>
                          <p style={{ fontWeight: 700, color: "#0f172a", margin: 0 }}>{c.name}</p>
                          <p style={{ color: "#64748b", margin: "1px 0 0" }}>{c.issuer}</p>
                          {c.issue_date && <p style={{ color: "#94a3b8", margin: "1px 0 0", fontSize: "7.5pt" }}>{c.issue_date}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "identifiers":
                if (filteredIdentifiers.length === 0) return null;
                return (
                  <section key="identifiers" className="resume-section">
                    <SectionTitle label="Links & Perfis" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "7.5pt" }}>
                      {filteredIdentifiers.map((ident) => (
                        <div key={ident.id}>
                          <p style={{ fontWeight: 700, color: "#0f172a", margin: 0 }}>{ident.identifier_type}</p>
                          {ident.url ? (
                            <a href={ident.url} style={{ color: primaryColor, wordBreak: "break-all" }}>{ident.identifier_value}</a>
                          ) : (
                            <p style={{ color: "#64748b", margin: 0, wordBreak: "break-all" }}>{ident.identifier_value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
