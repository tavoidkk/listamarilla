"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-6xl">⚠️</p>
      <h1 className="mb-2 text-2xl font-bold">Algo salió mal</h1>
      <p className="mb-6 max-w-md text-sm text-[color:var(--color-text-secondary)]">
        {error.message || "Error inesperado"}
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 font-semibold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}