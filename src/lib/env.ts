/**
 * Acceso tipado a variables de entorno públicas y privadas.
 */

interface PublicEnv {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_APP_NAME: string;
}

interface ServerEnv extends PublicEnv {
  SUPABASE_SERVICE_ROLE_KEY: string;
}

function readPublic(): PublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL no está definida");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida");
  return {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Páginas Amarillas",
  };
}

export const publicEnv: PublicEnv = readPublic();

export function serverEnv(): ServerEnv {
  const base = publicEnv;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está definida (solo en server)",
    );
  }
  return { ...base, SUPABASE_SERVICE_ROLE_KEY: serviceKey };
}