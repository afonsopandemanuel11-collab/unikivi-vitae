"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString } from "@/lib/form-data";
import type { Enums } from "@/lib/supabase/database.types";

const VISIBILITIES = ["PUBLIC", "INSTITUTIONAL", "RESTRICTED", "PRIVATE"] as const satisfies readonly Enums<"visibility_enum">[];

export async function saveVideoPitch(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const url = formString(formData, "video_pitch_url") || null;
  const title = formString(formData, "video_pitch_title") || null;
  const submittedVisibility = formString(formData, "video_pitch_visibility");
  const visibility = VISIBILITIES.includes(submittedVisibility as Enums<"visibility_enum">)
    ? submittedVisibility as Enums<"visibility_enum">
    : "PUBLIC";

  const { error } = await supabase
    .from("profiles")
    .update({
      video_pitch_url: url,
      video_pitch_title: title,
      video_pitch_visibility: visibility,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("[Supabase Error] video_pitch update:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/video-pitch");
  return { success: true };
}
