"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Devuelve la ruta a la que debe ir el usuario autenticado tras iniciar sesión
 * desde el login del landing:
 *  - Platform owner → /superadmin
 *  - Administrador de condominio → /o/{slug}/panel (su organización)
 *  - Sin membresía → /solicitar
 */
export async function resolvePostLoginDestination(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "/login";

  if (user.app_metadata?.is_platform_owner === true) {
    return "/superadmin";
  }

  const svc = createServiceClient();

  const { data: membership } = await svc
    .from("memberships")
    .select("org:organizations(slug)")
    .eq("user_id", user.id)
    .eq("role", "condo_admin")
    .eq("status", "active")
    .maybeSingle();

  const slug =
    membership &&
    typeof membership.org === "object" &&
    membership.org !== null &&
    "slug" in membership.org
      ? (membership.org as { slug: string }).slug
      : null;

  if (!slug) return "/solicitar";

  return `/o/${slug}/panel`;
}
