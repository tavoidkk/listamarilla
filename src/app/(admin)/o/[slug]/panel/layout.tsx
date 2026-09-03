import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { themeToCssVars } from "@/lib/theme";
import { ToastContainer } from "@/components/ui/Toast";
import { Logo } from "@/components/brand/Logo";
import { AdminSidebar } from "./AdminSidebar";

export default async function AdminPanelLayout(props: LayoutProps<"/o/[slug]/panel">) {
  const { children } = props;
  const params = await props.params;
  const { slug } = params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, slug, name, logo_url, theme, subscription_status")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/o/${slug}/login`);

const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", (org as { id: string }).id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const isPlatformOwner = user.app_metadata?.is_platform_owner === true;

  // Los platform_owners pueden acceder a cualquier panel sin ser miembros.
  // Los administradores de condominio acceden con rol 'condo_admin'.
  if (!isPlatformOwner && (!membership || (membership as { role: string }).role !== "condo_admin")) {
    redirect(`/o/${slug}/login`);
  }

  const cssVars = themeToCssVars((org as { theme: Record<string, string> }).theme);

  return (
    <div className="bg-surface min-h-screen" style={cssVars}>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
        <Link href={`/o/${slug}/panel`}>
          <Logo size="sm" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{(org as { name: string }).name}</span>
        <span className="w-7" />
      </header>

      <div className="mx-auto flex max-w-7xl md:gap-6 md:p-6">
        <AdminSidebar slug={slug} orgName={(org as { name: string }).name} />
        <main className="min-w-0 flex-1 pb-12 md:bg-white md:rounded-2xl md:border md:border-border md:shadow-sm md:p-8">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}