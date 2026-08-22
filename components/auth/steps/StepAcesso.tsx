// components/auth/steps/StepAcesso.tsx
"use client";

import { useState } from "react";

function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const labels = ["Fraca", "Fraca", "Razoável", "Boa", "Forte"];
  return { score, label: labels[score] };
}

export default function StepAcesso({
  onBack,
  onSubmit,
  loading,
}: {
  onBack: () => void;
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const strength = passwordStrength(password);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.");
      return;
    }
    if (!acceptedTerms) {
      setLocalError("Precisa de aceitar os Termos de Uso para continuar.");
      return;
    }

    onSubmit(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md">
      <header className="mb-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-2">
          Dados de Acesso
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Defina o email e a senha que vai usar para aceder ao portal.
        </p>
      </header>

      <div className="space-y-6">
        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant block">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full py-3 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary focus:shadow-[0_4px_12px_rgba(0,219,233,0.1)] transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant block">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha forte"
              className="w-full py-3 px-4 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>

          {password && (
            <div className="pt-2">
              <div className="flex gap-1 h-1.5 w-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 rounded-full ${
                      i < strength.score ? "bg-secondary" : "bg-surface-variant"
                    }`}
                  />
                ))}
              </div>
              <p className="font-label-sm text-label-sm text-secondary mt-1 text-right">
                Força da senha: {strength.label}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-label-sm text-label-sm text-on-surface-variant block">
            Confirmar Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita sua senha"
            className="w-full py-3 px-4 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-secondary transition-all"
          />
        </div>

        <div className="flex items-start gap-3 pt-4">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary-container"
          />
          <label htmlFor="terms" className="font-body-md text-body-md text-on-surface-variant text-sm">
            Declaro que li e concordo com os{" "}
            <a href="#" className="text-primary font-medium hover:underline">Termos de Uso</a> e a{" "}
            <a href="#" className="text-primary font-medium hover:underline">Política de Privacidade</a> institucional.
          </label>
        </div>

        {localError && (
          <p className="text-error text-sm font-body-md">{localError}</p>
        )}

        <div className="pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Voltar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary text-on-primary font-headline-md text-[18px] py-4 px-8 rounded-xl shadow-[0_10px_20px_rgba(0,17,58,0.1)] hover:bg-primary-container hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? "A finalizar..." : "Finalizar Cadastro"}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </form>
  );
}