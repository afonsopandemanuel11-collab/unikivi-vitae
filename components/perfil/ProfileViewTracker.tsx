"use client";

import { useEffect } from "react";

export default function ProfileViewTracker({
  profileId,
  enabled,
}: {
  profileId: string;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;

    void fetch(`/api/perfil/${encodeURIComponent(profileId)}/view`, {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {
      // A falha de analytics não deve afetar a visualização do perfil.
    });
  }, [enabled, profileId]);

  return null;
}
