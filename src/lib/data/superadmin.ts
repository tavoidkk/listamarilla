import { cache } from "react";
import { createServiceClient } from "@/lib/supabase/service";

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  created_at: string;
  last_sign_in_at?: string | null;
}

export interface OrgMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  profiles: { full_name: string | null } | null;
}

/**
 * Lista todos los auth.users via service_role.
 * Memoizada con React.cache(): deduplica dentro del mismo request
 * cuando múltiples páginas superadmin la piden.
 */
export const listAuthUsers = cache(async (): Promise<AuthUser[]> => {
  const svc = createServiceClient();
  const { data } = await svc.auth.admin.listUsers({ page: 1, perPage: 500 });
  return (data?.users as AuthUser[]) ?? [];
});

export interface MembershipRow {
  org_id: string;
  status: string;
}

/**
 * Devuelve todas las memberships (org_id + status) para construir
 * memberCountByOrg / activeCountByOrg en la página principal.
 */
export const listAllMemberships = cache(async (): Promise<MembershipRow[]> => {
  const svc = createServiceClient();
  const { data } = await svc
    .from("memberships")
    .select("org_id, status");
  return (data as MembershipRow[] | null) ?? [];
});

/**
 * Devuelve members con perfiles para una org específica.
 * Usado por orgs/[orgId]/page y orgs/[orgId]/members/page.
 */
export const getOrgMembersWithProfiles = cache(async (orgId: string): Promise<OrgMember[]> => {
  const svc = createServiceClient();
  const { data } = await svc
    .from("memberships")
    .select("id, user_id, role, status, profiles:profiles!memberships_user_id_fkey ( full_name )")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });
  return (data as OrgMember[] | null) ?? [];
});

/**
 * Enriquece una lista de OrgMember con emails de auth.users.
 */
export async function enrichMembersWithEmails(members: OrgMember[]): Promise<Array<OrgMember & { email: string | null }>> {
  const users = await listAuthUsers();
  const emailByUserId = new Map<string, string>();
  for (const u of users) {
    if (u.id && u.email) emailByUserId.set(u.id, u.email);
  }
  return members.map((m) => ({
    ...m,
    email: emailByUserId.get(m.user_id) ?? null,
  }));
}

/**
 * Devuelve un Map<string, string> de userId → email.
 * Usa listAuthUsers internamente (cacheada).
 */
export async function getUserEmailMap(): Promise<Map<string, string>> {
  const users = await listAuthUsers();
  const map = new Map<string, string>();
  for (const u of users) {
    if (u.id && u.email) map.set(u.id, u.email);
  }
  return map;
}
