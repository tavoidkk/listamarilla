/**
 * Normalización de números de teléfono para deduplicación.
 * Conserva solo dígitos, máximo 15 (estándar E.164).
 */
export function normalizePhone(input: string): string {
  if (!input) return "";
  const digits = input.replace(/[^0-9]/g, "");
  if (digits.length > 15) return digits.slice(-15);
  return digits;
}

export function countDigits(input: string): number {
  return (input ?? "").replace(/[^0-9]/g, "").length;
}

/**
 * Formato de prefijo venezolano +58 412 123 4567 para placeholder.
 */
export function formatVenezuelanDisplay(raw: string): string {
  const digits = normalizePhone(raw);
  if (digits.length === 0) return "";
  if (digits.startsWith("58") && digits.length >= 4) {
    const cc = digits.slice(0, 2);
    const op = digits.slice(2, 5);
    const rest = digits.slice(5);
    return `+${cc} ${op}${rest ? ` ${rest}` : ""}`.trim();
  }
  return raw;
}