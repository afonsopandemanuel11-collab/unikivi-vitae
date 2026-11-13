import { randomUUID } from "node:crypto";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const VISITOR_COOKIE = "unikivi_profile_visitor_id";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get("origin");
  const requestHost =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ??
    request.headers.get("host");

  let isSameOrigin = false;
  try {
    isSameOrigin = Boolean(
      origin &&
        requestHost &&
        new URL(origin).host.toLowerCase() === requestHost.toLowerCase()
    );
  } catch {
    isSameOrigin = false;
  }

  if (!isSameOrigin) {
    return new Response(null, { status: 403 });
  }

  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) return new Response(null, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Profile view tracking requires Supabase server credentials.");
    return new Response(null, { status: 503 });
  }

  const admin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, user_id")
    .eq("id", id)
    .eq("visibility", "PUBLIC")
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (profileError) {
    console.error("Could not validate a profile view.", profileError.message);
    return new Response(null, { status: 204 });
  }
  if (!profile) return new Response(null, { status: 404 });

  const sessionClient = await createClient();
  const { data: viewerData } = await sessionClient.auth.getUser();
  if (viewerData.user?.id === profile.user_id) {
    return new Response(null, { status: 204 });
  }

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!visitorId || !UUID_PATTERN.test(visitorId)) {
    visitorId = randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const { error: insertError } = await admin.from("profile_views").upsert(
    { profile_id: profile.id, visitor_id: visitorId },
    {
      onConflict: "profile_id,visitor_id,viewed_on",
      ignoreDuplicates: true,
    }
  );

  if (insertError) {
    console.error("Could not record a profile view.", insertError.message);
  }

  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
