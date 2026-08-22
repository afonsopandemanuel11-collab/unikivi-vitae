"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_DURATION_SECONDS = 180; // 3 minutos
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export default function VideoPitchForm({
  userId,
  currentUrl,
  currentTitle,
  currentVisibility,
}: {
  userId: string;
  currentUrl: string | null;
  currentTitle: string | null;
  currentVisibility: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [title, setTitle] = useState(currentTitle ?? "");
  const [visibility, setVisibility] = useState(currentVisibility ?? "PUBLIC");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validateAndSetFile(selected: File) {
    setError(null);

    if (!["video/mp4", "video/webm"].includes(selected.type)) {
      setError("O ficheiro tem de ser MP4 ou WebM.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError("O video excede o limite de 200MB.");
      return;
    }

    // valida a duracao antes de aceitar o ficheiro
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > MAX_DURATION_SECONDS) {
        setError("O video excede o limite de 3 minutos.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    };
    video.src = URL.createObjectURL(selected);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  }

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected) validateAndSetFile(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file && !currentUrl) {
      setError("Selecione um video para carregar.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    let videoUrl = currentUrl;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/pitch.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("pitches")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError("Nao foi possivel carregar o video.");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("pitches").getPublicUrl(path);
      videoUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        video_pitch_url: videoUrl,
        video_pitch_title: title || null,
        video_pitch_visibility: visibility,
      })
      .eq("user_id", userId);

    if (updateError) {
      setError("Video carregado, mas houve um erro ao guardar os dados.");
      setUploading(false);
      return;
    }

    setSuccess(true);
    setFile(null);
    setUploading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-outline-variant p-6">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="block relative w-full aspect-video border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors mb-6 overflow-hidden"
      >
        {preview ? (
          <video src={preview} controls className="w-full h-full object-cover" />
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-outline mb-2">
              cloud_upload
            </span>
            <p className="font-bold text-primary">Carregar ou Gravar Video</p>
            <p className="text-sm text-on-surface-variant text-center mt-1 px-4">
              Arraste um ficheiro MP4/WebM ou clique para selecionar.
              Maximo 3 minutos.
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <div className="mb-6">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
          Titulo do Video Pitch
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Impacto da IA na Pesquisa Medica..."
          className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
        />
      </div>

      <div className="mb-8">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-3">
          Visibilidade
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={visibility === "PUBLIC"}
              onChange={() => setVisibility("PUBLIC")}
            />
            Publico
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="radio"
              name="visibility"
              checked={visibility === "INSTITUTIONAL"}
              onChange={() => setVisibility("INSTITUTIONAL")}
            />
            Apenas Rede UNIKIVI
          </label>
        </div>
      </div>

      {error && <p className="text-error text-sm font-body-md mb-4">{error}</p>}
      {success && <p className="text-secondary text-sm font-body-md mb-4">Video pitch guardado.</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={uploading}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          {uploading ? "A carregar..." : "Salvar Video Pitch"}
        </button>
      </div>
    </form>
  );
}