"use client";

import { useEffect, useState } from "react";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  url: string;
  name: string;
}

export function QRDisplay({ url, name }: Props) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    async function generate() {
      const { default: QRCode } = await import("qrcode");
      const data = await QRCode.toString(url, {
        type: "svg",
        margin: 1,
        width: 320,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });
      setSvg(data);
    }
    void generate();
  }, [url]);

  async function downloadPng() {
    if (!svg) return;
    try {
      const img = new Image();
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      await img.decode();
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = (img.naturalWidth || 320) * scale;
      canvas.height = (img.naturalHeight || 320) * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `QR-${name}.png`.replace(/\s+/g, "-");
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      // fallo silencioso: el usuario puede usar la impresión
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
      <div
        className="mx-auto mb-5 inline-block rounded-2xl border border-border bg-white p-4 shadow-sm"
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label={`QR para ${name}`}
      />
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Escanea para entrar a
      </p>
      <p className="mb-4 text-xl font-bold tracking-tight text-foreground">{name}</p>
      <code className="mb-5 block break-all rounded-xl bg-surface px-3 py-2 text-xs text-muted-foreground">
        {url}
      </code>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="primary" size="lg" onClick={() => window.print()} className="sm:flex-1">
          <Printer className="h-4 w-4" aria-hidden="true" />
          Imprimir QR
        </Button>
        <Button variant="outline" size="lg" onClick={downloadPng} disabled={!svg} className="sm:flex-1">
          <Download className="h-4 w-4" aria-hidden="true" />
          Descargar imagen
        </Button>
      </div>
    </div>
  );
}