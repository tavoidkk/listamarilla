"use client";

interface StarRatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const SIZES = {
  sm: { star: 16, gap: "gap-[2px]" },
  md: { star: 22, gap: "gap-1" },
  lg: { star: 32, gap: "gap-[2px]" },
} as const;

export function StarRating({ value, count, size = "md", showValue = false }: StarRatingProps) {
  const { star, gap } = SIZES[size];
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className={`inline-flex items-center ${gap} text-sm font-medium text-foreground`}>
      <span className="inline-flex items-center" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = rounded >= n ? 1 : rounded >= n - 0.5 ? 0.5 : 0;
          return <Star key={n} fill={fill} size={star} />;
        })}
      </span>
      {showValue ? (
        <span className="ml-1 text-sm font-semibold text-foreground">
          {value > 0 ? value.toFixed(1) : "—"}
        </span>
      ) : null}
      {typeof count === "number" ? (
        <span className="ml-1 text-xs text-muted-foreground">({count})</span>
      ) : null}
    </span>
  );
}

interface StarProps {
  fill: number;
  size: number;
}

function Star({ fill, size }: StarProps) {
  const path = "M12 2 L14.85 8.4 L22 9.27 L16.5 14.14 L18.18 21 L12 17.27 L5.82 21 L7.5 14.14 L2 9.27 L9.15 8.4 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id={`half-${fill}-${size}`}>
          <stop offset={`${fill * 100}%`} stopColor="var(--color-star-filled)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--color-star-empty)" />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#half-${fill}-${size})`} />
    </svg>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Aceptable",
  4: "Bueno",
  5: "Excelente",
};

export function InteractiveStarRating({ value, onChange, disabled }: InteractiveStarRatingProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((n) => {
          const isActive = value >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              disabled={disabled}
              onClick={() => onChange(n)}
              className="bg-transparent p-1 transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed"
            >
              <svg width={42} height={42} viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M12 2 L14.85 8.4 L22 9.27 L16.5 14.14 L18.18 21 L12 17.27 L5.82 21 L7.5 14.14 L2 9.27 L9.15 8.4 Z"
                  fill={isActive ? "var(--color-star-filled)" : "var(--color-star-empty)"}
                />
              </svg>
            </button>
          );
        })}
      </div>
      <p className="h-[22px] text-sm font-semibold text-primary">
        {value > 0 ? RATING_LABELS[value] : ""}
      </p>
    </div>
  );
}