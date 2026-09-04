"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  pulse?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-400 text-slate-900 hover:bg-amber-300 shadow-sm active:scale-95 font-semibold focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none",
  secondary:
    "bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95 font-medium focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none",
  outline:
    "bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:bg-amber-50 active:scale-95 font-semibold focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:outline-none",
  danger: "bg-danger text-white hover:brightness-110 active:scale-95 font-semibold focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:outline-none",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#128C7E] active:scale-95 font-semibold focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm rounded-xl gap-2",
  md: "h-11 px-5 text-base rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
  xl: "h-14 px-7 text-lg rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    pulse = false,
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
        "inline-flex items-center justify-center transition-all duration-200",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "cursor-not-allowed opacity-60" : "",
        pulse && !isDisabled ? "animate-[pulseYellow_2s_ease-in-out_infinite]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block h-5 w-5 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
});