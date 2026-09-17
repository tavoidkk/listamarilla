import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { themeToCssVars } from "@/lib/theme";
import { ToastContainer } from "@/components/ui/Toast";
import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, subscription_status")
    .eq("slug", slug)
    .single();
  if (!org || !["trial", "active"].includes(org.subscription_status as string)) return {};
  return {
    title: `${org.name} — LISTAMARILLA`,
    applicationName: org.name,
    manifest: `/o/${encodeURIComponent(slug)}/manifest.webmanifest`,
    appleWebApp: { capable: true, statusBarStyle: "default", title: org.name },
  };
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
    <div className="min-h-screen bg-white" style={cssVars}>
      {org.background_url ? (
        <div aria-hidden className="fixed inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${org.background_url})` }}
          />
          <div className="absolute inset-0 bg-white/75" />
        </div>
      ) : null}
      <div className="relative z-10 app-shell app-container app-fade">{children}</div>
      <ToastContainer />
    </div>
  );
}
