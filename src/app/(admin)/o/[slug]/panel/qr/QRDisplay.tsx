"use client";

import { useEffect, useState } from "react";
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
      <Button variant="primary" size="lg" onClick={() => window.print()} fullWidth>
        🖨 Imprimir QR
      </Button>
    </div>
  );
}