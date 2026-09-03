import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { themeToCssVars } from "@/lib/theme";
import { ToastContainer } from "@/components/ui/Toast";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ResidentLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: org, error } = await supabase
    .from("organizations")
    .select("id, slug, name, logo_url, background_url, theme, subscription_status")
    .eq("slug", slug)
    .single();

  if (error || !org) notFound();
  if (!["trial", "active"].includes(org.subscription_status as string)) notFound();

  const cssVars = themeToCssVars(org.theme as Record<string, string>);

  return (
    <div className="bg-white" style={cssVars}>
      <div className="app-shell app-container app-fade">{children}</div>
      <ToastContainer />
    </div>
  );
}