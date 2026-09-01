import { createClient as createBaseClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import type { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con service_role. SOLO en server, NUNCA exponer al cliente.
 * Usar para tareas administrativas que necesitan bypass de RLS.
 */
export function createServiceClient(): SupabaseClient<Database> {
  const env = serverEnv();
  return createBaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}