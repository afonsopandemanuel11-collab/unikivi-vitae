"use client";

import { TemplateProps } from "../types";
import ClassicTemplate from "./ClassicTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import AcademicTemplate from "./AcademicTemplate";
import ModernTemplate from "./ModernTemplate";

export default function TemplateRenderer({ data, snapshot }: TemplateProps) {
  const templateKey = snapshot.template || "UNIKIVI_CLASSIC";

  switch (templateKey) {
    case "EXECUTIVE":
    case "PROFESSIONAL":
      return <ProfessionalTemplate data={data} snapshot={snapshot} />;

    case "ACADEMIC_COMPACT":
    case "ACADEMIC":
      return <AcademicTemplate data={data} snapshot={snapshot} />;

    case "MODERN_EDITORIAL":
    case "MODERN":
      return <ModernTemplate data={data} snapshot={snapshot} />;

    case "UNIKIVI_CLASSIC":
    case "CLASSIC":
    default:
      return <ClassicTemplate data={data} snapshot={snapshot} />;
  }
}
