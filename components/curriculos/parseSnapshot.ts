import type { CurriculumSnapshot } from "@/app/dashboard/curriculos/actions";

const TEMPLATES = ["UNIKIVI_CLASSIC", "MODERN_EDITORIAL", "CIENCIA_VITAE", "EXECUTIVE", "ACADEMIC_COMPACT"] as const;
const ITEM_KEYS = ["experiences", "education", "skills", "projects", "publications", "certifications", "awards", "languages", "identifiers"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseCurriculumSnapshot(value: unknown, fallback: CurriculumSnapshot): CurriculumSnapshot {
  if (!isRecord(value)) return fallback;
  if (!Array.isArray(value.sections) || !value.sections.every((section) => typeof section === "string")) return fallback;
  if (!isRecord(value.selected_items) || !isRecord(value.settings)) return fallback;

  const selectedItems: CurriculumSnapshot["selected_items"] = {};
  for (const key of ITEM_KEYS) {
    const items = value.selected_items[key];
    if (Array.isArray(items) && items.every((item) => typeof item === "string")) {
      selectedItems[key] = items;
    }
  }

  const density = value.settings.density;
  const layout = value.settings.layout;
  return {
    template: typeof value.template === "string" && TEMPLATES.includes(value.template as (typeof TEMPLATES)[number])
      ? value.template
      : fallback.template,
    objective: typeof value.objective === "string" ? value.objective : fallback.objective,
    custom_title: typeof value.custom_title === "string" ? value.custom_title : fallback.custom_title,
    custom_summary: typeof value.custom_summary === "string" ? value.custom_summary : fallback.custom_summary,
    sections: value.sections,
    selected_items: selectedItems,
    settings: {
      primary_color: typeof value.settings.primary_color === "string" ? value.settings.primary_color : fallback.settings.primary_color,
      font: typeof value.settings.font === "string" ? value.settings.font : fallback.settings.font,
      density: density === "compact" || density === "normal" || density === "spacious" ? density : fallback.settings.density,
      layout: layout === "single" || layout === "two-column" ? layout : fallback.settings.layout,
      show_photo: typeof value.settings.show_photo === "boolean" ? value.settings.show_photo : fallback.settings.show_photo,
      show_contacts: typeof value.settings.show_contacts === "boolean" ? value.settings.show_contacts : fallback.settings.show_contacts,
    },
  };
}
