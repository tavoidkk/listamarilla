"use client";

import { type ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  closeOnOverlay?: boolean;
  variant?: "bottom" | "center";
  children: ReactNode;
  ariaLabel?: string;
}

export function Modal({
  open,
  onClose,
  closeOnOverlay = true,
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
      ? "w-full max-w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white/98 px-6 pb-8 pt-4 backdrop-blur-md animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)] sm:max-w-[480px] sm:rounded-3xl"
      : "w-full max-w-[360px] rounded-3xl bg-white/98 p-8 backdrop-blur-md animate-[scaleIn_0.2s_ease] shadow-2xl";

  const containerClass =
    variant === "bottom"
      ? "flex items-end justify-center pb-0 sm:items-center sm:pb-4"
      : "flex items-center justify-center p-4";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-[100] flex animate-[fadeIn_0.2s_ease] bg-[color:var(--color-overlay)]"
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnOverlay) onClose?.();
      }}
    >
      <div className={containerClass}>
        <div className={panelClass}>
          {variant === "bottom" ? (
            <div className="mx-auto mb-4 h-1 w-10 rounded-sm bg-[color:var(--color-border)]" aria-hidden />
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-[2] inline-flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-xl text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-primary-light)]"
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