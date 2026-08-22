"use client";

import { useState, useTransition } from "react";
import { saveVideoPitch } from "@/app/dashboard/video-pitch/actions";

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Público — visível a todos" },
  { value: "REGISTERED", label: "Registados — apenas utilizadores com conta" },
  { value: "PRIVATE", label: "Privado — apenas eu" },
];

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function VideoPitchForm({
  userId,
  currentUrl,
  currentTitle,
  currentVisibility,
}: {
  userId: string;
  currentUrl?: string | null;
  currentTitle?: string | null;
  currentVisibility?: string | null;
}) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [title, setTitle] = useState(currentTitle ?? "");
  const [visibility, setVisibility] = useState(currentVisibility ?? "PUBLIC");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const youtubeId = url ? extractYouTubeId(url) : null;
  const previewUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("video_pitch_url", url);
    formData.set("video_pitch_title", title);
    formData.set("video_pitch_visibility", visibility);

    startTransition(async () => {
      const result = await saveVideoPitch(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(result.error ?? "Não foi possível guardar o video pitch.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-6 space-y-6">
      <h2 className="font-headline-md text-headline-md text-primary text-lg flex items-center gap-2">
        <span className="material-symbols-outlined">videocam</span>
        Configurar Video Pitch
      </h2>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Video Pitch guardado com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {previewUrl ? (
        <div className="rounded-xl overflow-hidden aspect-video border border-outline-variant">
          <iframe
            src={previewUrl}
            title="Video Pitch Preview"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low aspect-video flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl opacity-40">play_circle</span>
          <p className="font-body-md text-sm">A pré-visualização aparecerá aqui após inserir um link do YouTube</p>
        </div>
      )}

      {/* URL */}
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          URL do Vídeo (YouTube)
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ex: https://www.youtube.com/watch?v=..."
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
        />
        <p className="text-xs text-on-surface-variant mt-1.5">
          Suporta links do YouTube (watch, youtu.be, embed)
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Título do Pitch (Opcional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Impacto da IA na Medicina Preventiva"
          maxLength={120}
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Visibilidade
        </label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors bg-white"
        >
          {VISIBILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">save</span>
        {isPending ? "A guardar..." : "Guardar Video Pitch"}
      </button>
    </form>
  );
}
