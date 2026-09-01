import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ToastContainer } from "@/components/ui/Toast";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login`);

  // Verificar JWT app_metadata.is_platform_owner = true
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) notFound();

  // Validar con service_role (puede bypassear RLS)
  const svc = createServiceClient();
  const { data: meta } = await svc.auth.admin.getUserById(user.id);
  if (!meta?.user?.app_metadata?.is_platform_owner) {
    notFound();
  }

  return (
    <div className="bg-app-overlay min-h-screen">
      <div className="app-shell min-h-screen bg-white">{children}</div>
      <ToastContainer />
    </div>
  );
}