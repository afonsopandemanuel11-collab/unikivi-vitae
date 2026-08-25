"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountSettingsForm({
  profile,
  email,
  provider,
}: {
  profile: any;
  email: string;
  provider: string;
}) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  async function handleSaveName() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: fullName }).eq("user_id", profile.user_id);
    setSaving(false);
    setSaved(true);
  }

  async function handleChangePassword() {
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As palavras-passe nao coincidem.");
      return;
    }

    setPasswordSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError("Nao foi possivel alterar a palavra-passe.");
      setPasswordSaving(false);
      return;
    }

    setPasswordSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaving(false);
    setShowPasswordForm(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          Dados da Conta
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Informacoes fundamentais utilizadas para a sua identificacao no sistema.
        </p>

        <div className="bg-white rounded-xl border border-outline-variant p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {fullName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-primary">{fullName}</p>
              <p className="text-sm text-on-surface-variant">{profile.profile_type}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                Email
              </label>
              <p className="py-2 text-body-md text-on-surface-variant">{email}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
              Metodo de Autenticacao
            </label>
            <p className="text-sm text-on-surface-variant capitalize">
              {provider === "google" ? "Google" : "Email e Palavra-passe"}
            </p>
          </div>

          {saved && <p className="text-secondary text-sm mb-3">Alteracoes guardadas.</p>}

          <button
            type="button"
            onClick={handleSaveName}
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {saving ? "A guardar..." : "Guardar alteracoes"}
          </button>
        </div>
      </div>

      {provider !== "google" && (
        <div>
          <h2 className="font-headline-md text-headline-md text-primary mb-1">
            Seguranca
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Proteja o acesso a sua conta.
          </p>

          <div className="bg-white rounded-xl border border-outline-variant p-6">
            {!showPasswordForm ? (
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
              >
                Alterar Palavra-passe
              </button>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                    Nova Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-2">
                    Confirmar Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-2.5 text-sm focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                {passwordError && <p className="text-error text-xs">{passwordError}</p>}
                {passwordSaved && <p className="text-secondary text-xs">Palavra-passe alterada.</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 ml-auto"
                  >
                    {passwordSaving ? "A alterar..." : "Confirmar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}