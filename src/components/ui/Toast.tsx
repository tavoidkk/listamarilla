"use client";

import { useEffect, useState, useCallback } from "react";
import { CircleCheck, CircleX, Info } from "lucide-react";

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
    duration: t.duration ?? 2800,
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
      className="pointer-events-none fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col gap-2"
      aria-live="polite"
    >
      {items.map((t) => {
        const colorClass =
          t.kind === "success"
            ? "bg-emerald-600 border-emerald-700"
            : t.kind === "error"
              ? "bg-red-600 border-red-700"
              : "bg-slate-900 border-slate-800";
        const Icon =
          t.kind === "success" ? CircleCheck : t.kind === "error" ? CircleX : Info;
        return (
          <div
            key={t.id}
            role="status"
            className={`animate-[slideUp_0.28s_cubic-bezier(0.32,0.72,0,1)] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold text-white shadow-2xl ${colorClass}`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}