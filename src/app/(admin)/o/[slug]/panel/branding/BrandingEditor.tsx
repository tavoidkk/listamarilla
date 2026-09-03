"use client";

import { useState, useTransition } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { themeToCssVars } from "@/lib/theme";
import { updateBrandingAction } from "../actions";
import type { OrgTheme } from "@/types/database";

interface Props {
  slug: string;
  initial: {
    name: string;
    theme: Record<string, string>;
    logo_url: string | null;
    background_url: string | null;
  };
}

const DEFAULTS = {
  primary: "250 204 21",
  primaryDark: "202 138 4",
  primaryLight: "254 249 195",
};

export function BrandingEditor({ slug, initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [primary, setPrimary] = useState(initial.theme.primary ?? DEFAULTS.primary);
  const [primaryDark, setPrimaryDark] = useState(initial.theme.primaryDark ?? DEFAULTS.primaryDark);
  const [primaryLight, setPrimaryLight] = useState(initial.theme.primaryLight ?? DEFAULTS.primaryLight);
  const [isPending, startTransition] = useTransition();

  const previewTheme: Partial<OrgTheme> = { primary, primaryDark, primaryLight };

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateBrandingAction(slug, {
          name,
          theme: {
            primary,
            primaryDark,
            primaryLight,
            base: initial.theme.base ?? "255 255 255",
            surface: initial.theme.surface ?? "249 250 251",
            textPrimary: initial.theme.textPrimary ?? "15 23 42",
            textSecondary: initial.theme.textSecondary ?? "71 85 105",
          },
        });
        toast({ kind: "success", message: "Branding guardado" });
      } catch (err) {
        toast({ kind: "error", message: err instanceof Error ? err.message : "Error" });
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Field id="name" label="Nombre del edificio" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 font-bold text-foreground">Paleta de colores</h3>
        <ColorRow label="Principal" value={primary} onChange={setPrimary} />
        <ColorRow label="Principal oscuro" value={primaryDark} onChange={setPrimaryDark} />
        <ColorRow label="Principal claro" value={primaryLight} onChange={setPrimaryLight} />
      </div>

      <div
        className="overflow-hidden rounded-2xl border border-border p-8 text-center"
        style={themeToCssVars(previewTheme)}
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white drop-shadow-md">Vista previa</p>
        <h1 className="mb-4 text-2xl font-bold text-white drop-shadow-lg">{name}</h1>
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
        >
          Botón de muestra
        </button>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth>
        Guardar cambios
      </Button>
    </form>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <label className="flex-1 text-sm font-semibold text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={toHex(value)}
          onChange={(e) => onChange(fromHex(e.target.value))}
          className="h-10 w-10 cursor-pointer rounded-lg border border-border"
          aria-label={`Selector de color para ${label}`}
        />
        <code className="rounded bg-white px-2 py-1 text-xs text-muted-foreground">{value}</code>
      </div>
    </div>
  );
}

function toHex(rgb: string): string {
  const [r, g, b] = rgb.split(" ").map(Number);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function fromHex(hex: string): string {
  const m = hex.replace("#", "");
  return `${[0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)).join(" ")}`;
}