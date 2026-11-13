"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formString, optionalFormString } from "@/lib/form-data";
import type { Enums, TablesUpdate } from "@/lib/supabase/database.types";

const VISIBILITIES = ["PUBLIC", "INSTITUTIONAL", "RESTRICTED", "PRIVATE"] as const satisfies readonly Enums<"visibility_enum">[];

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

  const submittedVisibility = formString(formData, "visibility");
  const updates: TablesUpdate<"profiles"> = {
    full_name: formString(formData, "full_name"),
    professional_name: optionalFormString(formData, "professional_name"),
    bio: optionalFormString(formData, "bio"),
    institutional_email: optionalFormString(formData, "institutional_email"),
    phone: optionalFormString(formData, "phone"),
    nationality: optionalFormString(formData, "nationality"),
    birth_year: formString(formData, "birth_year") ? Number(formString(formData, "birth_year")) : null,
    gender: optionalFormString(formData, "gender"),
    faculty_id: optionalFormString(formData, "faculty_id"),
    department_id: optionalFormString(formData, "department_id"),
    position_id: optionalFormString(formData, "position_id"),
    visibility: VISIBILITIES.includes(submittedVisibility as Enums<"visibility_enum">)
      ? submittedVisibility as Enums<"visibility_enum">
      : "PUBLIC",
  };

  if (photo_url) updates.photo_url = photo_url;

  const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard");
  revalidatePath(`/perfil/${user.id}`);
  return { success: true };
}

