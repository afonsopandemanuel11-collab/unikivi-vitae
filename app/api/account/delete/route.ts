import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = await createServerClient();

  // 1. confirma quem esta a pedir, usando a sessao normal (nao a admin)
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  // 2. só agora usamos o cliente admin, e só para apagar ESTE utilizador
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);

  if (deleteError) {
    return NextResponse.json({ error: "Nao foi possivel eliminar a conta." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}