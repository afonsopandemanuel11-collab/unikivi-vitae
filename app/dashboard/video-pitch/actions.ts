"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveVideoPitch(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Utilizador não autenticado." };

  const url = (formData.get("video_pitch_url") as string)?.trim() || null;
  const title = (formData.get("video_pitch_title") as string)?.trim() || null;
  const visibility = (formData.get("video_pitch_visibility") as string) || "PUBLIC";

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
