// components/auth/RegisterForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileType =
  | "STUDENT"
  | "TEACHER"
  | "RESEARCHER"
  | "PROFESSIONAL"
  | "TALENT";

const PROFILE_TYPES: { value: ProfileType; label: string }[] = [
  { value: "STUDENT", label: "Estudante" },
  { value: "TEACHER", label: "Docente" },
  { value: "RESEARCHER", label: "Investigador" },
  { value: "PROFESSIONAL", label: "Profissional / Ex-aluno" },
  { value: "TALENT", label: "Talento — à procura de oportunidades" },
];

// tipos que precisam de faculdade/departamento
const NEEDS_ACADEMIC_UNIT: ProfileType[] = ["STUDENT", "TEACHER", "RESEARCHER"];
// só o docente preenche cargo (positions)
const NEEDS_POSITION: ProfileType[] = ["TEACHER"];

type Option = { value: string; label: string };

export default function RegisterForm() {
  const router = useRouter();

  // dados do formulário
  const [profileType, setProfileType] = useState<ProfileType>("STUDENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionalEmail, setInstitutionalEmail] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  // dados de referência (vindos do Supabase)
  const [faculties, setFaculties] = useState<Option[]>([]);
  const [departments, setDepartments] = useState<Option[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);

  // estado da submissão
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAcademicUnit = NEEDS_ACADEMIC_UNIT.includes(profileType);
  const showPosition = NEEDS_POSITION.includes(profileType);

  // carrega faculdades uma vez
  useEffect(() => {
    const supabase = createClient();
    (supabase.from("faculties") as any)
      .select("id, name")
      .eq("status", "ACTIVE")
      .then(({ data }: any) =>
        setFaculties((data ?? []).map((f: any) => ({ value: f.id, label: f.name })))
      );
  }, []);

  // recarrega departamentos sempre que a faculdade muda
  useEffect(() => {
    if (!facultyId) {
      setDepartments([]);
      return;
    }
    const supabase = createClient();
    (supabase.from("departments") as any)
      .select("id, name")
      .eq("faculty_id", facultyId)
      .eq("status", "ACTIVE")
      .then(({ data }: any) =>
        setDepartments((data ?? []).map((d: any) => ({ value: d.id, label: d.name })))
      );
  }, [facultyId]);

  // carrega cargos (só é usado quando profileType === TEACHER)
  useEffect(() => {
    if (!showPosition) return;
    const supabase = createClient();
    (supabase.from("positions") as any)
      .select("id, name")
      .eq("is_academic", true)
      .then(({ data }: any) =>
        setPositions((data ?? []).map((p: any) => ({ value: p.id, label: p.name })))
      );
  }, [showPosition]);

  function handleProfileTypeChange(value: ProfileType) {
    setProfileType(value);
    // limpa campos que deixam de fazer sentido ao trocar de tipo
    setFacultyId("");
    setDepartmentId("");
    setPositionId("");
  }

  function handleFacultyChange(value: string) {
    setFacultyId(value);
    setDepartmentId(""); // evita departamento "órfão" de outra faculdade
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. cria o utilizador de autenticação (sem gate de confirmação de email)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Não foi possível criar a conta.");
      setLoading(false);
      return;
    }

    // 2. cria o perfil de negócio (status/visibility ficam nos defaults da tabela)
    const { error: profileError } = await (supabase.from("profiles") as any).insert({
      user_id: data.user.id,
      full_name: fullName,
      profile_type: profileType,
      institutional_email: institutionalEmail || null,
      faculty_id: showAcademicUnit ? facultyId || null : null,
      department_id: showAcademicUnit ? departmentId || null : null,
      position_id: showPosition ? positionId || null : null,
    });

    if (profileError) {
      console.error("Erro ao guardar perfil:", profileError);

      if (profileError.code === "23505") {
        setError("Já existe um perfil associado a esta conta. Tenta entrar em vez de criar uma nova.");
      } else {
        setError("Conta criada, mas houve um erro ao guardar o perfil.");
      }

      setLoading(false);
      return;
    }

    // 3. atribui o papel de permissões base (elevados são atribuídos manualmente)
    const { error: roleError } = await (supabase.from("user_roles") as any).insert({
      user_id: data.user.id,
      role: "user",
    });

    if (roleError) {
      console.error("Erro ao guardar role:", roleError);
      setError(roleError.message || "Perfil criado, mas houve um erro ao definir permissões.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
      {/* Seletor de tipo de utilizador */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-3">
          Sou
        </label>
        <div className="flex flex-wrap gap-2">
          {PROFILE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleProfileTypeChange(t.value)}
              className={`px-4 py-2 rounded-full text-label-sm font-label-sm transition-colors ${
                profileType === t.value
                  ? "bg-primary text-white"
                  : "bg-surface-container text-primary hover:bg-surface-container-high"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="Nome completo" value={fullName} onChange={setFullName} />
      <Field label="Email" type="email" value={email} onChange={setEmail} />
      <Field
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
      />
      <Field
        label="Email institucional (opcional)"
        type="email"
        value={institutionalEmail}
        onChange={setInstitutionalEmail}
        required={false}
      />

      {showAcademicUnit && (
        <>
          <SelectField
            label="Faculdade"
            value={facultyId}
            onChange={handleFacultyChange}
            options={faculties}
            required={profileType !== "RESEARCHER"}
          />
          {facultyId && (
            <SelectField
              label="Departamento"
              value={departmentId}
              onChange={setDepartmentId}
              options={departments}
              required={profileType !== "RESEARCHER"}
            />
          )}
        </>
      )}

      {showPosition && (
        <SelectField
          label="Cargo"
          value={positionId}
          onChange={setPositionId}
          options={positions}
        />
      )}

      {error && <p className="text-error text-sm font-body-md">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors duration-200 text-label-sm font-label-sm disabled:opacity-50"
      >
        {loading ? "A criar conta..." : "Criar perfil"}
      </button>
    </form>
  );
}

// --- componentes auxiliares (mesmo ficheiro, para reutilizar sem repetir markup) ---

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-outline-variant focus:border-b-2 focus:border-secondary focus:outline-none pb-2 text-on-surface bg-transparent transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">
        {label}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-outline-variant focus:border-b-2 focus:border-secondary focus:outline-none pb-2 text-on-surface bg-surface"
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}