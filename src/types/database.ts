/**
 * Tipos centralizados del modelo de datos.
 * El nombre coincide con la tabla para que sea fácil buscar.
 */

export type OrgPlan = "trial" | "basic" | "pro";
export type OrgStatus = "trial" | "active" | "expired" | "suspended";
export type MembershipRole = "owner" | "admin" | "member";
export type MembershipStatus = "active" | "invited" | "suspended";

export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  background_url: string | null;
  theme: OrgTheme;
  plan: OrgPlan;
  subscription_status: OrgStatus;
  trial_ends_at: string | null;
  security_code_hash: string;
  security_code_updated_at: string;
  created_at: string;
}

export interface OrgTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  base: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
}

export const DEFAULT_THEME: OrgTheme = {
  primary: "99 85 184",
  primaryDark: "78 64 154",
  primaryLight: "237 233 248",
  base: "223 211 194",
  surface: "255 255 255",
  textPrimary: "28 24 48",
  textSecondary: "74 68 104",
};

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: MembershipRole;
  status: MembershipStatus;
  created_at: string;
}

export interface Category {
  id: string;
  org_id: string;
  key: string;
  label: string;
  emoji: string;
  sort_order: number;
  created_at: string;
}

export interface Contact {
  id: string;
  org_id: string;
  phone: string;
  phone_normalized: string;
  name: string;
  category_id: string | null;
  category_label: string | null;
  category_emoji: string | null;
  added_by_name: string | null;
  added_by_session: string;
  floor: number | null;
  apartment: string | null;
  rating_sum: number;
  rating_count: number;
  avg_rating: number;
  created_at: string;
}

export interface Vote {
  id: string;
  contact_id: string;
  session_id: string;
  rating: number;
  voter_name: string | null;
  floor: number | null;
  apartment: string | null;
  comment: string | null;
  created_at: string;
}

export interface Tables {
  organizations: Organization;
  profiles: Profile;
  memberships: Membership;
  categories: Category;
  contacts: Contact;
  votes: Vote;
}
