"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

// =====================================================================
// ORGANIZACIONES
// =====================================================================

export async function setOrgPlanAction(orgId: string, plan: "trial" | "pro") {
  const svc = createServiceClient();
  const now = new Date();
  const update: {
    plan: "trial" | "pro";
    subscription_status: "trial" | "active";
    subscription_ends_at?: string | null;
    trial_ends_at?: string | null;
  } = {
    plan,
    subscription_status: plan === "pro" ? "active" : "trial",
  };

  if (plan === "pro") {
    const next = new Date(now);
    next.setFullYear(next.getFullYear() + 1);
    update.subscription_ends_at = next.toISOString();
    update.trial_ends_at = null;
  } else {
    update.trial_ends_at = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    update.subscription_ends_at = null;
  }

  const { error } = await svc.from("organizations").update(update).eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function toggleSubscriptionAction(orgId: string, currentStatus: string) {
  const svc = createServiceClient();
  const next = currentStatus === "active" ? "trial" : "active";
  const update: {
    subscription_status: "trial" | "active";
    plan: "trial" | "pro";
    subscription_ends_at?: string | null;
  } = {
    subscription_status: next,
    plan: next === "active" ? "pro" : "trial",
  };

  if (next === "active") {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    update.subscription_ends_at = endDate.toISOString();
  } else {
    update.subscription_ends_at = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await svc.from("organizations").update(update as any).eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function deactivateOrgAction(orgId: string) {
  const svc = createServiceClient();
  const { error } = await svc
    .from("organizations")
    .update({
      subscription_status: "expired",
      subscription_ends_at: new Date().toISOString(),
    })
    .eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function activateOrgAction(orgId: string) {
  const svc = createServiceClient();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  const { error } = await svc
    .from("organizations")
    .update({
      subscription_status: "active",
      plan: "pro",
      subscription_ends_at: endDate.toISOString(),
    })
    .eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function extendTrialAction(orgId: string) {
  const svc = createServiceClient();
  const newDate = new Date();
  newDate.setFullYear(newDate.getFullYear() + 1);
  const { error } = await svc
    .from("organizations")
    .update({
      trial_ends_at: newDate.toISOString(),
      subscription_status: "trial",
      plan: "trial",
    })
    .eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

// Crear organización nueva (crea también el administrador de condominio obligatorio)
export async function createOrgAction(formData: FormData) {
  const svc = createServiceClient();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const securityCode = String(formData.get("security_code") ?? "").trim();

  // Datos del administrador de condominio (obligatorio)
  const adminName = String(formData.get("admin_name") ?? "").trim();
  const adminEmail = String(formData.get("admin_email") ?? "").trim().toLowerCase();
  const adminPassword = String(formData.get("admin_password") ?? "").trim();

  if (!name || !slug || !securityCode) {
    return { ok: false as const, error: "Nombre, slug y código de seguridad son obligatorios" };
  }
  if (slug.length < 3) {
    return { ok: false as const, error: "El slug debe tener al menos 3 caracteres" };
  }
  if (!adminName || !adminEmail || !adminPassword) {
    return { ok: false as const, error: "Debes crear el administrador de condominio (nombre, email y contraseña)" };
  }
  if (adminPassword.length < 8) {
    return { ok: false as const, error: "La contraseña del administrador debe tener al menos 8 caracteres" };
  }

  // Verificar que el slug no exista (case-insensitive)
  const { data: existing } = await svc
    .from("organizations")
    .select("id, slug, name")
    .or(`slug.ilike.${slug},slug.eq.${slug}`)
    .maybeSingle();
  if (existing) {
    return {
      ok: false as const,
      error: `Ya existe una organización con el slug "${slug}" (ID: ${existing.id}). Si no aparece en la lista, intenta recargar la página o contacta al admin.`,
    };
  }

  // Calcular fechas iniciales (Trial por defecto)
  const now = new Date();
  const trialEnds = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

  // Hashear el código de seguridad usando la RPC crypt_org_code.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: hashResult, error: hashErr } = await (svc.rpc as any)("crypt_org_code", {
    code: securityCode,
  });

  if (hashErr || hashResult === null || hashResult === undefined) {
    return {
      ok: false as const,
      error:
        'No se pudo hashear el código de seguridad. Necesitas crear esta RPC en Supabase: SQL Editor → "create or replace function public.crypt_org_code(code text) returns text language sql stable as $$ select crypt(code, gen_salt(\'bf\', 10)); $$;".',
    };
  }

  const { data: inserted, error } = await svc
    .from("organizations")
    .insert({
      name,
      slug,
      security_code_hash: String(hashResult),
      plan: "trial",
      subscription_status: "trial",
      trial_ends_at: trialEnds,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, error: error.message };
  }

  const orgId = inserted?.id;
  if (!orgId) {
    return { ok: false as const, error: "No se obtuvo el ID de la organización creada" };
  }

  // Crear el administrador de condominio
  const adminResult = await createAdministratorForOrg(svc, orgId, {
    name: adminName,
    email: adminEmail,
    password: adminPassword,
  });
  if (!adminResult.ok) {
    // Limpiar la org recién creada si falla la creación del admin
    await svc.from("organizations").delete().eq("id", orgId);
    return { ok: false as const, error: adminResult.error };
  }

  revalidatePath("/superadmin");
  return { ok: true as const, id: orgId };
}

/**
 * Crea un usuario de auth + profile + membresía 'condo_admin' en una organización.
 * Es un helper compartido entre createOrgAction y createCondoAdminAction.
 */
async function createAdministratorForOrg(
  svc: ReturnType<typeof createServiceClient>,
  orgId: string,
  input: { name: string; email: string; password: string },
) {
  const normalizedEmail = input.email.toLowerCase();

  // 1) Averiguar si ya existe un usuario con ese email.
  let existingUserId: string | null = null;
  {
    const { data: list } = await svc.auth.admin.listUsers({ page: 1, perPage: 1000 });
    existingUserId =
      list?.users.find((u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail)?.id ?? null;
  }

  // 2) Si no existe, intentar crearlo. Si al crearlo falla por duplicado, reutilizarlo.
  if (!existingUserId) {
    const { data: created, error: createErr } = await svc.auth.admin.createUser({
      email: normalizedEmail,
      password: input.password,
      email_confirm: true,
      app_metadata: { is_platform_owner: false },
      user_metadata: { full_name: input.name },
    });
    if (createErr) {
      const isDuplicate =
        createErr?.message?.toLowerCase().includes("already been registered") ||
        createErr?.message?.toLowerCase().includes("duplicate") ||
        createErr?.message?.toLowerCase().includes("ya existe") ||
        createErr?.message?.toLowerCase().includes("already exists");
      if (isDuplicate) {
        // Reintentar buscar el id tras el error de duplicado
        const { data: list2 } = await svc.auth.admin.listUsers({ page: 1, perPage: 1000 });
        existingUserId =
          list2?.users.find((u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail)?.id ?? null;
      } else {
        return { ok: false as const, error: createErr?.message ?? "No se pudo crear el usuario" };
      }
    } else if (created?.user) {
      existingUserId = created.user.id;
    }
  }

  if (!existingUserId) {
    return { ok: false as const, error: "No se pudo determinar el usuario para esta organización" };
  }

  // 3) Completar el perfil (el trigger ya pudo haberlo creado con el id).
  const { error: profErr } = await svc.from("profiles").upsert(
    {
      id: existingUserId,
      full_name: input.name,
    },
    { onConflict: "id" },
  );
  if (profErr) {
    return { ok: false as const, error: `No se pudo crear el perfil: ${profErr.message}` };
  }

  // 4) Crear la membresía como administrador de condominio (si aún no existe en esa org).
  //    Un administrador de condominio no se reutiliza entre edificios distintos.
  const { data: existingMem } = await svc
    .from("memberships")
    .select("org_id")
    .eq("user_id", existingUserId)
    .eq("role", "condo_admin")
    .neq("org_id", orgId)
    .maybeSingle();
  if (existingMem) {
    return {
      ok: false as const,
      error: `El email ${normalizedEmail} ya es administrador de condominio de otra organización. No se reutilizan usuarios entre edificios.`,
    };
  }

  const { error: memErr } = await svc.from("memberships").upsert(
    {
      org_id: orgId,
      user_id: existingUserId,
      role: "condo_admin",
      status: "active",
    },
    { onConflict: "user_id,org_id" },
  );
  if (memErr) {
    return { ok: false as const, error: `No se pudo crear la membresía: ${memErr.message}` };
  }

  return { ok: true as const, userId: existingUserId };
}

// Editar organización existente
export async function updateOrgAction(orgId: string, formData: FormData) {
  const svc = createServiceClient();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const logoUrl = formData.get("logo_url");
  const backgroundUrl = formData.get("background_url");

  if (!name || !slug) {
    return { ok: false as const, error: "Nombre y slug son obligatorios" };
  }

  // Verificar unicidad del slug si cambió
  const { data: current } = await svc.from("organizations").select("slug").eq("id", orgId).maybeSingle();
  if (!current) return { ok: false as const, error: "Organización no encontrada" };
  if (current.slug !== slug) {
    const { data: dup } = await svc.from("organizations").select("id").eq("slug", slug).maybeSingle();
    if (dup && dup.id !== orgId) {
      return { ok: false as const, error: `Ya existe otra organización con el slug "${slug}"` };
    }
  }

  const update: Record<string, unknown> = { name, slug };
  if (logoUrl !== null) update.logo_url = String(logoUrl).trim() || null;
  if (backgroundUrl !== null) update.background_url = String(backgroundUrl).trim() || null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await svc.from("organizations").update(update as any).eq("id", orgId);
  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/superadmin");
  return { ok: true as const };
}

// Eliminar organización (y todo lo relacionado)
export async function deleteOrgAction(orgId: string) {
  const svc = createServiceClient();
  // 1. Eliminar contactos
  await svc.from("contacts").delete().eq("org_id", orgId);
  // 2. Eliminar votos (a través de contacts que ya no existen, pero por seguridad)
  // 3. Eliminar categorías
  await svc.from("categories").delete().eq("org_id", orgId);
  // 4. Eliminar config de pisos
  await svc.from("org_floor_config").delete().eq("org_id", orgId);
  // 5. Eliminar membresías
  await svc.from("memberships").delete().eq("org_id", orgId);
  // 6. Eliminar organización
  const { error } = await svc.from("organizations").delete().eq("id", orgId);
  if (error) {
    return { ok: false as const, error: error.message };
  }
  revalidatePath("/superadmin");
  return { ok: true as const };
}

// =====================================================================
// ADMINISTRADORES DE CONDOMINIO (miembros de una organización)
// =====================================================================

// Crear un nuevo administrador de condominio (usuario nuevo + membresía)
export async function createCondoAdminAction(orgId: string, formData: FormData) {
  const svc = createServiceClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();

  if (!name || !email || !password) {
    return { ok: false as const, error: "Nombre, email y contraseña son obligatorios" };
  }
  if (password.length < 8) {
    return { ok: false as const, error: "La contraseña debe tener al menos 8 caracteres" };
  }

  const { ok, error, userId } = await createAdministratorForOrg(svc, orgId, { name, email, password });
  if (!ok) return { ok: false as const, error };

  revalidatePath("/superadmin");
  revalidatePath(`/superadmin/orgs/${orgId}`);
  revalidatePath(`/superadmin/orgs/${orgId}/members`);
  return { ok: true as const, userId, email };
}

export async function updateMemberAction(formData: FormData) {
  const svc = createServiceClient();
  const membershipId = String(formData.get("membership_id") ?? "");
  const status = String(formData.get("status") ?? "") as string;

  if (!membershipId) return { ok: false as const, error: "ID de membresía requerido" };

  const update: { status: string; role?: string } = { status };
  if (status === "active" || status === "invited" || status === "suspended") {
    update.status = status;
  }

  const { error } = await svc.from("memberships").update(update).eq("id", membershipId);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/superadmin");
  return { ok: true as const };
}

export async function suspendMemberAction(membershipId: string) {
  const svc = createServiceClient();
  const { error } = await svc.from("memberships").update({ status: "suspended" }).eq("id", membershipId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function reactivateMemberAction(membershipId: string) {
  const svc = createServiceClient();
  const { error } = await svc.from("memberships").update({ status: "active" }).eq("id", membershipId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

export async function removeMemberAction(membershipId: string) {
  const svc = createServiceClient();
  const { error } = await svc.from("memberships").delete().eq("id", membershipId);
  if (error) throw error;
  revalidatePath("/superadmin");
}

// Editar perfil del usuario (nombre)
export async function updateProfileAction(formData: FormData) {
  const svc = createServiceClient();
  const userId = String(formData.get("user_id") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!userId) return { ok: false as const, error: "ID de usuario requerido" };

  const { error } = await svc.from("profiles").update({ full_name, phone }).eq("id", userId);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/superadmin");
  return { ok: true as const };
}

// Actualizar email del usuario en auth.users
export async function updateUserEmailAction(formData: FormData) {
  const svc = createServiceClient();
  const userId = String(formData.get("user_id") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!userId || !email) return { ok: false as const, error: "Datos incompletos" };

  const { error } = await svc.auth.admin.updateUserById(userId, { email, email_confirm: true });
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/superadmin");
  return { ok: true as const };
}

// =====================================================================
// OWNERS (platform_owners) — TODAS son void-returning
// =====================================================================

/**
 * Genera una contraseña aleatoria segura de 12 caracteres.
 */
function generatePassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let pwd = "";
  for (let i = 0; i < 12; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

/**
 * Crea un nuevo platform_owner en auth.users con flag is_platform_owner=true
 * automáticamente asignada. La contraseña se genera y se devuelve al admin
 * para que se la comunique al nuevo owner.
 */
export async function createOwnerAction(formData: FormData) {
  const svc = createServiceClient();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim() || generatePassword();

  if (!email) {
    return { ok: false as const, error: "El email es obligatorio" };
  }
  if (password.length < 8) {
    return { ok: false as const, error: "La contraseña debe tener al menos 8 caracteres" };
  }

  // 1. Verificar que el email no exista
  const { data: list } = await svc.auth.admin.listUsers({ page: 1, perPage: 500 });
  const existing = list?.users.find((u: { email?: string }) => u.email?.toLowerCase() === email);
  if (existing) {
    return { ok: false as const, error: `Ya existe un usuario con email ${email}` };
  }

  // 2. Crear usuario en auth.users CON flag is_platform_owner=true desde el inicio
  const { data: created, error: createErr } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_platform_owner: true },
    user_metadata: { full_name },
  });

  if (createErr || !created?.user) {
    return { ok: false as const, error: createErr?.message ?? "No se pudo crear el owner" };
  }

  revalidatePath("/superadmin/owners");
  return {
    ok: true as const,
    userId: created.user.id,
    email,
    password,
    full_name,
  };
}

// Editar owner (full_name y email)
export async function updateOwnerAction(formData: FormData) {
  const svc = createServiceClient();
  const userId = String(formData.get("user_id") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const full_name = String(formData.get("full_name") ?? "").trim();

  if (!userId) return { ok: false as const, error: "ID de owner requerido" };
  if (!email) return { ok: false as const, error: "Email obligatorio" };

  // 1. Actualizar email en auth.users
  const { error: emailErr } = await svc.auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (emailErr) return { ok: false as const, error: emailErr.message };

  // 2. Actualizar profile
  const { error: profErr } = await svc.from("profiles").update({ full_name }).eq("id", userId);
  if (profErr) return { ok: false as const, error: profErr.message };

  revalidatePath("/superadmin/owners");
  return { ok: true as const };
}

// Resetear contraseña de un owner (devuelve nueva)
export async function resetOwnerPasswordAction(userId: string) {
  const svc = createServiceClient();
  const newPassword = generatePassword();
  const { error } = await svc.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/superadmin/owners");
  return { ok: true as const, password: newPassword };
}

export async function updateOwnerMetaAction(userId: string, isPlatformOwner: boolean) {
  const svc = createServiceClient();
  const { data: existing, error: getErr } = await svc.auth.admin.getUserById(userId);
  if (getErr || !existing?.user) return;

  const currentMeta = (existing.user.app_metadata ?? {}) as Record<string, unknown>;
  const nextMeta: Record<string, unknown> = { ...currentMeta, is_platform_owner: isPlatformOwner };

  const { error } = await svc.auth.admin.updateUserById(userId, { app_metadata: nextMeta });
  if (error) return;
  revalidatePath("/superadmin/owners");
}

export async function deleteOwnerAction(userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const svc = createServiceClient();
  await svc.from("memberships").delete().eq("user_id", userId);
  await svc.from("profiles").delete().eq("id", userId);
  const { error } = await svc.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/superadmin/owners");
  return { ok: true };
}

// =====================================================================
// LOGOUT desde el superadmin
// =====================================================================

export async function ownerLogoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}