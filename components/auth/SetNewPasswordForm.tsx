"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SetNewPasswordForm() {
  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setHasRecoverySession(Boolean(data.user));
      setChecking(false);
    });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("Não foi possível atualizar a palavra-passe. Peça um novo link e tente novamente.");
      setBusy(false);
      return;
    }
    await supabase.auth.signOut();
    setSaved(true);
    setBusy(false);
  }

  if (checking) return <p className="py-4 text-center text-sm text-on-surface-variant">A validar o link…</p>;
  if (saved) return <div className="space-y-4 text-center"><span aria-hidden="true" className="material-symbols-outlined rounded-full bg-emerald-50 p-3 text-3xl text-emerald-700">task_alt</span><h2 className="text-xl font-bold text-primary">Palavra-passe atualizada</h2><p className="text-sm text-on-surface-variant">Já pode entrar com a nova palavra-passe.</p><Link href="/login" className="inline-flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-primary-container">Voltar ao login</Link></div>;
  if (!hasRecoverySession) return <div className="space-y-4 text-center"><p role="alert" className="text-sm leading-6 text-on-surface-variant">O link não é válido ou já expirou. Peça um novo link de recuperação.</p><Link href="/recuperar-senha" className="inline-flex w-full justify-center rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-primary-container">Pedir novo link</Link></div>;

  return <form onSubmit={submit} className="space-y-5">
    <p className="text-sm leading-6 text-on-surface-variant">Escolha uma nova palavra-passe com pelo menos 8 caracteres.</p>
    <label className="block"><span className="mb-2 block text-sm font-semibold text-primary">Nova palavra-passe</span><input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
    <label className="block"><span className="mb-2 block text-sm font-semibold text-primary">Confirmar palavra-passe</span><input type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-container disabled:cursor-wait disabled:opacity-60">{busy ? "A guardar…" : "Guardar nova palavra-passe"}</button>
  </form>;
}
