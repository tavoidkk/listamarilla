import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QRDisplay } from "./QRDisplay";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function QRPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("name").eq("slug", slug).single();
  if (!org) return null;

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${base}/o/${slug}`;

  return (
    <div className="p-6">
      <Link href={`/o/${slug}/panel`} className="mb-4 inline-block text-sm text-[color:var(--color-primary)]">
        ← Volver al panel
      </Link>
      <h2 className="mb-2 text-2xl font-bold">QR del portal de vecinos</h2>
      <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
        Imprime este QR y colócalo en la entrada, lobby o ascensor para que los vecinos escaneen y entren
        al directorio.
      </p>
      <QRDisplay url={url} name={org.name as string} />
    </div>
  );
}