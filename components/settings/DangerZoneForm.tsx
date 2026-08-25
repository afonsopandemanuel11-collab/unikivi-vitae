"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DangerZoneForm({ profile }: { profile: any }) {
  const router = useRouter();
  const [deactivating, setDeactivating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInactive = profile.status === "INACTIVE";

  async function handleToggleDeactivate() {
    setDeactivating(true);
    setError(null);

    const supabase = createClient();
    const newStatus = isInactive ? "PENDING_VERIFICATION" : "INACTIVE";

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("user_id", profile.user_id);

    if (updateError) {
      setError("Nao foi possivel atualizar o estado da conta.");
      setDeactivating(false);
      return;
    }

    if (newStatus === "INACTIVE") {
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }

    router.refresh();
    setDeactivating(false);
  }

  async function handleDeleteAccount() {
    if (confirmText !== "ELIMINAR") return;

    setDeleting(true);
    setError(null);

    const res = await fetch("/api/account/delete", { method: "POST" });

    if (!res.ok) {
      setError("Nao foi possivel eliminar a conta. Tente novamente.");
      setDeleting(false);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div>
      <h2 className="font-headline-lg text-headline-lg text-primary mb-2 text-2xl">
        Zona de Perigo
      </h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Acoes irreversiveis relacionadas com a sua conta institucional.
      </p>

      <div className="bg-error-container/10 border border-error/20 rounded-xl divide-y divide-error/10">
        <div className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-primary mb-1">
              {isInactive ? "Reativar conta" : "Desativar conta"}
            </p>
            <p className="text-sm text-on-surface-variant max-w-md">
              {isInactive
                ? "A sua conta esta atualmente inativa. Pode reativa-la a qualquer momento."
                : "Oculta temporariamente o seu perfil e dados. Pode ser reativado ao entrar de novo."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleDeactivate}
            disabled={deactivating}
            className="border border-outline-variant text-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {deactivating ? "A processar..." : isInactive ? "Reativar Conta" : "Desativar Conta"}
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <p className="font-bold text-error mb-1">Eliminar conta</p>
              <p className="text-sm text-on-surface-variant max-w-md">
                Remove permanentemente todos os seus dados. Esta acao nao pode ser desfeita.
              </p>
            </div>
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-error text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Eliminar Conta
              </button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="bg-white border border-error/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-on-surface">
                Esta acao e permanente. Escreva{" "}
                <strong className="font-mono">ELIMINAR</strong> para confirmar.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                className="w-full max-w-xs border border-outline-variant rounded-lg p-2.5 text-sm focus:outline-none focus:border-error transition-colors"
              />
              {error && <p className="text-error text-xs">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmText("");
                  }}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "ELIMINAR" || deleting}
                  className="bg-error text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {deleting ? "A eliminar..." : "Confirmar eliminacao definitiva"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}