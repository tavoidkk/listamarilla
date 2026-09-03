"use client";

import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface BaseFieldProps {
  label?: string;
  hint?: string;
  error?: string | null;
  optional?: boolean;
  icon?: LucideIcon;
}

const baseClasses =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-base text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:outline-none disabled:opacity-60";

const errorClasses = "border-danger";

type SelectOption = { value: string; label: string };

type InputProps = BaseFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;
type SelectProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> & { options: SelectOption[] };
type TextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & { as: "textarea" };

type CombinedProps =
  | ({ as?: "input" } & InputProps)
  | ({ as: "select" } & SelectProps)
  | (TextareaProps);

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: BaseFieldProps & { id?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-800"
        >
          {label}
          {optional ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-1 text-[13px] font-medium text-danger animate-[slideUpSmall_0.2s_ease]">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

export const Field = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, CombinedProps>(
  function Field(props, ref) {
    const { label, hint, error, optional, icon: Icon, className = "", ...rest } = props;
    const as = (props as { as?: string }).as ?? "input";

    if (as === "select") {
      const { options, ...selectRest } = rest as SelectProps;
      return (
        <FieldShell id={selectRest.id} label={label} hint={hint} error={error} optional={optional}>
          <div className="relative">
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              {...(selectRest as SelectHTMLAttributes<HTMLSelectElement>)}
              className={[baseClasses, "appearance-none pr-10", error ? errorClasses : "", className]
                .filter(Boolean)
                .join(" ")}
            >
              {options.map((o: SelectOption) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-muted-foreground"
            />
          </div>
        </FieldShell>
      );
    }

    if (as === "textarea") {
      return (
        <FieldShell id={rest.id} label={label} hint={hint} error={error} optional={optional}>
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={[baseClasses, "h-auto min-h-[100px] py-3", error ? errorClasses : "", className]
              .filter(Boolean)
              .join(" ")}
          />
        </FieldShell>
      );
    }

    return (
      <FieldShell id={rest.id} label={label} hint={hint} error={error} optional={optional}>
        <div className="relative">
          {Icon ? (
            <Icon
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
          ) : null}
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            className={[baseClasses, Icon ? "pl-10" : "", error ? errorClasses : "", className]
              .filter(Boolean)
              .join(" ")}
          />
        </div>
      </FieldShell>
    );
  },
);

export function FieldStatus({ status }: { status: "ok" | "warn" | "checking" | null }) {
  if (!status) return null;
  if (status === "checking") {
    return (
      <span aria-hidden className="text-base text-muted-foreground animate-[spin_1s_linear_infinite]">
        ⏳
      </span>
    );
  }
  if (status === "ok") {
    return (
      <span aria-hidden className="text-base font-bold text-success animate-[scaleIn_0.2s_ease]">
        ✓
      </span>
    );
  }
  return (
    <span aria-hidden className="text-base text-warning animate-[scaleIn_0.2s_ease]">
      ⚠
    </span>
  );
}