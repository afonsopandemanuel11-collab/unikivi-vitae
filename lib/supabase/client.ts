import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local."
    );
  }

  // createBrowserClient do @supabase/ssr é o cliente correto para o browser:
  // sincroniza automaticamente os cookies de sessão com o middleware,
  // garante que o JWT está sempre actualizado após signUp/signIn,
  // e é thread-safe (cria singleton internamente quando chamado com os mesmos args).
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
