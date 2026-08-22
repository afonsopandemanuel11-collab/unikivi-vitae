"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TYPES = [
  { value: "EXTENSION", label: "Extensao" },
  { value: "COMMITTEE", label: "Comite Cientifico" },
  { value: "EVENT", label: "Evento" },
  { value: "OTHER", label: "Outro" },
];

export default function AtividadesForm({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [type, setType] = useState("EXTENSION");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("experiences").insert({
      profile_id: profileId,
      position: title,
      organization,
      employment_type: type,
      start_date: startDate || null,
      end_date: endDate || null,
      is_current: !endDate,
      description: description || null,
    });

    if (insertError) {
      setError("Nao foi possivel guardar a atividade.");
      setSaving(false);
      return;
    }

    setTitle("");
    setOrganization("");
    setType("EXTENSION");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined">add</span>
        Adicionar Atividade
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-6">
      <h2 className="font-headline-md text-headline-md text-primary mb-6 text-lg">
        Nova Atividade
      </h2>

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Titulo da Atividade
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Palestra sobre IA na Educacao"
          className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Entidade/Instituicao
        </label>
        <input
          type="text"
          required
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Ex: Universidade Kimpa Vita"
          className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Categoria
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Data de Inicio
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
            Data de Termino (Opcional)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Descricao
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Descreva brevemente a sua contribuicao..."
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors resize-none"
        />
      </div>

      {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2.5 text-on-surface-variant hover:text-primary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {saving ? "A guardar..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}