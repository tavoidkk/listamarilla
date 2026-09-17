"use client";

import { Button } from "@/components/ui/Button";
import { InstallApp } from "@/components/resident/InstallApp";
import { Logo } from "@/components/brand/Logo";
import { ShieldCheck } from "lucide-react";

interface DisclaimerProps {
  orgName: string;
  orgSlug: string;
  onAccept: () => void;
}

export function Disclaimer({ orgName, orgSlug, onAccept }: DisclaimerProps) {
  return (
    <div className="app-fade flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-amber-100/90 via-amber-50/95 to-white px-4 py-8 text-center sm:px-6">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-xl shadow-amber-900/10">
        <div className="border-b border-amber-200 bg-amber-400 px-6 pb-8 pt-7">
          <Logo size="md" className="rounded-2xl bg-white px-3 py-2 shadow-sm" />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-slate-800">
            Directorio de servicios
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {orgName}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-800">
            Contactos compartidos por los vecinos de tu edificio
          </p>
        </div>

        <div className="px-5 pb-7 pt-6 sm:px-8">
          <InstallApp orgName={orgName} orgSlug={orgSlug} />
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
            <p className="mb-2 flex items-center gap-2 text-base font-bold text-slate-900">
              <ShieldCheck size={19} aria-hidden /> Antes de continuar
            </p>
            <p className="text-muted-foreground whitespace-pre-line text-sm leading-[1.7]">
              {`Este directorio es mantenido únicamente por residentes del ${orgName}.
El condominio no se hace responsable por la calidad, puntualidad, precios o resultado de los servicios de los contactos aquí listados.

Al continuar, usted acepta que cualquier contratación es de su exclusiva responsabilidad.`}
            </p>
          </div>

          <Button variant="primary" size="xl" fullWidth onClick={onAccept}>
            Entendido, continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
