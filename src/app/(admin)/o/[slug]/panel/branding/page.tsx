import { BrandingEditor } from "./BrandingEditor";
import { PageHeader } from "@/components/admin/PageBits";
import { getOrgBySlug } from "@/lib/data/orgs";

export default async function BrandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrgBySlug(slug);
  if (!org) return null;

  const o = org;

  return (
    <div>
      <PageHeader title="Branding" subtitle="Sube una foto de tu edificio como fondo del directorio." backHref={`/o/${slug}/panel`} />
      <BrandingEditor
        slug={slug}
        orgId={o.id}
        initial={{
          name: o.name,
          background_url: o.background_url ?? null,
        }}
      />
    </div>
  );
}