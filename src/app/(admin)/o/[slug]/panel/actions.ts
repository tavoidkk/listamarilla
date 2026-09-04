"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOrgBySlug } from "@/lib/data/orgs";
import { getCurrentUser, getMembershipForOrg } from "@/lib/data/session";

export async function logoutAction(slug: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function requireOrg(slug: string) {
  const org = await getOrgBySlug(slug);
  if (!org) throw new Error("Organización no encontrada");

  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado");

  const role = await getMembershipForOrg(org.id, user.id);

  if (!user.isPlatformOwner && role !== "condo_admin") {
    throw new Error("Sin permisos");
  }

  return { orgId: org.id, userId: user.id };
}

// ============== CONTACTOS ==============

export async function deleteContactAction(slug: string, contactId: string) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", contactId).eq("org_id", orgId);
  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/contactos`);
  revalidatePath(`/o/${slug}`);
}

export async function updateContactAction(
  slug: string,
  contactId: string,
  data: { name?: string; phone?: string; category_id?: string },
) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const updates: { name?: string; phone?: string; phone_normalized?: string; category_id?: string; category_label?: string; category_emoji?: string } = {};
  if (data.name) updates.name = data.name;
  if (data.phone) {
    updates.phone = data.phone;
    updates.phone_normalized = data.phone.replace(/\D/g, "");
  }
  if (data.category_id) {
    const { data: cat } = await supabase
      .from("categories")
      .select("label, emoji")
      .eq("id", data.category_id)
      .eq("org_id", orgId)
      .single();
    if (cat) {
      updates.category_id = data.category_id;
      updates.category_label = cat.label;
      updates.category_emoji = cat.emoji;
    }
  }
  const { error } = await supabase.from("contacts").update(updates).eq("id", contactId).eq("org_id", orgId);
  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/contactos`);
  revalidatePath(`/o/${slug}`);
}

// ============== CATEGORÍAS ==============

export async function createCategoryAction(
  slug: string,
  data: { key: string; label: string; emoji: string },
) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ org_id: orgId, ...data })
    .select()
    .single();
  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/categorias`);
  revalidatePath(`/o/${slug}`);
}

export async function deleteCategoryAction(slug: string, categoryId: string) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId).eq("org_id", orgId);
  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/categorias`);
  revalidatePath(`/o/${slug}`);
}

// ============== CÓDIGO DE SEGURIDAD ==============

export async function updateSecurityCodeAction(slug: string, newCode: string) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  // Actualizar hash con crypt de Postgres. update_org_security_code es
  // SECURITY DEFINER, por lo que no necesita el fallback de service_role.
  const { error } = await supabase.rpc("update_org_security_code", {
    p_org_id: orgId,
    p_code: newCode,
  });
  if (error) {
    console.warn(
      "[updateSecurityCodeAction] fallo al guardar código de seguridad:",
      error.message,
    );
    throw error;
  }
  revalidatePath(`/o/${slug}/panel/codigo-seguridad`);
}

export async function getSecurityCodeAction(slug: string) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_org_security_code", {
    p_org_id: orgId,
  });
  if (error) throw error;
  return (data as string) ?? null;
}

// ============== BRANDING ==============

export async function updateBrandingAction(
  slug: string,
  data: {
    name?: string;
    logo_url?: string;
    background_url?: string | null;
    theme?: Record<string, string>;
  },
) {
  const { orgId } = await requireOrg(slug);
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update(data).eq("id", orgId);
  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/branding`);
  revalidatePath(`/o/${slug}`);
}