// components/auth/steps/StepDados.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProfileType } from "./StepPerfil";

export type DadosState = {
  fullName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  idNumber: string;
  institutionalEmail: string;
  facultyId: string;
  departmentId: string;
  positionId: string;
  photoFile: File | null;
};

type Option = { value: string; label: string };

const GENDER_OPTIONS = [
  { value: "F", label: "Feminino" },
  { value: "M", label: "Masculino" },
  { value: "O", label: "Outro" },
  { value: "N", label: "Prefiro não dizer" },
];

const NATIONALITY_OPTIONS = [
  { value: "AO", label: "Angola" },
  { value: "PT", label: "Portugal" },
  { value: "BR", label: "Brasil" },
  { value: "MZ", label: "Moçambique" },
  { value: "CV", label: "Cabo Verde" },
  { value: "ST", label: "São Tomé e Príncipe" },
  { value: "GW", label: "Guiné-Bissau" },
  { value: "OTHER", label: "Outra" },
];

const NEEDS_ACADEMIC_UNIT: ProfileType[] = ["STUDENT", "TEACHER", "RESEARCHER"];
const NEEDS_POSITION: ProfileType[] = ["TEACHER"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export default function StepDados({
  profileType,
  value,
  onChange,
  onNext,
  onBack,
}: {
  profileType: ProfileType;
  value: DadosState;
  onChange: (v: DadosState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [faculties, setFaculties] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const showAcademicUnit = NEEDS_ACADEMIC_UNIT.includes(profileType);
  const showPosition = NEEDS_POSITION.includes(profileType);

  function set<K extends keyof DadosState>(key: K, v: DadosState[K]) {
    onChange({ ...value, [key]: v });
  }

  // carrega faculdades (só se o tipo precisar)
  useEffect(() => {
    if (!showAcademicUnit) {
      setFaculties([]);
      return;
    }

    const supabase = createClient();

    supabase
      .from("faculties")
      .select("id, name")
      .eq("status", "ACTIVE")
      // StepDados.tsx — dentro do useEffect das faculdades
.then(({ data, error }) => {
  if (error) {
    console.error("Erro ao buscar faculdades:", JSON.stringify(error, null, 2));
    setFaculties([]);
    return;
  }
  setFaculties(
    ((data ?? []) as Array<{ id: string; name: string }>).map((f) => ({
      value: f.id,
      label: f.name,
    }))
  );
});
  }, [showAcademicUnit]);

  // recarrega departamentos sempre que a faculdade muda
  useEffect(() => {
    if (!value.facultyId) {
      setDepartments([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("departments")
      .select("id, name")
      .eq("faculty_id", value.facultyId)
      .eq("status", "ACTIVE")
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar departamentos:", error);
          setDepartments([]);
          return;
        }
        setDepartments(
          ((data ?? []) as Array<{ id: string; name: string }>).map((d) => ({
            value: d.id,
            label: d.name,
          }))
        );
      });
  }, [value.facultyId]);

  // carrega cargos (só para TEACHER)
  useEffect(() => {
    if (!showPosition) return;
    const supabase = createClient();
    supabase
      .from("positions")
      .select("id, name")
      .eq("is_academic", true)
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar cargos:", error);
          setPositions([]);
          return;
        }
        setPositions(
          ((data ?? []) as Array<{ id: string; name: string }>).map((p) => ({
            value: p.id,
            label: p.name,
          }))
        );
      });
  }, [showPosition]);

  // regenera a pré-visualização da foto sempre que o ficheiro muda
  useEffect(() => {
    if (!value.photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(value.photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value.photoFile]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoError(null);

    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("A imagem excede o limite de 5MB.");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("O ficheiro tem de ser uma imagem (JPG ou PNG).");
      e.target.value = "";
      return;
    }

    set("photoFile", file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <header className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-2">
          Dados Pessoais
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Forneça os detalhes que irão compor a base da sua identidade
          institucional.
        </p>
      </header>

      <div className="space-y-section-gap">
        {/* Identificação Visual */}
        <section className="space-y-6">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant pb-2">
            Identificação Visual
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <label className="relative w-32 h-32 rounded-full border-2 border-dashed border-outline-variant bg-surface-container flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-3xl">
                    add_a_photo
                  </span>
                  <span className="font-label-sm text-label-sm text-outline-variant group-hover:text-primary mt-2">
                    Upload
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-body-md text-body-md text-on-surface">
                Fotografia de Perfil Institucional
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                Fundo neutro, resolução mínima de 400x400px (JPG ou PNG). Max: 5MB.
              </p>
              {photoError && (
                <p className="text-error text-sm font-body-md mt-2">{photoError}</p>
              )}
            </div>
          </div>
        </section>

        {/* Informação Base */}
        <section className="space-y-8">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant pb-2">
            Informação Base
          </h3>
          <AcademicField
            label="Nome Completo"
            value={value.fullName}
            onChange={(v) => set("fullName", v)}
            placeholder="Ex: João Miguel Santos Silva"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AcademicField
              label="Data de Nascimento"
              type="date"
              value={value.birthDate}
              onChange={(v) => set("birthDate", v)}
            />
            <AcademicSelect
              label="Género"
              value={value.gender}
              onChange={(v) => set("gender", v)}
              options={GENDER_OPTIONS}
            />
          </div>
        </section>

        {/* Identificação Legal */}
        <section className="space-y-8">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant pb-2">
            Identificação Legal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AcademicSelect
              label="Nacionalidade"
              value={value.nationality}
              onChange={(v) => set("nationality", v)}
              options={NATIONALITY_OPTIONS}
            />
            <AcademicField
              label="Nº de Identificação (BI / Passaporte)"
              value={value.idNumber}
              onChange={(v) => set("idNumber", v)}
              placeholder="Ex: 000000000LA000"
            />
          </div>
        </section>

        {/* Afiliação Institucional — só para tipos académicos */}
        {showAcademicUnit && (
          <section className="space-y-8">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase border-b border-outline-variant pb-2">
              Afiliação Institucional
            </h3>
            <AcademicField
              label="Email institucional (opcional, apenas para contacto — diferente do email de acesso)"
              type="email"
              value={value.institutionalEmail}
              onChange={(v) => set("institutionalEmail", v)}
              placeholder="nome@unikivi.ao"
              required={false}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AcademicSelect
                label="Faculdade"
                value={value.facultyId}
                onChange={(v) => onChange({ ...value, facultyId: v, departmentId: "" })}
                options={faculties}
                required={profileType !== "RESEARCHER"}
                placeholder="Selecione a faculdade"
              />
              {value.facultyId && (
                <AcademicSelect
                  label="Departamento"
                  value={value.departmentId}
                  onChange={(v) => set("departmentId", v)}
                  options={departments}
                  required={profileType !== "RESEARCHER"}
                  placeholder="Selecione o departamento"
                />
              )}
            </div>
            {showPosition && (
              <AcademicSelect
                label="Cargo"
                value={value.positionId}
                onChange={(v) => set("positionId", v)}
                options={positions}
                placeholder="Selecione o cargo"
              />
            )}
          </section>
        )}
      </div>

      {/* Ações */}
      <div className="pt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-section-gap border-t border-surface-variant">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-3 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Voltar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded hover:bg-primary-container transition-colors font-label-sm text-label-sm uppercase flex items-center justify-center gap-2 shadow-sm"
        >
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </form>
  );
}

// --- auxiliares deste step ---

function AcademicField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:shadow-[0_4px_6px_-1px_rgba(0,238,252,0.1)] transition-all"
      />
    </div>
  );
}

function AcademicSelect({
  label,
  value,
  onChange,
  options,
  required = true,
  placeholder = "Selecione uma opção",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border-0 border-b-2 border-outline-variant bg-transparent py-2 pr-8 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-all"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-0 bottom-2 text-outline-variant">
        expand_more
      </span>
    </div>
  );
}