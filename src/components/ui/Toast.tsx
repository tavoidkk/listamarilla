"use client";

import { useEffect, useState, useCallback } from "react";

type ToastKind = "success" | "error" | "info";
type ToastInput = { kind?: ToastKind; message: string; duration?: number };

interface ToastItem extends Required<ToastInput> {
  id: number;
}

let listeners: Array<(t: ToastItem) => void> = [];
let counter = 0;

export function toast(input: ToastInput | string) {
  const t: ToastInput = typeof input === "string" ? { message: input } : input;
  const item: ToastItem = {
    id: ++counter,
    kind: t.kind ?? "info",
    message: t.message,
    duration: t.duration ?? 2400,
  };
  listeners.forEach((fn) => fn(item));
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const fn = (t: ToastItem) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => remove(t.id), t.duration);
    };
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, [remove]);

  return (
    <div
      className="pointer-events-none fixed bottom-[100px] left-1/2 z-[200] flex -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={[
            "animate-[slideUp_0.25s_ease] rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur",
            t.kind === "success" ? "bg-[color:var(--color-success)]" : "",
            t.kind === "error" ? "bg-[color:var(--color-danger)]" : "",
            t.kind === "info" ? "bg-[color:var(--color-primary)]" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span aria-hidden className="mr-2">
            {t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "ℹ"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}