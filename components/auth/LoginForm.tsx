// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError("Email ou palavra-passe incorretos.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const passwordFieldType = showPassword ? "text" : "password";
  const toggleLabel = showPassword ? "Esconder palavra-passe" : "Mostrar palavra-passe";
  const toggleIcon = showPassword ? "visibility_off" : "visibility";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          Email Institucional
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@unikivi.edu.ao"
          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-lg text-body-lg text-on-surface placeholder-outline focus:outline-none focus:border-b-2 focus:border-primary transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end w-full">
          <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Palavra-passe
          </label>
          <a href="#" className="font-label-sm text-label-sm text-primary hover:text-primary-container transition-colors underline underline-offset-2">
            Esqueceu-se?
          </a>
        </div>
        <div className="relative w-full">
          <input
            id="password"
            type={passwordFieldType}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-10 font-body-lg text-body-lg text-on-surface placeholder-outline focus:outline-none focus:border-b-2 focus:border-primary transition-all"
          />
          <button
            type="button"
            aria-label={toggleLabel}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-2"
          >
            <span className="material-symbols-outlined">{toggleIcon}</span>
          </button>
        </div>
      </div>

      {error && <p className="text-error text-sm font-body-md">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-container text-on-primary font-headline-md text-body-md py-4 rounded-xl mt-2 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "A entrar..." : "Aceder a Plataforma"}
      </button>
    </form>
  );
}