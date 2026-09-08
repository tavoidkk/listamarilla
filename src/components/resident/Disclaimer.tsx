"use client";

import { Button } from "@/components/ui/Button";

interface DisclaimerProps {
  orgName: string;
  onAccept: () => void;
}

export function Disclaimer({ orgName, onAccept }: DisclaimerProps) {
  return (
    <div className="app-fade flex min-h-screen w-full flex-col items-center justify-center bg-white/80 backdrop-blur-sm px-6 py-12 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg animate-[scaleIn_0.4s_ease]"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7l9-4 9 4M5 9v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 7l9 4 9-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">{orgName}</h1>
      <p className="mb-6 text-sm font-semibold text-primary-dark">Directorio de servicios</p>
      <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-primary" aria-hidden />

      <div className="mb-8 w-full max-w-[480px] rounded-2xl border-l-4 border-primary bg-surface p-6 text-left">
        <p className="mb-2 text-base font-bold text-foreground">⚠ Aviso importante</p>
        <p className="whitespace-pre-line text-sm leading-[1.7] text-muted-foreground">
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