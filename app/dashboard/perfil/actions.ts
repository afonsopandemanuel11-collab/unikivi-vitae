"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdatePersonalDataResult = { success: boolean; error?: string };

export async function updatePersonalData(formData: FormData): Promise<UpdatePersonalDataResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autenticado." };

  const photoFile = formData.get("photo") as File | null;
  let photo_url: string | undefined;

  if (photoFile && photoFile.size > 0) {
    const ext = photoFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, photoFile, { upsert: true });

    if (uploadError) return { success: false, error: "Falha ao enviar a foto: " + uploadError.message };

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    photo_url = publicUrlData.publicUrl;
  }

  const updates: Record<string, unknown> = {
    full_name: formData.get("full_name"),
    professional_name: formData.get("professional_name") || null,
    bio: formData.get("bio") || null,
    institutional_email: formData.get("institutional_email") || null,
    phone: formData.get("phone") || null,
    nationality: formData.get("nationality") || null,
    birth_year: formData.get("birth_year") ? Number(formData.get("birth_year")) : null,
    gender: formData.get("gender") || null,
    faculty_id: formData.get("faculty_id") || null,
    department_id: formData.get("department_id") || null,
    position_id: formData.get("position_id") || null,
    visibility: formData.get("visibility") || "PUBLIC",
  };

  if (photo_url) updates.photo_url = photo_url;

  const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
  revalidatePath(`/perfil/${user.id}`);
  return { success: true };
}

