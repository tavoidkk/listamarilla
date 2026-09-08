"use client";

import { useState, useTransition } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { updateSecurityCodeAction } from "../actions";

interface Props {
  slug: string;
  currentCode: string | null;
}

export function SecurityCodeManager({ slug, currentCode }: Props) {
  const [newCode, setNewCode] = useState("");
  const [shownCode, setShownCode] = useState<string | null>(currentCode);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newCode.length < 4) {
      toast({ kind: "error", message: "Mínimo 4 caracteres" });
      return;
    }
    startTransition(async () => {
      try {
        await updateSecurityCodeAction(slug, newCode);
        setShownCode(newCode);
        toast({ kind: "success", message: "Código actualizado" });
        setNewCode("");
      } catch (err) {
        toast({ kind: "error", message: err instanceof Error ? err.message : "Error" });
      }
    });
  }

  function generateRandom() {
    const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    setNewCode(`${part()}-${part()}`);
  }

  async function copyCode() {
    if (!shownCode) return;
    try {
      await navigator.clipboard.writeText(shownCode);
      setCopied(true);
      toast({ kind: "success", message: "Código copiado" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ kind: "error", message: "No se pudo copiar el código" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 text-center shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-600">
          Código de seguridad del edificio
        </p>
        <div className="flex items-center justify-center gap-3">
          {shownCode ? (
            <>
              <code className="text-3xl font-black tracking-[0.25em] text-slate-900 md:text-4xl">
                {shownCode}
              </code>
              <button
                type="button"
                onClick={copyCode}
                aria-label="Copiar código"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300 bg-white text-amber-600 shadow-sm transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {copied ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
              </button>
            </>
          ) : (
            <p className="text-2xl font-bold text-slate-400 md:text-3xl">Sin código aún</p>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Compártelo solo con vecinos verificados para que entren al portal.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 font-bold text-foreground">Cambiar código</h3>
        <Field
          id="newCode"
          label="Nuevo código"
          placeholder="Ej: COLINA-2026"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          disabled={isPending}
          hint="Mínimo 4 caracteres. Puedes generarlo automáticamente."
        />
        <Button type="button" variant="ghost" size="sm" onClick={generateRandom} disabled={isPending} className="mb-3">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Generar aleatorio
        </Button>
        <Button type="submit" variant="primary" loading={isPending} disabled={newCode.length < 4} fullWidth>
          Actualizar código
        </Button>
      </form>

      <p className="rounded-xl bg-warning-bg px-4 py-3 text-xs text-warning">
        ⚠ Cambiar el código invalida el anterior. Notifica a los vecinos del nuevo.
      </p>
    </div>
  );
}