import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";

/**
 * Proxy (Next.js 16) - reemplaza middleware.
 * Mantiene la sesión Supabase viva refrescando tokens si es necesario.
 *
 * Importante: este proxy NO aplica reglas de autorización.
 * Cada Server Action / Route Handler valida la sesión internamente.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = publicEnv;

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refresca la sesión si está por expirar.
  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|robots.txt|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};