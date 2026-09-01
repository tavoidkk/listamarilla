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

function toHex(rgb: string | undefined, fallback: string): string {
  if (!rgb) return fallback;
  const [r, g, b] = rgb.split(" ").map(Number);
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function fromHex(hex: string): string {
  const m = hex.replace("#", "");
  const n = (i: number) => parseInt(m.slice(i, i + 2), 16);
  return `${n(0)} ${n(1)} ${n(2)}`;
}

const DEFAULT_COLORS = {
  primary: "99 85 184",
  primaryDark: "78 64 154",
  primaryLight: "237 233 248",
};

export function BrandingEditor({ slug, initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [primary, setPrimary] = useState(initial.theme.primary ?? DEFAULT_COLORS.primary);
  const [primaryDark, setPrimaryDark] = useState(initial.theme.primaryDark ?? DEFAULT_COLORS.primaryDark);
  const [primaryLight, setPrimaryLight] = useState(
    initial.theme.primaryLight ?? DEFAULT_COLORS.primaryLight,
  );
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
            base: initial.theme.base ?? "223 211 194",
            surface: initial.theme.surface ?? "255 255 255",
            textPrimary: initial.theme.textPrimary ?? "28 24 48",
            textSecondary: initial.theme.textSecondary ?? "74 68 104",
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
      <Field
        id="name"
        label="Nombre del edificio"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
      />

      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4">
        <h3 className="mb-3 font-bold">Paleta de colores</h3>
        <ColorRow label="Color principal" value={primary} onChange={setPrimary} />
        <ColorRow label="Color principal (oscuro)" value={primaryDark} onChange={setPrimaryDark} />
        <ColorRow label="Color principal (claro)" value={primaryLight} onChange={setPrimaryLight} />
      </div>

      <div
        className="rounded-xl border border-[color:var(--color-border)] p-6 text-center"
        style={themeToCssVars(previewTheme)}
      >
        <p className="text-xs uppercase tracking-wider text-white drop-shadow-md">Directorio de servicios</p>
        <h1 className="mt-2 text-2xl font-bold text-white drop-shadow-lg">{name}</h1>
        <button
          type="button"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 font-semibold text-white"
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

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <label className="flex-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={toHex(value, "#6355b8")}
          onChange={(e) => onChange(fromHex(e.target.value))}
          className="h-10 w-10 cursor-pointer rounded border-0"
        />
        <code className="rounded bg-white px-2 py-1 text-xs">{value}</code>
      </div>
    </div>
  );
}