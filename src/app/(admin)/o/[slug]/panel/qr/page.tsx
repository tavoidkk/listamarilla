import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QRDisplay } from "./QRDisplay";
import { PageHeader } from "@/components/admin/PageBits";

export default async function QRPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("name").eq("slug", slug).single();
  if (!org) return null;

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${base}/o/${slug}`;

  return (
    <div>
      <PageHeader title="QR para vecinos" subtitle="Imprime y pega en el lobby, ascensor o cartelera." />
      <QRDisplay url={url} name={(org as { name: string }).name} />
      <Link
        href={`/o/${slug}/panel`}
        className="mt-6 inline-block text-sm font-semibold text-primary-dark hover:underline"
      >
        ← Volver al panel
      </Link>
    </div>
  );
}