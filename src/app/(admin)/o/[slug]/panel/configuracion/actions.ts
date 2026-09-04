"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getOrgBySlug } from "@/lib/data/orgs";
import { getCurrentUser, getMembershipForOrg } from "@/lib/data/session";

export async function updateFloorConfigAction(
  slug: string,
  data: {
    total_floors: number;
    apartment_labels: string[];
    special_floor_labels: Record<string, number>;
  },
) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) throw new Error("No autenticado");

  const org = await getOrgBySlug(slug);
  if (!org) throw new Error("Organización no encontrada");

  const role = await getMembershipForOrg(org.id, user.id);
  if (!user.isPlatformOwner && role !== "condo_admin") {
    throw new Error("Sin permisos");
  }

  // Upsert: si ya existe, update; si no, insert
  const { error } = await supabase
    .from("org_floor_config")
    .upsert(
      {
        org_id: org.id,
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