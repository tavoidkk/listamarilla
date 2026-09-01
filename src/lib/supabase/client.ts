"use client";

import { createBrowserClient, type CookieMethodsBrowser } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient<Database> | null = null;

/**
 * Cliente Supabase para Client Components.
 * Singleton: una sola instancia por sesión del navegador.
 */
export function createClient(): SupabaseClient<Database> {
  if (cached) return cached;
  const env = publicEnv;
  cached = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          if (typeof document === "undefined") return [];
          return document.cookie
            .split("; ")
            .filter(Boolean)
            .map((c) => {
              const [name, ...rest] = c.split("=");
              return { name, value: rest.join("=") };
            });
        },
        setAll(cookiesToSet) {
          if (typeof document === "undefined") return;
          for (const { name, value, options } of cookiesToSet) {
            let cookie = `${name}=${value}`;
            if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
            if (options?.path) cookie += `; Path=${options.path}`;
            if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
            if (options?.secure) cookie += "; Secure";
            document.cookie = cookie;
          }
        },
      } satisfies CookieMethodsBrowser,
    },
  );
  return cached;
}