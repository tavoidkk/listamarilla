"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateFloorConfigAction(
  slug: string,
  data: {
    total_floors: number;
    apartment_labels: string[];
    special_floor_labels: Record<string, number>;
  },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) throw new Error("Organización no encontrada");

  // Upsert: si ya existe, update; si no, insert
  const { error } = await supabase
    .from("org_floor_config")
    .upsert(
      {
        org_id: (org as { id: string }).id,
        total_floors: data.total_floors,
        apartment_labels: data.apartment_labels,
        special_floor_labels: data.special_floor_labels,
      },
      { onConflict: "org_id" },
    );

  if (error) throw error;
  revalidatePath(`/o/${slug}/panel/configuracion`);
  revalidatePath(`/o/${slug}`);
}