"use client";

import { useState, useTransition } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { updateSecurityCodeAction } from "../actions";

interface Props {
  slug: string;
}

export function SecurityCodeManager({ slug }: Props) {
  const [newCode, setNewCode] = useState("");
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
      className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4"
    >
      <Field
        id="newCode"
        label="Nuevo código"
        placeholder="Ej: COLINA-2026"
        value={newCode}
        onChange={(e) => setNewCode(e.target.value)}
        disabled={isPending}
        hint="Mínimo 4 caracteres. Puedes generarlo automáticamente."
      />
      <div className="mb-4 flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={generateRandom} disabled={isPending}>
          🎲 Generar aleatorio
        </Button>
      </div>
      <Button type="submit" variant="primary" loading={isPending} disabled={newCode.length < 4} fullWidth>
        Actualizar código
      </Button>
      <p className="mt-4 text-xs text-[color:var(--color-text-muted)]">
        ⚠ Cambiar el código invalida el anterior. Notifica a los vecinos del nuevo.
      </p>
    </form>
  );
}