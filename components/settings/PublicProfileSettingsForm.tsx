"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FIELDS = [
  { key: "photo", label: "Fotografia de Perfil", icon: "account_circle" },
  { key: "institutional_email", label: "Email Institucional", icon: "mail" },
  { key: "phone", label: "Telefone de Contacto", icon: "call" },
  { key: "education", label: "Formacao Academica", icon: "school" },
  { key: "experience", label: "Experiencia Profissional", icon: "work" },
  { key: "skills", label: "Competencias", icon: "psychology" },
  { key: "projects", label: "Projetos", icon: "rocket_launch" },
  { key: "publications", label: "Publicacoes", icon: "menu_book" },
];

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Todos", description: "O seu perfil e publico e indexavel por motores de busca externos." },
  { value: "INSTITUTIONAL", label: "Apenas registados", description: "Visivel apenas para membros autenticados da rede UNIKIVI Vitae." },
  { value: "PRIVATE", label: "Ninguem", description: "O seu perfil esta oculto e funciona apenas como arquivo pessoal." },
];

export default function PublicProfileSettingsForm({ profile }: { profile: any }) {
  const [visibility, setVisibility] = useState(profile.visibility ?? "INSTITUTIONAL");
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>(
    profile.field_visibility ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const publicUrl = `unikivi-vitae.com/perfil/${profile.id}`;

  function toggleField(key: string) {
    setFieldVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ visibility, field_visibility: fieldVisibility })
      .eq("user_id", profile.user_id);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          Visibilidade Global
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Quem pode encontrar o meu perfil?
        </p>
        <div className="bg-white rounded-xl border border-outline-variant divide-y divide-outline-variant">
          {VISIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-start gap-3 p-4 cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility === opt.value}
                onChange={() => setVisibility(opt.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-primary text-sm">{opt.label}</p>
                <p className="text-xs text-on-surface-variant">{opt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          URL do Perfil Publico
        </h2>
        <div className="bg-white rounded-xl border border-outline-variant p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-outline">link</span>
          <span className="flex-1 text-sm text-on-surface-variant truncate">{publicUrl}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(`https://${publicUrl}`)}
            className="bg-surface-container-low text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-surface-container transition-colors"
          >
            Copiar
          </button>
          <a
            href={`/perfil/${profile.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-container transition-colors"
          >
            Ver Perfil
          </a>
        </div>
      </div>

      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          Permissoes de Campos
        </h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Defina quais secoes ficam visiveis quando alguem acede ao seu perfil publico.
        </p>
        <div className="bg-white rounded-xl border border-outline-variant divide-y divide-outline-variant">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline text-lg">{f.icon}</span>
                <span className="text-sm text-on-surface">{f.label}</span>
              </div>
              <div className="flex bg-surface-container-low rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setFieldVisibility((prev) => ({ ...prev, [f.key]: false }))}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-colors ${
                    !fieldVisibility[f.key] ? "bg-white text-primary shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  Privado
                </button>
                <button
                  type="button"
                  onClick={() => setFieldVisibility((prev) => ({ ...prev, [f.key]: true }))}
                  className={`px-4 py-1 rounded-full text-xs font-medium transition-colors ${
                    fieldVisibility[f.key] ? "bg-primary text-white shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  Publico
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {saved && <p className="text-secondary text-sm">Alteracoes guardadas.</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
      >
        {saving ? "A guardar..." : "Guardar Alteracoes"}
      </button>
    </div>
  );
}