"use client";

import { useState, useTransition } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { updateFloorConfigAction } from "./actions";

interface Props {
  slug: string;
  initial: {
    total_floors: number;
    apartment_labels: string[];
    special_floor_labels: Record<string, number>;
  };
}

export function ConfiguracionForm({ slug, initial }: Props) {
  const [totalFloors, setTotalFloors] = useState(initial.total_floors);
  const [apartmentsText, setApartmentsText] = useState(initial.apartment_labels.join(", "));
  const [specialFloorsText, setSpecialFloorsText] = useState(
    Object.entries(initial.special_floor_labels)
      .map(([label, value]) => (value === 0 ? label : `${label}=${value}`))
      .join(", "),
  );
  const [isPending, startTransition] = useTransition();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const apartment_labels = apartmentsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const special_floor_labels: Record<string, number> = {};
    for (const entry of specialFloorsText.split(",").map((s) => s.trim()).filter(Boolean)) {
      const eq = entry.indexOf("=");
      if (eq === -1) {
        special_floor_labels[entry] = 0;
      } else {
        const label = entry.slice(0, eq).trim();
        const value = Number(entry.slice(eq + 1).trim());
        if (label) special_floor_labels[label] = isNaN(value) ? 0 : value;
      }
    }

    startTransition(async () => {
      try {
        await updateFloorConfigAction(slug, {
          total_floors: totalFloors,
          apartment_labels,
          special_floor_labels,
        });
        toast({ kind: "success", message: "Configuración guardada" });
      } catch (err) {
        toast({ kind: "error", message: err instanceof Error ? err.message : "Error" });
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-3 font-bold text-foreground">Pisos del edificio</h3>
        <Field
          id="totalFloors"
          label="Cantidad total de pisos"
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={totalFloors}
          onChange={(e) => setTotalFloors(Number(e.target.value) || 0)}
          disabled={isPending}
          hint="Número del 1 al 100. Ej: 13 para un edificio de 13 pisos."
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-1 font-bold text-foreground">Apartamentos por piso</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Separa por comas. Pueden ser letras (A,B,C) o números (1,2,3).
        </p>
        <input
          type="text"
          value={apartmentsText}
          onChange={(e) => setApartmentsText(e.target.value)}
          disabled={isPending}
          placeholder="A, B, C"
          className="h-[52px] w-full rounded-xl border border-border bg-white px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {apartmentsText.split(",").map((s) => s.trim()).filter(Boolean).map((apt) => (
            <span
              key={apt}
              className="rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary-dark"
            >
              {apt}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-1 font-bold text-foreground">Pisos especiales</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Opcional. Ej: PB, Mezzanina, PH. Formato: <code>PB</code>, o <code>PH=14</code>.
        </p>
        <input
          type="text"
          value={specialFloorsText}
          onChange={(e) => setSpecialFloorsText(e.target.value)}
          disabled={isPending}
          placeholder="PB, Mezzanina, PH=14"
          className="h-[52px] w-full rounded-xl border border-border bg-white px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_25%,transparent)] focus:outline-none"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth>
        Guardar configuración
      </Button>
    </form>
  );
}