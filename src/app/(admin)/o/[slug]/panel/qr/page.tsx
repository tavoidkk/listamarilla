import { QRDisplay } from "./QRDisplay";
import { PageHeader } from "@/components/admin/PageBits";
import { getOrgBySlug } from "@/lib/data/orgs";

export default async function QRPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrgBySlug(slug);
  if (!org) return null;

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://listamarilla.vercel.app";
  const url = new URL(`/o/${encodeURIComponent(slug)}`, base).toString();

  return (
    <div>
      <PageHeader title="QR para vecinos" subtitle="Imprime y pega en el lobby, ascensor o cartelera." backHref={`/o/${slug}/panel`} />
      <QRDisplay url={url} name={org.name} />
    </div>
  );
}
