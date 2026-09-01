import Link from "next/link";
import { SecurityCodeManager } from "./SecurityCodeManager";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ updated?: string }>;
}

export default async function SecurityCodePage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="p-6">
      <Link href={`/o/${slug}/panel`} className="mb-4 inline-block text-sm text-[color:var(--color-primary)]">
        ← Volver al panel
      </Link>
      <h2 className="mb-2 text-2xl font-bold">Código de seguridad</h2>
      <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
        El código se entrega a los vecinos para que puedan agregar contactos al directorio. Compártelo solo
        con residentes verificados del edificio.
      </p>
      <SecurityCodeManager slug={slug} />
    </div>
  );
}