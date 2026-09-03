import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ToastContainer } from "@/components/ui/Toast";
import { OwnerShell } from "./OwnerShell";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login`);

  const svc = createServiceClient();
  const { data: meta } = await svc.auth.admin.getUserById(user.id);
  if (!meta?.user?.app_metadata?.is_platform_owner) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface">
      <OwnerShell email={user.email ?? ""}>{children}</OwnerShell>
      <ToastContainer />
    </div>
  );
}