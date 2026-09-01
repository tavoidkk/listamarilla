import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { themeToCssVars } from "@/lib/theme";
import { ToastContainer } from "@/components/ui/Toast";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function AdminPanelLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
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

  if (!user) redirect(`/o/${slug}/panel/login`);

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", org.id as string)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership || !["admin", "owner"].includes(membership.role as string)) {
    redirect(`/o/${slug}/panel/login`);
  }

  const cssVars = themeToCssVars(org.theme as Record<string, string>);

  return (
    <div className="bg-app-overlay min-h-screen" style={cssVars}>
      <div className="app-shell min-h-screen bg-white">{children}</div>
      <ToastContainer />
    </div>
  );
}