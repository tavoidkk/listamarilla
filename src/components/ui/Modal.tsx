"use client";

import { type ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  closeOnOverlay?: boolean;
  hideCloseButton?: boolean;
  variant?: "bottom" | "center";
  children: ReactNode;
  ariaLabel?: string;
}

export function Modal({
  open,
  onClose,
  closeOnOverlay = true,
  hideCloseButton = false,
  variant = "bottom",
  children,
  ariaLabel,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClass =
    variant === "bottom"
      ? "w-full max-w-full max-h-[92vh] overflow-y-auto rounded-t-3xl bg-white px-6 pb-8 pt-3 shadow-2xl animate-[slideUp_0.32s_cubic-bezier(0.32,0.72,0,1)] sm:max-w-[480px] sm:rounded-3xl"
      : "relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl animate-[scaleIn_0.2s_ease]";

  const containerClass =
    variant === "bottom"
      ? "flex items-end justify-center sm:items-center"
      : "flex items-center justify-center p-4";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-[100] flex animate-[fadeIn_0.2s_ease] bg-slate-950/60 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnOverlay) onClose?.();
      }}
    >
      <div className={containerClass}>
        <div className={panelClass}>
          {variant === "bottom" ? (
            <div
              className="mx-auto mb-5 h-1 w-10 rounded-full bg-border"
              aria-hidden
            />
          ) : null}
          {onClose && !hideCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-[2] inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-lg text-foreground transition-colors hover:bg-primary-light"
            >
              ✕
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}