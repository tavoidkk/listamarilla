"use client";

import { Button } from "@/components/ui/Button";

interface DisclaimerProps {
  orgName: string;
  onAccept: () => void;
}

export function Disclaimer({ orgName, onAccept }: DisclaimerProps) {
  return (
    <div className="app-fade flex min-h-screen w-full flex-col items-center justify-center bg-[color:var(--color-base)]/55 px-6 pb-8 pt-12 text-center backdrop-blur-sm">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[color:var(--color-primary-light)] text-[color:var(--color-primary)]"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7l9-4 9 4M5 9v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 7l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mb-1 text-[28px] font-bold text-[color:var(--color-text-primary)]">{orgName}</h1>
      <p className="mb-6 text-sm font-medium text-[color:var(--color-primary)]">Directorio de servicios</p>
      <div className="mx-auto mb-6 h-[3px] w-[60px] rounded-full bg-[color:var(--color-primary)]" aria-hidden />

      <div className="mb-8 w-full max-w-[480px] rounded border-l-[5px] border-[color:var(--color-primary)] bg-[color:var(--color-surface-2)] p-6 text-left">
        <p className="mb-2 text-base font-bold text-[color:var(--color-text-primary)]">⚠ Aviso importante</p>
        <p className="whitespace-pre-line text-sm leading-[1.7] text-[color:var(--color-text-secondary)]">
          {`Este directorio es mantenido únicamente por residentes del ${orgName}.
El condominio no se hace responsable por la calidad, puntualidad, precios o resultado de los servicios de los contactos aquí listados.

Al continuar, usted acepta que cualquier contratación es de su exclusiva responsabilidad.`}
        </p>
      </div>

      <Button variant="primary" size="xl" fullWidth onClick={onAccept} className="max-w-[480px]">
        Entendido, continuar
      </Button>
    </div>
  );
}