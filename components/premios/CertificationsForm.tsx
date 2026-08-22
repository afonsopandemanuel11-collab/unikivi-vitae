"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCertification, deleteCertification } from "@/app/dashboard/premios/actions";

type Certification = {
  id: string;
  name: string;
  issuer: string;
  credential_id: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
};

export default function CertificationsForm({
  profileId,
  certifications,
}: {
  profileId: string;
  certifications: Certification[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAdd() {
    if (!name || !issuer) {
      setError("Preencha pelo menos o nome e a entidade emissora.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await addCertification(profileId, {
      name,
      issuer,
      credential_id: credentialId || null,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      credential_url: credentialUrl || null,
    });

    if (!result.success) {
      setError(result.error ?? "Não foi possível adicionar a certificação.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setName("");
    setIssuer("");
    setCredentialId("");
    setIssueDate("");
    setExpiryDate("");
    setCredentialUrl("");
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem a certeza que deseja remover esta certificação?")) return;
    setDeletingId(id);
    const result = await deleteCertification(id);
    if (!result.success) {
      setError(result.error ?? "Erro ao remover certificação.");
    } else {
      router.refresh();
    }
    setDeletingId(null);
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant p-6">
      <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2 mb-4 text-lg">
        <span className="material-symbols-outlined">workspace_premium</span>
        Certificações
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Certificação adicionada com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <Field label="Nome da Certificação" value={name} onChange={setName} placeholder="Ex: AWS Certified Solutions Architect" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Entidade Emissora" value={issuer} onChange={setIssuer} placeholder="Ex: Amazon Web Services" />
          <Field label="ID da Credencial (Opcional)" value={credentialId} onChange={setCredentialId} placeholder="Ex: AWS-123456" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Data de Emissão (Opcional)" value={issueDate} onChange={setIssueDate} type="date" />
          <Field label="Data de Expiração (Opcional)" value={expiryDate} onChange={setExpiryDate} type="date" />
        </div>
        <Field label="URL da Credencial (Opcional)" value={credentialUrl} onChange={setCredentialUrl} type="url" placeholder="https://..." />

        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-container transition-colors disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {saving ? "A adicionar..." : "Adicionar Certificação"}
        </button>
      </div>

      {certifications.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-outline-variant">
          <h3 className="font-headline-md text-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Certificações Registadas ({certifications.length})
          </h3>
          {certifications.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 text-sm">
              <div>
                <p className="font-semibold text-primary">{c.name}</p>
                <p className="text-on-surface-variant text-xs mt-0.5">
                  {c.issuer} {c.issue_date ? `• Emitido: ${c.issue_date}` : ""} {c.expiry_date ? `• Expira: ${c.expiry_date}` : ""}
                </p>
                {c.credential_url && (
                  <a
                    href={c.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-secondary text-xs hover:underline mt-1"
                  >
                    <span>Ver credencial</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                title="Remover Certificação"
                className="text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
      />
    </div>
  );
}