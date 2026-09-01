"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] active:scale-[0.98]",
  secondary:
    "bg-[color:var(--color-primary-light)] text-[color:var(--color-primary)] hover:brightness-95 active:scale-[0.98]",
  ghost:
    "bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-primary-light)]",
  danger: "bg-[color:var(--color-danger)] text-white hover:brightness-110",
  whatsapp:
    "bg-[color:var(--color-whatsapp)] text-white hover:bg-[color:var(--color-whatsapp-dark)]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm rounded-full",
  md: "h-12 px-5 text-base rounded-full",
  lg: "h-14 px-6 text-base rounded-full",
  xl: "h-[56px] px-7 text-[17px] rounded-full font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    className = "",
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,filter] duration-200",
        "active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "cursor-not-allowed opacity-60" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
});