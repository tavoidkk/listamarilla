/**
 * SessionId anónimo para el portal de vecinos (sin login).
 * - Persiste en localStorage del navegador.
 * - Se envía en headers HTTP al votar.
 * - Permite "un voto por persona" sin autenticación.
 */
const KEY = "pa:session_id";

function generate(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `web_${crypto.randomUUID()}`;
  }
  return `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = generate();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function clearSessionId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}