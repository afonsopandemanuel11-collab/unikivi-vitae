// app/teste-conexao/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "a-testar" | "sucesso" | "erro";

export default function TesteConexaoPage() {
  const [status, setStatus] = useState<Status>("a-testar");
  const [detalhe, setDetalhe] = useState<string>("");

  useEffect(() => {
    async function testar() {
      const supabase = createClient();

      // 1. Testa se o cliente consegue pelo menos perguntar pela sessão
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus("erro");
        setDetalhe(error.message);
        return;
      }

      setStatus("sucesso");
      setDetalhe(
        data.session
          ? `Sessão ativa para: ${data.session.user.email}`
          : "Ligação OK — sem sessão ativa (normal, ainda não fizeste login)."
      );
    }

    testar();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-8">
      <div className="max-w-md w-full bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
        <h1 className="font-headline-md text-headline-md text-primary mb-6">
          Teste de Ligação — Supabase
        </h1>

        {status === "a-testar" && (
          <p className="text-on-surface-variant">A testar ligação...</p>
        )}

        {status === "sucesso" && (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-secondary font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Ligação bem-sucedida
            </span>
            <p className="text-on-surface-variant text-sm">{detalhe}</p>
          </div>
        )}

        {status === "erro" && (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-error font-bold">
              <span className="w-2 h-2 rounded-full bg-error" />
              Erro na ligação
            </span>
            <p className="text-error text-sm">{detalhe}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-outline-variant text-xs text-on-surface-variant">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ?? "não definida"}
        </div>
      </div>
    </main>
  );
}