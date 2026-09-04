"use client";

import { useState, useTransition } from "react";
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

  return (
    <form
      onSubmit={handleUpdate}
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <p className="mb-4 rounded-xl bg-info-bg p-3 text-sm">
        <span className="font-semibold">Código actual: </span>
        <code className="font-mono">{shownCode ? shownCode : "—"}</code>
      </p>
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
        🎲 Generar aleatorio
      </Button>
      <Button type="submit" variant="primary" loading={isPending} disabled={newCode.length < 4} fullWidth>
        Actualizar código
      </Button>
      <p className="mt-4 rounded-xl bg-warning-bg p-3 text-xs text-warning">
        ⚠ Cambiar el código invalida el anterior. Notifica a los vecinos del nuevo.
      </p>
    </form>
  );
}
