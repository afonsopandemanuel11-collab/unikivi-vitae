"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "@/app/dashboard/projetos/actions";

const ROLES = ["Coordenador", "Pesquisador Principal", "Investigador", "Bolsista", "Membro"];

export default function ProjetosForm({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [fundingSource, setFundingSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ongoing, setOngoing] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await addProject(profileId, {
      title,
      role: role || "Membro",
      funding_source: fundingSource || null,
      start_date: startDate || null,
      end_date: ongoing ? null : endDate || null,
      status: ongoing ? "ACTIVE" : "COMPLETED",
      description: description || null,
    });

    if (!result.success) {
      setError(result.error ?? "Não foi possível criar o projeto.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setTitle("");
    setRole("");
    setFundingSource("");
    setStartDate("");
    setEndDate("");
    setOngoing(false);
    setDescription("");
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-6">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Adicionar Novo Projeto
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Projeto adicionado com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-5">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Titulo do Projeto
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Impacto de Modelos de Linguagem na Bioinformatica"
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Seu Papel (Role)
          </label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          >
            <option value="">Selecione um papel...</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Agencia Financiadora
          </label>
          <input
            type="text"
            value={fundingSource}
            onChange={(e) => setFundingSource(e.target.value)}
            placeholder="Ex: FAPESP, CNPq (Opcional)"
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Data de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Data de Termino
          </label>
          <input
            type="date"
            value={endDate}
            disabled={ongoing}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"
          />
          <label className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={ongoing}
              onChange={(e) => setOngoing(e.target.checked)}
            />
            Projeto em andamento
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Descricao Resumida
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Descreva os objetivos principais e a metodologia adotada..."
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
        />
      </div>

      {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {saving ? "A adicionar..." : "Adicionar Projeto"}
        </button>
      </div>
    </form>
  );
}