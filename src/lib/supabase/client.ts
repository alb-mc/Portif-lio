import { createBrowserClient } from "@supabase/ssr";

export function criarClienteSupabaseNavegador() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Variável NEXT_PUBLIC_SUPABASE_URL não encontrada.");
  }

  if (!supabaseAnonKey) {
    throw new Error("Variável NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada.");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}