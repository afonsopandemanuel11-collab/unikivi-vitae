"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PasswordResetRequestForm({ invalidLink = false }: { invalidLink?: boolean }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=%2Fnova-senha`;
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setBusy(false);
    if (requestError) {
      setError("Não foi possível enviar o email agora. Tente novamente dentro de alguns minutos.");
      return;
    }
    setSent(true);
  }

  return sent ? (
    <div className="space-y-4 text-center">
      <span aria-hidden="true" className="material-symbols-outlined rounded-full bg-emerald-50 p-3 text-3xl text-emerald-700">mark_email_read</span>
      <h2 className="text-xl font-bold text-primary">Verifique o seu email</h2>
      <p className="text-sm leading-6 text-on-surface-variant">Se existir uma conta associada a <strong>{email}</strong>, receberá um link para definir uma nova palavra-passe.</p>
      <p className="text-xs text-on-surface-variant">Não recebeu? Verifique o spam ou aguarde alguns minutos antes de pedir outro link.</p>
      <button type="button" onClick={() => setSent(false)} className="text-sm font-semibold text-primary underline underline-offset-4">Usar outro email</button>
    </div>
  ) : (
    <form onSubmit={submit} className="space-y-5">
      {invalidLink && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-900">Este link expirou ou já foi utilizado. Peça um novo link abaixo.</p>}
      <p className="text-sm leading-6 text-on-surface-variant">Indique o email da sua conta. Enviaremos um link para criar uma nova palavra-passe.</p>
      <label className="block"><span className="mb-2 block text-sm font-semibold text-primary">Email da conta</span><input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@unikivi.edu.ao" className="w-full rounded-xl border border-outline-variant px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white transition hover:bg-primary-container disabled:cursor-wait disabled:opacity-60">{busy ? "A enviar…" : "Enviar link de recuperação"}</button>
      <p className="text-center"><Link href="/login" className="text-sm font-semibold text-primary hover:underline">Voltar ao login</Link></p>
    </form>
  );
}
