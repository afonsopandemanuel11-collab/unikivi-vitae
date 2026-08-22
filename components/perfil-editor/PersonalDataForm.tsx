"use client";

import { useState, useTransition } from "react";
import { updatePersonalData } from "@/app/dashboard/perfil/actions";

type Profile = {
  full_name: string;
  professional_name: string | null;
  bio: string | null;
  photo_url: string | null;
  institutional_email: string | null;
  phone: string | null;
  nationality: string | null;
  birth_year: number | null;
  gender: string | null;
  faculty_id: string | null;
  department_id: string | null;
  position_id: string | null;
  visibility: string;
};

type Option = { id: string; name: string };
type Department = Option & { faculty_id: string };

const inputStyle =
  "w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

function PrivacyBadge({
  type,
}: {
  type: "PUBLIC" | "INTERNAL" | "PRIVATE";
}) {
  if (type === "PUBLIC") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
        <span className="material-symbols-outlined text-[14px]">public</span>
        Público (PUBLIC)
      </span>
    );
  }
  if (type === "INTERNAL") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
        <span className="material-symbols-outlined text-[14px]">apartment</span>
        Interno (INTERNAL)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
      <span className="material-symbols-outlined text-[14px]">lock</span>
      Privado (PRIVATE)
    </span>
  );
}

export default function PersonalDataForm({
  profile,
  faculties,
  departments,
  positions,
}: {
  profile: Profile;
  faculties: Option[];
  departments: Department[];
  positions: Option[];
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(profile.faculty_id ?? "");
  const [bioText, setBioText] = useState(profile.bio ?? "");
  const [preview, setPreview] = useState(
    profile.photo_url || "/images/avatar-placeholder.png"
  );

  const filteredDepartments = departments.filter(
    (d) => d.faculty_id === selectedFaculty
  );

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    setErrorMsg("");
    startTransition(async () => {
      const result = await updatePersonalData(formData);
      if (result.success) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setErrorMsg(result.error ?? "Erro desconhecido ao guardar alterações.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Dados Pessoais
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mt-1">
            Gerencie as suas informações de identificação, biografia e contactos. O
            controlo de privacidade granular permite definir quem acede a cada
            campo.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer self-start md:self-auto shrink-0"
        >
          {isPending ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">
                progress_activity
              </span>
              <span>A guardar...</span>
            </>
          ) : (
            <span>Guardar Alterações</span>
          )}
        </button>
      </div>

      {/* Notifications */}
      {status === "success" && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-emerald-600">
            check_circle
          </span>
          <span>Alterações guardadas com sucesso no seu perfil!</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Identificação Profissional & Perfil Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Identificação */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-5">
              Identificação Profissional
            </h2>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={preview}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer border border-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    photo_camera
                  </span>
                  <span>Alterar foto</span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG ou WebP até 5MB
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    Nome Completo
                  </span>
                  <PrivacyBadge type="PUBLIC" />
                </div>
                <input
                  name="full_name"
                  defaultValue={profile.full_name}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    Nome Profissional
                  </span>
                  <PrivacyBadge type="PUBLIC" />
                </div>
                <input
                  name="professional_name"
                  defaultValue={profile.professional_name ?? ""}
                  placeholder="Ex: Ana S. Duarte"
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Perfil Copilot Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-cyan-50/70 to-blue-50/50 rounded-2xl border border-cyan-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[18px]">
                  auto_awesome
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-800">
                Perfil Copilot
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              A sua biografia atual está genérica. O Copilot pode analisar as
              suas últimas publicações e sugerir um resumo executivo mais
              impactante.
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 px-4 bg-white/90 hover:bg-white text-slate-700 text-xs font-bold rounded-xl border border-cyan-200 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✨</span>
            <span>Melhorar biografia</span>
          </button>
        </div>
      </div>

      {/* Section 2: Informação Institucional */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">
            Informação Institucional
          </h2>
          <PrivacyBadge type="INTERNAL" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Faculdade
            </span>
            <select
              name="faculty_id"
              defaultValue={profile.faculty_id ?? ""}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className={inputStyle}
            >
              <option value="">Selecionar faculdade</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Departamento
            </span>
            <select
              name="department_id"
              defaultValue={profile.department_id ?? ""}
              disabled={!selectedFaculty}
              className={`${inputStyle} disabled:bg-slate-50 disabled:text-slate-400`}
            >
              <option value="">
                {selectedFaculty
                  ? "Selecionar departamento"
                  : "Selecione uma faculdade primeiro"}
              </option>
              {filteredDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Cargo
            </span>
            <select
              name="position_id"
              defaultValue={profile.position_id ?? ""}
              className={inputStyle}
            >
              <option value="">Selecionar cargo</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Informações Pessoais */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">
            Informações Pessoais
          </h2>
          <PrivacyBadge type="PRIVATE" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Nacionalidade
            </span>
            <input
              name="nationality"
              defaultValue={profile.nationality ?? "Angolana"}
              className={inputStyle}
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Ano de Nascimento
            </span>
            <input
              type="number"
              name="birth_year"
              defaultValue={profile.birth_year ?? ""}
              placeholder="AAAA"
              min={1920}
              max={new Date().getFullYear()}
              className={inputStyle}
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1.5 block">
              Género
            </span>
            <select
              name="gender"
              defaultValue={profile.gender ?? ""}
              className={inputStyle}
            >
              <option value="">Selecionar</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não dizer">Prefiro não dizer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 4: Resumo / Biografia */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800">
            Resumo / Biografia
          </h2>
          <PrivacyBadge type="PUBLIC" />
        </div>

        <textarea
          name="bio"
          rows={4}
          maxLength={1000}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          placeholder="Escreva um resumo conciso sobre a sua trajetória académica, principais áreas de investigação ou interesses..."
          className={`${inputStyle} resize-y leading-relaxed`}
        />

        <div className="flex justify-end mt-2">
          <span className="text-[11px] font-medium text-slate-400">
            {bioText.length} / 1000 caracteres
          </span>
        </div>
      </div>

      {/* Section 5: Contactos */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-5">Contactos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                Email Institucional
              </span>
              <PrivacyBadge type="INTERNAL" />
            </div>
            <input
              type="email"
              name="institutional_email"
              defaultValue={profile.institutional_email ?? ""}
              placeholder="utilizador@unikivi.edu.ao"
              className={inputStyle}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                Telemóvel
              </span>
              <PrivacyBadge type="PRIVATE" />
            </div>
            <input
              type="tel"
              name="phone"
              defaultValue={profile.phone ?? ""}
              placeholder="+244 9XX XXX XXX"
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Hidden / Global Visibility Control */}
      <input
        type="hidden"
        name="visibility"
        value={profile.visibility || "PUBLIC"}
      />

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-slate-400">
          As alterações terão efeito imediato no seu perfil e no diretório público.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "A guardar alterações..." : "Guardar Alterações"}
        </button>
      </div>
    </form>
  );
}