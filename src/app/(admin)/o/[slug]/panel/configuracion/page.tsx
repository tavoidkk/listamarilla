import { createClient } from "@/lib/supabase/server";
import { ConfiguracionForm } from "./ConfiguracionForm";
import { PageHeader } from "@/components/admin/PageBits";

export default async function ConfiguracionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) return null;

  const o = org as { id: string };

  const { data: config } = await supabase
    .from("org_floor_config")
    .select("total_floors, apartment_labels, special_floor_labels")
    .eq("org_id", o.id)
    .maybeSingle();

  const initial = (config as { total_floors: number; apartment_labels: string[]; special_floor_labels: Record<string, number> } | null) ?? {
    total_floors: 13,
    apartment_labels: ["A", "B", "C"],
    special_floor_labels: {},
  };

  return (
    <div>
      <PageHeader
        title="Configuración del edificio"
        subtitle="Define cuántos pisos tiene y qué apartamentos hay por piso."
      />

      <ConfiguracionForm slug={slug} initial={initial} />

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-2 font-bold text-foreground">¿Cómo se usa esto?</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>• Los vecinos verán un selector de pisos con solo las opciones correctas.</li>
          <li>• Los apartamentos se ofrecen como opciones en el selector (A, B, C, etc.).</li>
          <li>• Si tu edificio tiene piso PB, mezzanina o PH, agrégalos en &ldquo;pisos especiales&rdquo;.</li>
        </ul>
      </div>
    </div>
  );
}