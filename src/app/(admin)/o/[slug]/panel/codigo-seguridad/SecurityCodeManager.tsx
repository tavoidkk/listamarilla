"use client";

import { useState, useTransition } from "react";
import { Copy, Check, RefreshCw, TriangleAlert } from "lucide-react";
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
    if (!/^\d{4,}$/.test(newCode)) {
      toast({ kind: "error", message: "Ingresa al menos 4 números" });
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
    setNewCode(String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0"));
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
                {copied ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Copy className="h-5 w-5" aria-hidden="true" />
                )}
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

      <form onSubmit={handleUpdate} className="border-border bg-surface rounded-2xl border p-5">
        <h3 className="text-foreground mb-4 font-bold">Cambiar código</h3>
        <Field
          id="newCode"
          label="Nuevo código"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Ej: 482615"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value.replace(/\D/g, ""))}
          disabled={isPending}
          hint="Usa al menos 4 números. También puedes generar uno seguro."
        />
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={generateRandom}
          disabled={isPending}
          className="mb-4 w-full border-amber-300 bg-white text-slate-900 shadow-sm hover:bg-amber-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Generar código de 6 números
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          disabled={newCode.length < 4}
          fullWidth
        >
          Actualizar código
        </Button>
      </form>

      <p className="bg-warning-bg text-warning flex items-start gap-2 rounded-xl px-4 py-3 text-xs">
        <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        Cambiar el código invalida el anterior. Notifica a los vecinos del nuevo.
      </p>
    </div>
  );
}
