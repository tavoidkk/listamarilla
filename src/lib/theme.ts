import type { OrgTheme } from "@/types/database";
import { DEFAULT_THEME } from "@/types/database";

/**
 * Convierte el campo `theme` de la DB (jsonb) en CSS custom properties.
 * Acepta `Json` porque Supabase tipa jsonb como unión amplia.
 */
export function themeToCssVars(theme: unknown): React.CSSProperties {
  const t = { ...DEFAULT_THEME, ...(isOrgTheme(theme) ? theme : {}) };
  return {
    "--color-primary": t.primary,
    "--color-primary-dark": t.primaryDark,
    "--color-primary-light": t.primaryLight,
    "--color-base": t.base,
    "--color-surface": t.surface,
    "--color-text-primary": t.textPrimary,
    "--color-text-secondary": t.textSecondary,
  } as React.CSSProperties;
}

function isOrgTheme(v: unknown): v is Partial<OrgTheme> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Convierte un OrgTheme a la sintaxis Tailwind v4 `@theme inline`.
 * Solo se usa en globals.css para registrar colores base.
 */
export function themeToTailwindVars(theme: Partial<OrgTheme> | null | undefined): string {
  const t = { ...DEFAULT_THEME, ...(theme ?? {}) };
  return [
    `--color-primary: rgb(${t.primary});`,
    `--color-primary-dark: rgb(${t.primaryDark});`,
    `--color-primary-light: rgb(${t.primaryLight});`,
    `--color-base: rgb(${t.base});`,
    `--color-surface: rgb(${t.surface});`,
    `--color-text-primary: rgb(${t.textPrimary});`,
    `--color-text-secondary: rgb(${t.textSecondary});`,
  ].join("\n  ");
}