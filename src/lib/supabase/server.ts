import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function criarClienteSupabaseServidor() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Variável NEXT_PUBLIC_SUPABASE_URL não encontrada.");
  }

  if (!supabaseAnonKey) {
    throw new Error("Variável NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada.");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Pode acontecer em Server Components.
          // O middleware atualiza a sessão quando necessário.
        }
      },
    },
  });
}