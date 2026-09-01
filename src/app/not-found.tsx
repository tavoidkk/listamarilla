import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-base)] px-6 text-center">
      <p className="mb-4 text-6xl">🏢</p>
      <h1 className="mb-2 text-2xl font-bold">Edificio no encontrado</h1>
      <p className="mb-6 max-w-md text-sm text-[color:var(--color-text-secondary)]">
        Verifica el enlace del QR o contacta a la Junta de Condominio para confirmar la dirección correcta.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 font-semibold text-white"
      >
        Ir al inicio
      </Link>
    </div>
  );
}