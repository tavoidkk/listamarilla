import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandingEditor } from "./BrandingEditor";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandingPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, theme, logo_url, background_url")
    .eq("slug", slug)
    .single();
  if (!org) return null;

  type OrgRow = {
    name: string;
    theme: Record<string, string>;
    logo_url: string | null;
    background_url: string | null;
  };
  const o = org as OrgRow;

  return (
    <div className="p-6">
      <Link href={`/o/${slug}/panel`} className="mb-4 inline-block text-sm text-[color:var(--color-primary)]">
        ← Volver al panel
      </Link>
      <h2 className="mb-6 text-2xl font-bold">Branding</h2>
      <BrandingEditor
        slug={slug}
        initial={{
          name: o.name,
          theme: o.theme ?? {},
          logo_url: o.logo_url ?? null,
          background_url: o.background_url ?? null,
        }}
      />
    </div>
  );
}