"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { updateBrandingAction } from "../actions";
import { createClient } from "@/lib/supabase/client";

interface Props {
  slug: string;
  orgId: string;
  initial: {
    name: string;
    background_url: string | null;
  };
}

const MAX_SIZE_MB = 8;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function BrandingEditor({ slug, orgId, initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [backgroundUrl, setBackgroundUrl] = useState(initial.background_url);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial.background_url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      toast({ kind: "error", message: "Formato no soportado. Usa JPG, PNG, WebP o AVIF." });
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ kind: "error", message: `La foto supera los ${MAX_SIZE_MB} MB.` });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        let url: string | null = backgroundUrl;
        if (file) {
          const f = file;
          const ext = f.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const uploadPath = `${orgId}/background.${ext}`;
          const supabase = createClient();
          const { error: upErr } = await supabase.storage
            .from("org-assets")
            .upload(uploadPath, f, { upsert: true, cacheControl: "31536000" });
          if (upErr) throw upErr;
          const { data } = supabase.storage.from("org-assets").getPublicUrl(uploadPath);
          url = data.publicUrl;
          setBackgroundUrl(url);
          setPreview(url);
          setFile(null);
        }
        await updateBrandingAction(slug, { name, background_url: url });
        toast({ kind: "success", message: "Fondo guardado" });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : (err as { message?: string } | null)?.message ?? "No se pudo guardar el fondo.";
        toast({ kind: "error", message: msg });
      }
    });
  }

  function removePhoto() {
    setFile(null);
    setBackgroundUrl(null);
    setPreview(null);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Field id="name" label="Nombre del edificio" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="font-bold text-foreground">Fondo de la aplicación</h3>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          Sube una foto de tu edificio. Se mostrará como fondo del directorio de vecinos.
        </p>

        <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white">
          {preview ? (
            <div
              role="img"
              aria-label="Vista previa del fondo del edificio"
              className="h-44 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${preview})` }}
            />
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="flex h-44 w-full flex-col items-center justify-center gap-2 text-slate-400 transition-colors hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
            >
              <ImagePlus className="h-8 w-8" aria-hidden="true" />
              <span className="text-sm font-semibold">Elegir foto del edificio</span>
              <span className="text-xs text-slate-400">JPG, PNG o WebP · máx. {MAX_SIZE_MB} MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={pickFile}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 p-3">
            {preview ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Cambiar foto
                </Button>
                <Button type="button" variant="danger" size="sm" onClick={removePhoto} disabled={isPending}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Quitar
                </Button>
              </>
            ) : (
              <p className="text-xs text-slate-400">Sin foto: el directorio usará el fondo claro.</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth>
        Guardar cambios
      </Button>
    </form>
  );
}