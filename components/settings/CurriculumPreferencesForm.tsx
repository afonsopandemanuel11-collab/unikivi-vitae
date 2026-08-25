"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TEMPLATES = [
  { value: "UNIKIVI_CLASSIC", label: "UNIKIVI Classic (ATS)" },
  { value: "EXECUTIVE", label: "UNIKIVI Professional" },
  { value: "ACADEMIC_COMPACT", label: "UNIKIVI Academic" },
  { value: "MODERN_EDITORIAL", label: "UNIKIVI Modern" },
  { value: "CIENCIA_VITAE", label: "Ciencia Vitae" },
];

const COLORS = ["#00113a", "#006970", "#d37758", "#2a4386"];

export default function CurriculumPreferencesForm({ profile }: { profile: any }) {
  const defaults = profile.cv_preferences ?? {};
  const [template, setTemplate] = useState(defaults.default_template ?? "UNIKIVI_CLASSIC");
  const [color, setColor] = useState(defaults.primary_color ?? COLORS[0]);
  const [format, setFormat] = useState(defaults.format ?? "A4");
  const [orientation, setOrientation] = useState(defaults.orientation ?? "PORTRAIT");
  const [filenamePattern, setFilenamePattern] = useState(defaults.filename_pattern ?? "CV_{Nome}");
  const [includeLinks, setIncludeLinks] = useState(defaults.include_links ?? true);
  const [includeContacts, setIncludeContacts] = useState(defaults.include_contacts ?? true);
  const [includePhoto, setIncludePhoto] = useState(defaults.include_photo ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({
        cv_preferences: {
          default_template: template,
          primary_color: color,
          format,
          orientation,
          filename_pattern: filenamePattern,
          include_links: includeLinks,
          include_contacts: includeContacts,
          include_photo: includePhoto,
        },
      })
      .eq("user_id", profile.user_id);

    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <h2 className="font-headline-lg text-headline-lg text-primary mb-2 text-2xl">
        Preferencias de Curriculo
      </h2>
      <p className="text-sm text-on-surface-variant mb-8 max-w-xl">
        Configure a apresentacao visual e os dados incluidos por defeito
        quando exporta ou partilha o seu curriculo academico.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl border border-outline-variant p-6">
          <h3 className="font-headline-md text-headline-md text-primary mb-6 text-lg">
            Apresentacao Visual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Modelo Padrao
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Cor Principal
              </label>
              <div className="flex gap-2 items-center pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c ? "border-primary scale-110" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Formato
              </label>
              <div className="flex bg-surface-container-low rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFormat("A4")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    format === "A4" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  A4
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("LETTER")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    format === "LETTER" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  US Letter
                </button>
              </div>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Orientacao
              </label>
              <div className="flex bg-surface-container-low rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setOrientation("PORTRAIT")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    orientation === "PORTRAIT" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  Retrato
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation("LANDSCAPE")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    orientation === "LANDSCAPE" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  Paisagem
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <h3 className="font-headline-md text-headline-md text-primary mb-4 text-lg">
            Exportacao
          </h3>

          <div className="mb-6">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
              Nome do Ficheiro Padrao
            </label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={filenamePattern}
                onChange={(e) => setFilenamePattern(e.target.value)}
                className="flex-1 border border-outline-variant rounded-lg p-2 text-sm focus:outline-none focus:border-secondary transition-colors"
              />
              <span className="text-sm text-on-surface-variant">.pdf</span>
            </div>
            <p className="text-xs text-outline mt-1">
              Variaveis disponiveis: {"{Nome}"}, {"{Ano}"}, {"{Mes}"}
            </p>
          </div>

          <div className="space-y-4">
            <ToggleRow
              label="Incluir links clicaveis"
              description="Mantem hiperligacoes para publicacoes e DOIs."
              checked={includeLinks}
              onChange={setIncludeLinks}
            />
            <ToggleRow
              label="Incluir contactos"
              description="Email e telefone visiveis no cabecalho."
              checked={includeContacts}
              onChange={setIncludeContacts}
            />
            <ToggleRow
              label="Incluir foto"
              description="Adiciona a foto de perfil ao formato europeu."
              checked={includePhoto}
              onChange={setIncludePhoto}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        {saved ? (
          <p className="text-secondary text-sm">Alteracoes guardadas.</p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {saving ? "A guardar..." : "Guardar Alteracoes"}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full flex items-center transition-colors flex-shrink-0 mt-0.5 ${
          checked ? "bg-primary justify-end" : "bg-surface-container-high justify-start"
        }`}
      >
        <span className="w-5 h-5 bg-white rounded-full mx-0.5 shadow-sm" />
      </button>
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}