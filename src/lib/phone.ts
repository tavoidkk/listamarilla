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

/** Convierte números venezolanos locales o internacionales al formato E.164. */
export function normalizeVenezuelanPhone(input: string): string {
  const digits = normalizePhone(input);
  if (!digits) return "";
  if (digits.startsWith("58")) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `58${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("4")) return `58${digits}`;
  return digits;
}

export function toVenezuelanE164(input: string): string {
  const normalized = normalizeVenezuelanPhone(input);
  return normalized ? `+${normalized}` : "";
}

export function countDigits(input: string): number {
  return (input ?? "").replace(/[^0-9]/g, "").length;
}

/**
 * Formato de prefijo venezolano +58 412 123 4567 para placeholder.
 */
export function formatVenezuelanDisplay(raw: string): string {
  const digits = normalizeVenezuelanPhone(raw);
  if (digits.length === 0) return "";
  if (digits.startsWith("58") && digits.length >= 4) {
    const cc = digits.slice(0, 2);
    const op = digits.slice(2, 5);
    const first = digits.slice(5, 8);
    const last = digits.slice(8, 12);
    return `+${cc} ${op}${first ? ` ${first}` : ""}${last ? ` ${last}` : ""}`.trim();
  }
  return raw;
}
