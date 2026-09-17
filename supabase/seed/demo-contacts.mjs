// Run with: node --env-file=.env.local supabase/seed/demo-contacts.mjs
// Fictional entries for the Colina del Este test organization only.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Falta la configuración de Supabase");
const db = createClient(url, key, { auth: { persistSession: false } });

const { data: org, error: orgError } = await db
  .from("organizations")
  .select("id, slug")
  .eq("slug", "colina-del-este")
  .single();
if (orgError || org?.slug !== "colina-del-este")
  throw orgError ?? new Error("Organización incorrecta");

const { data: categories, error: categoryError } = await db
  .from("categories")
  .select("id, label, emoji, key")
  .eq("org_id", org.id)
  .order("sort_order");
if (categoryError) throw categoryError;
const { data: existing, error: existingError } = await db
  .from("contacts")
  .select("phone_normalized")
  .eq("org_id", org.id);
if (existingError) throw existingError;
const numbers = new Set(existing.map(({ phone_normalized }) => phone_normalized));

const rows = categories
  .flatMap((category, categoryIndex) =>
    [1, 2, 3].map((number) => {
      const phone = `000000${String(categoryIndex + 1).padStart(2, "0")}${number}`;
      return {
        org_id: org.id,
        category_id: category.id,
        category_label: category.label,
        category_emoji: category.emoji,
        phone,
        phone_normalized: phone,
        name: `${category.label} · prestador de prueba ${number}`,
        added_by_name: "Datos de prueba",
        added_by_session: "seed:colina-del-este",
      };
    }),
  )
  .filter(({ phone_normalized }) => !numbers.has(phone_normalized));

if (rows.length) {
  const { error } = await db.from("contacts").insert(rows);
  if (error) throw error;
}

const { count, error: countError } = await db
  .from("contacts")
  .select("id", { count: "exact", head: true })
  .eq("org_id", org.id);
if (countError) throw countError;
console.warn(
  `Colina del Este: ${rows.length} contactos de prueba agregados; ${count} contactos en total.`,
);
