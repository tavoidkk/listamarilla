import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BrandingEditor } from "./BrandingEditor";
import { PageHeader } from "@/components/admin/PageBits";

export default async function BrandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, theme, logo_url, background_url")
    .eq("slug", slug)
    .single();
  if (!org) return null;

  const o = org as { name: string; theme: Record<string, string>; logo_url: string | null; background_url: string | null };

  return (
    <div>
      <PageHeader title="Branding" subtitle="Personaliza los colores de tu edificio." />
      <BrandingEditor
        slug={slug}
        initial={{
          name: o.name,
          theme: o.theme ?? {},
          logo_url: o.logo_url ?? null,
          background_url: o.background_url ?? null,
        }}
      />
      <Link
        href={`/o/${slug}/panel`}
        className="mt-6 inline-block text-sm font-semibold text-primary-dark hover:underline"
      >
        ← Volver al panel
      </Link>
    </div>
  );
}