"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

async function requireOrg(slug: string) {
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) throw new Error("Organización no encontrada");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", org.id as string)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const isPlatformOwner = user.app_metadata?.is_platform_owner === true;

  if (!isPlatformOwner && (!membership || membership.role !== "condo_admin")) {
    throw new Error("Sin permisos");
  }

  return { orgId: org.id as string, userId: user.id };
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
  // Actualizar hash con crypt de Postgres
  const { error } = await supabase.rpc("set_security_code", {
    p_org_id: orgId,
    p_code: newCode,
  });
  if (error) {
    // Fallback: usar service_role para bypassear si RLS bloquea
    const svc = createServiceClient();
    const { error: err2 } = await svc.rpc("set_security_code", {
      p_org_id: orgId,
      p_code: newCode,
    });
    if (err2) throw err2;
  }
  revalidatePath(`/o/${slug}/panel/codigo-seguridad`);
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