"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (!email || !password || !slug) {
    redirect(`/o/${slug}/panel/login?error=Faltan%20datos`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/o/${slug}/panel/login?error=Correo%20o%20contrase%C3%B1a%20incorrectos`);
  }

  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!org || !user) {
    await supabase.auth.signOut();
    redirect(`/o/${slug}/panel/login?error=Organizaci%C3%B3n%20no%20encontrada`);
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", org.id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership || !["admin", "owner"].includes(membership.role)) {
    await supabase.auth.signOut();
    redirect(`/o/${slug}/panel/login?error=No%20tienes%20permisos%20para%20este%20edificio`);
  }

  revalidatePath("/");
  redirect(`/o/${slug}/panel`);
}

export async function logoutAction(slug: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect(`/o/${slug}/panel/login`);
}