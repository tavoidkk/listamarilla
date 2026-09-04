import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface CurrentUser {
  id: string;
  email?: string;
  isPlatformOwner: boolean;
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? undefined,
    isPlatformOwner: user.app_metadata?.is_platform_owner === true,
  };
});

export const getMembershipForOrg = cache(async (orgId: string, userId: string): Promise<string | null> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  return (data as { role: string } | null)?.role ?? null;
});
