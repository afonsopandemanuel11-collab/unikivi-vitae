import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next");
  const destination = next === "/nova-senha" ? "/nova-senha" : "/recuperar-senha?erro=link";
  const supabase = await createClient();

  let error: unknown;
  if (tokenHash && type === "recovery") {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else {
    error = new Error("Código de recuperação ausente.");
  }

  if (error) {
    return NextResponse.redirect(new URL("/recuperar-senha?erro=link", request.url));
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
