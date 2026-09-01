"use client";

import { useEffect, useState } from "react";

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
        color: { dark: "#1c1830", light: "#ffffff" },
      });
      setSvg(data);
    }
    void generate();
  }, [url]);

  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-6 text-center">
      <div
        className="mx-auto mb-4 inline-block rounded-lg bg-white p-4 shadow-md"
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label={`QR para ${name}`}
      />
      <p className="mb-1 text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
        Escanea para entrar a
      </p>
      <p className="mb-4 text-lg font-bold">{name}</p>
      <code className="block break-all rounded bg-[color:var(--color-surface-2)] px-3 py-2 text-xs">
        {url}
      </code>
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-6 font-semibold text-white"
      >
        🖨 Imprimir QR
      </button>
    </div>
  );
}