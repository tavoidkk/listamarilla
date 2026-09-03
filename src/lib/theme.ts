import type { OrgTheme } from "@/types/database";

/**
 * Tokens para theming dinámico por org (inyectados via inline style).
 * Los valores son tripletes RGB "r g b" para que las utilities CSS
 * var(--color-primary-rgb) generadas en @theme los usen.
 */
export const DEFAULT_THEME_RGB = {
  primary: "250 204 21", // #facc15
  primaryDark: "202 138 4", // #ca8a04
  primaryLight: "254 249 195", // #fef9c3
  base: "255 255 255",
  surface: "249 250 251",
  textPrimary: "15 23 42",
  textSecondary: "71 85 105",
};

/**
 * Convierte el theme de la DB en CSS custom properties para inyectar
 * en el style del wrapper del portal de vecinos (theming por org).
 */
export function themeToCssVars(theme: Partial<OrgTheme> | null | undefined): React.CSSProperties {
  const t = { ...DEFAULT_THEME_RGB, ...(theme ?? {}) };
  return {
    "--color-primary-rgb": t.primary,
    "--color-primary-dark-rgb": t.primaryDark,
    "--color-primary-light-rgb": t.primaryLight,
    "--color-base-rgb": t.base,
    "--color-surface-rgb": t.surface,
    "--color-text-primary-rgb": t.textPrimary,
    "--color-text-secondary-rgb": t.textSecondary,
  } as React.CSSProperties;
}

export const DEFAULT_THEME: OrgTheme = {
  primary: DEFAULT_THEME_RGB.primary,
  primaryDark: DEFAULT_THEME_RGB.primaryDark,
  primaryLight: DEFAULT_THEME_RGB.primaryLight,
  base: DEFAULT_THEME_RGB.base,
  surface: DEFAULT_THEME_RGB.surface,
  textPrimary: DEFAULT_THEME_RGB.textPrimary,
  textSecondary: DEFAULT_THEME_RGB.textSecondary,
};