import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para Server Components, Route Handlers y Server Actions.
 * Lee/escribe cookies del request actual.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();
  const env = publicEnv;

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components no pueden setear cookies.
        }
      },
    } satisfies CookieMethodsServer,
  });
}