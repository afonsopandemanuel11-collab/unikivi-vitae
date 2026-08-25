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

export default function ProfessionalTemplate({ data, snapshot }: TemplateProps) {
  const { profile, education, experiences, skills, projects, publications, certifications, awards, languages, identifiers } = data;
  const sections = snapshot.sections || [];
  const selected = snapshot.selected_items || {};
  const settings = snapshot.settings || {};

  const primaryColor = settings.primary_color || "#00113A";

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

  // Secções laterais (sidebar direito)
  const SIDEBAR_SECTIONS = new Set(["skills", "certifications", "awards", "languages", "identifiers"]);
  // Secções principais (coluna esquerda)
  const MAIN_SECTIONS = sections.filter((s) => !SIDEBAR_SECTIONS.has(s));
  const sidebarSections = sections.filter((s) => SIDEBAR_SECTIONS.has(s));

  function SectionTitle({ label }: { label: string }) {
    return (
      <h2
        className="resume-section-title"
        style={{
          fontSize: "8.5pt",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: primaryColor,
          borderBottom: `1.5px solid ${primaryColor}22`,
          paddingBottom: "3px",
          marginBottom: "10px",
        }}
      >
        {label}
      </h2>
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
      {/* ── CABEÇALHO EXECUTIVO com cor de destaque ── */}
      <header
        style={{
          backgroundColor: primaryColor,
          color: "#ffffff",
          padding: "20mm 18mm 14mm",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24pt", fontWeight: 700, letterSpacing: "0.01em", margin: 0 }}>
            {displayName}
          </h1>
          {professionalTitle && (
            <p style={{ fontSize: "10pt", fontWeight: 500, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
              {professionalTitle}
            </p>
          )}
          {settings.show_contacts !== false && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: "8.5pt", opacity: 0.75, marginTop: "10px" }}>
              {profile.email && <span>✉ {profile.email}</span>}
              {profile.phone && <span>📞 {profile.phone}</span>}
              {(profile.city || profile.country) && (
                <span>📍 {[profile.city, profile.country || "Angola"].filter(Boolean).join(", ")}</span>
              )}
            </div>
          )}
        </div>
        {settings.show_photo !== false && profile.photo_url && (
          <div
            style={{
              width: "60mm",
              height: "60mm",
              borderRadius: "4px",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.25)",
              flexShrink: 0,
            }}
          >
            <img
              src={profile.photo_url}
              alt={displayName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </header>

      {/* ── GRID PRINCIPAL: 2 colunas ── */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 68mm",
          gap: "0",
        }}
      >
        {/* ── COLUNA ESQUERDA: conteúdo principal ── */}
        <div style={{ padding: "14mm 12mm 14mm 18mm", display: "flex", flexDirection: "column", gap: sectionGap }}>
          {MAIN_SECTIONS.map((sectionId) => {
            switch (sectionId) {
              case "summary":
                if (!summaryText) return null;
                return (
                  <section key="summary" className="resume-section">
                    <SectionTitle label="Perfil Profissional" />
                    <p style={{ color: "#374151", textAlign: "justify", margin: 0 }}>{summaryText}</p>
                  </section>
                );

              case "experience":
                if (filteredExperiences.length === 0) return null;
                return (
                  <section key="experience" className="resume-section">
                    <SectionTitle label="Experiência Profissional" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredExperiences.map((exp) => (
                        <div key={exp.id} className="resume-entry" style={{ paddingLeft: "12px", borderLeft: `2px solid ${primaryColor}30` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", alignItems: "baseline" }}>
                            <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{exp.position}</strong>
                            <span style={{ fontSize: "8pt", color: "#64748b", whiteSpace: "nowrap" }}>
                              {fmtDate(exp.start_date)} – {exp.is_current ? "Presente" : fmtDate(exp.end_date)}
                            </span>
                          </div>
                          <p style={{ fontSize: "9pt", fontWeight: 600, color: primaryColor, margin: "2px 0 0" }}>
                            {exp.organization}{exp.location ? ` · ${exp.location}` : ""}
                          </p>
                          {exp.description && (
                            <p style={{ color: "#374151", margin: "5px 0 0", fontSize: "9pt" }}>{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "education":
                if (filteredEducation.length === 0) return null;
                return (
                  <section key="education" className="resume-section">
                    <SectionTitle label="Educação e Formação" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredEducation.map((edu) => (
                        <div key={edu.id} className="resume-entry" style={{ paddingLeft: "12px", borderLeft: `2px solid ${primaryColor}30` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", alignItems: "baseline" }}>
                            <strong style={{ fontSize: "10pt", color: "#0f172a" }}>{edu.degree}{edu.course ? ` em ${edu.course}` : ""}</strong>
                            <span style={{ fontSize: "8pt", color: "#64748b", whiteSpace: "nowrap" }}>
                              {edu.start_year ?? ""}{edu.start_year && edu.end_year ? " – " : ""}{edu.end_year ?? (edu.start_year ? "Presente" : "")}
                            </span>
                          </div>
                          <p style={{ fontSize: "9pt", color: "#374151", fontWeight: 500, margin: "2px 0 0" }}>
                            {edu.institution}{edu.institution_country ? `, ${edu.institution_country}` : ""}
                          </p>
                          {edu.description && <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "8.5pt" }}>{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "projects":
                if (filteredProjects.length === 0) return null;
                return (
                  <section key="projects" className="resume-section">
                    <SectionTitle label="Projetos em Destaque" />
                    <div style={{ display: "flex", flexDirection: "column", gap: itemGap }}>
                      {filteredProjects.map((p) => (
                        <div key={p.id} className="resume-entry">
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px", alignItems: "baseline" }}>
                            <strong style={{ color: "#0f172a" }}>{p.title}</strong>
                            <span style={{ fontSize: "8pt", color: primaryColor, fontWeight: 600 }}>{p.role}</span>
                          </div>
                          {p.description && <p style={{ color: "#374151", margin: "4px 0 0", fontSize: "9pt" }}>{p.description}</p>}
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {filteredPublications.map((pub) => (
                        <div key={pub.id} className="resume-entry" style={{ paddingLeft: "12px", borderLeft: `2px solid ${primaryColor}20`, fontSize: "9pt", color: "#374151" }}>
                          <strong style={{ color: "#0f172a" }}>{pub.title}</strong>
                          {pub.journal && <em> — {pub.journal}</em>}
                          {pub.year && ` (${pub.year})`}
                          {pub.doi && <span style={{ color: "#64748b" }}> · DOI: {pub.doi}</span>}
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

        {/* ── COLUNA DIREITA: sidebar ── */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderLeft: `3px solid ${primaryColor}15`,
            padding: "14mm 12mm 14mm 12mm",
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {filteredSkills.map((s) => (
                        <div
                          key={s.id}
                          style={{
                            fontSize: "8.5pt",
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            color: "#334155",
                          }}
                        >
                          {s.name}
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
                        <div key={c.id} className="resume-entry" style={{ fontSize: "8.5pt" }}>
                          <p style={{ fontWeight: 700, color: "#0f172a", margin: 0 }}>{c.name}</p>
                          <p style={{ color: "#64748b", margin: "1px 0 0" }}>{c.issuer}{c.issue_date ? ` · ${c.issue_date}` : ""}</p>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {filteredAwards.map((a) => (
                        <div key={a.id} className="resume-entry" style={{ fontSize: "8.5pt" }}>
                          <p style={{ fontWeight: 700, color: "#0f172a", margin: 0 }}>{a.title}</p>
                          <p style={{ color: "#64748b", margin: "1px 0 0" }}>{a.issuer}{a.year ? ` · ${a.year}` : ""}</p>
                        </div>
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
                          <span style={{ color: "#64748b" }}>{l.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "identifiers":
                if (filteredIdentifiers.length === 0) return null;
                return (
                  <section key="identifiers" className="resume-section">
                    <SectionTitle label="Perfis & Links" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "8pt" }}>
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
