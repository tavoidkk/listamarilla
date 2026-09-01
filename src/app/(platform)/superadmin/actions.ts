"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";

export async function toggleSubscriptionAction(orgId: string, currentStatus: string) {
  const svc = createServiceClient();
  const next = currentStatus === "active" ? "trial" : "active";
  const { error } = await svc
    .from("organizations")
    .update({ subscription_status: next, plan: next === "active" ? "pro" : "trial" })
    .eq("id", orgId);
  if (error) throw error;
  revalidatePath("/superadmin");
}