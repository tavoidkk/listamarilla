"use client";

import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

interface BaseFieldProps {
  label?: string;
  hint?: string;
  error?: string | null;
  optional?: boolean;
}

const fieldClasses =
  "h-[52px] w-full rounded-[8px] border border-[color:var(--color-border)] bg-white px-4 text-base text-[color:var(--color-text-primary)] transition-[border-color,box-shadow] duration-200 focus:border-[color:var(--color-border-focus)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_15%,transparent)] focus:outline-none disabled:opacity-60";

const fieldErrorClasses = "border-[color:var(--color-danger)]";

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
    <div className="mb-[18px] flex flex-col gap-[6px]">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-[color:var(--color-text-secondary)]"
        >
          {label}
          {optional ? <span className="ml-1 text-xs font-normal text-[color:var(--color-text-muted)]">(opcional)</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="mt-[2px] min-h-4 text-[13px] text-[color:var(--color-danger)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[color:var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export const Field = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, CombinedProps>(
  function Field(props, ref) {
    const { label, hint, error, optional, className = "", ...rest } = props;
    const as = (props as { as?: string }).as ?? "input";

    if (as === "select") {
      const { options, ...selectRest } = rest as SelectProps;
      return (
        <FieldShell id={selectRest.id} label={label} hint={hint} error={error} optional={optional}>
          <div className="relative">
            <select
              ref={ref as React.Ref<HTMLSelectElement>}
              {...(selectRest as SelectHTMLAttributes<HTMLSelectElement>)}
              className={[fieldClasses, "appearance-none pr-10", error ? fieldErrorClasses : "", className]
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
              className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-[color:var(--color-text-secondary)]"
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
            className={[fieldClasses, "h-auto min-h-[100px] py-3", error ? fieldErrorClasses : "", className]
              .filter(Boolean)
              .join(" ")}
          />
        </FieldShell>
      );
    }

    return (
      <FieldShell id={rest.id} label={label} hint={hint} error={error} optional={optional}>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={[fieldClasses, error ? fieldErrorClasses : "", className].filter(Boolean).join(" ")}
        />
      </FieldShell>
    );
  },
);