"use client";

import { useState, useTransition } from "react";
import { toast } from "@/components/ui/Toast";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createCategoryAction, deleteCategoryAction } from "../actions";

interface Category {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

interface Props {
  slug: string;
  categories: Category[];
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function CategoryManager({ slug, categories }: Props) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("🔧");
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    const data = { key: slugify(label), label: label.trim(), emoji: emoji.trim() || "🔧" };
    startTransition(async () => {
      try {
        await createCategoryAction(slug, data);
        setLabel("");
        setEmoji("🔧");
        toast({ kind: "success", message: "Categoría creada" });
      } catch (err) {
        toast({ kind: "error", message: err instanceof Error ? err.message : "Error" });
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los contactos asociados no se borran.`)) return;
    startTransition(async () => {
      try {
        await deleteCategoryAction(slug, id);
        toast({ kind: "success", message: "Categoría eliminada" });
      } catch (err) {
        toast({ kind: "error", message: err instanceof Error ? err.message : "Error" });
      }
    });
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAdd}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <h3 className="mb-3 font-bold text-foreground">Crear nueva categoría</h3>
        <Field
          id="label"
          label="Nombre"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Piletas, Fonoaudiólogo..."
          disabled={isPending}
        />
        <Field
          id="emoji"
          label="Emoji"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="🔧"
          maxLength={2}
          disabled={isPending}
        />
        <Button type="submit" variant="primary" loading={isPending} disabled={!label.trim()} fullWidth>
          Agregar categoría
        </Button>
      </form>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-2xl">
                {c.emoji}
              </span>
              <div>
                <p className="font-bold text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.key}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(c.id, c.label)}
              disabled={isPending}
              className="rounded-xl bg-danger-bg px-3 py-2 text-xs font-bold text-danger transition-colors hover:brightness-95 disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}