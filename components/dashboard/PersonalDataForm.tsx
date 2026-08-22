// components/dashboard/PersonalDataForm.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NEEDS_ACADEMIC_UNIT = ["STUDENT", "TEACHER", "RESEARCHER"];

type Option = { value: string; label: string };

export default function PersonalDataForm({
  profile,
  faculties,
}: {
  profile: any;
  faculties: { id: string; name: string }[];
}) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [professionalName, setProfessionalName] = useState(profile.professional_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [nationality, setNationality] = useState(profile.nationality ?? "Angolana");
  const [gender, setGender] = useState(profile.gender ?? "");
  const [birthYear, setBirthYear] = useState(profile.birth_year?.toString() ?? "");
  const [institutionalEmail, setInstitutionalEmail] = useState(profile.institutional_email ?? "");
  const [facultyId, setFacultyId] = useState(profile.faculty_id ?? "");
  const [departmentId, setDepartmentId] = useState(profile.department_id ?? "");
  const [departments, setDepartments] = useState<Option[]>([]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAcademicUnit = NEEDS_ACADEMIC_UNIT.includes(profile.profile_type);

  useEffect(() => {
    if (!facultyId) {
      setDepartments([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from("departments")
      .select("id, name")
      .eq("faculty_id", facultyId)
      .eq("status", "ACTIVE")
      .then(({ data }) =>
        setDepartments((data ?? []).map((d) => ({ value: d.id, label: d.name })))
      );
  }, [facultyId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        professional_name: professionalName || null,
        bio: bio || null,
        phone: phone || null,
        nationality: nationality || null,
        gender: gender || null,
        birth_year: birthYear ? Number(birthYear) : null,
        institutional_email: institutionalEmail || null,
        faculty_id: showAcademicUnit ? facultyId || null : null,
        department_id: showAcademicUnit ? departmentId || null : null,
      })
      .eq("user_id", profile.user_id);

    if (updateError) {
      setError("Nao foi possivel guardar as alteracoes. Tenta novamente.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Field label="Nome Completo" value={fullName} onChange={setFullName} required />
        <Field
          label="Nome Profissional (opcional)"
          value={professionalName}
          onChange={setProfessionalName}
          placeholder="Como prefere ser identificado publicamente"
        />
      </div>

      <div className="mb-6">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Biografia
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Uma breve apresentacao do seu percurso e interesses."
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Field label="Telefone" value={phone} onChange={setPhone} />
        <Field label="Nacionalidade" value={nationality} onChange={setNationality} />
        <Field
          label="Ano de Nascimento"
          type="number"
          value={birthYear}
          onChange={setBirthYear}
          placeholder="Ex: 1998"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Genero
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Selecione...</option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="O">Outro</option>
            <option value="N">Prefiro nao dizer</option>
          </select>
        </div>
        <Field
          label="Email Institucional (opcional)"
          type="email"
          value={institutionalEmail}
          onChange={setInstitutionalEmail}
        />
      </div>

      {showAcademicUnit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-outline-variant">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
              Faculdade
            </label>
            <select
              value={facultyId}
              onChange={(e) => {
                setFacultyId(e.target.value);
                setDepartmentId("");
              }}
              className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="">Selecione...</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          {facultyId && (
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Departamento
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
              >
                <option value="">Selecione...</option>
                {departments.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}
      {saved && <p className="text-secondary text-sm font-body-md mb-4">Alteracoes guardadas.</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
      >
        {saving ? "A guardar..." : "Guardar alteracoes"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
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
      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
      />
    </div>
  );
}