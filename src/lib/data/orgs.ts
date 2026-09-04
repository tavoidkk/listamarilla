import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface OrgBySlug {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  background_url: string | null;
  theme: Record<string, string> | null;
  subscription_status: string;
}

/**
 * Resuelve la organización por slug, memoizada con React.cache().
 * Deduplica la query si el layout y las sub-rutas la piden en el mismo render.
 */
export const getOrgBySlug = cache(async (slug: string): Promise<OrgBySlug | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, slug, name, logo_url, background_url, theme, subscription_status")
    .eq("slug", slug)
    .single();
  return (data as OrgBySlug | null) ?? null;
});

export interface OrgById {
  id: string;
  slug: string;
  name: string;
  plan: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
  logo_url: string | null;
  background_url: string | null;
  theme: Record<string, string> | null;
}

export const getOrgById = cache(async (id: string): Promise<OrgById | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select(
      "id, slug, name, plan, subscription_status, subscription_ends_at, trial_ends_at, created_at, logo_url, background_url, theme",
    )
    .eq("id", id)
    .single();
  return (data as OrgById | null) ?? null;
});

export interface OrgAdminRow {
  id: string;
  slug: string;
  name: string;
  plan: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

/** Query del superadmin (service_role) por org, memoizada. */
export const getOrgByIdAdmin = cache(async (id: string): Promise<OrgAdminRow | null> => {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const svc = createServiceClient();
  const { data } = await svc
    .from("organizations")
    .select("id, slug, name, plan, subscription_status, subscription_ends_at, trial_ends_at, created_at")
    .eq("id", id)
    .maybeSingle();
  return (data as OrgAdminRow | null) ?? null;
});