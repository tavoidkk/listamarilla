"use client";

interface SpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export function Spinner({ size = 24, className = "", color = "currentColor" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block animate-[spin_0.8s_linear_infinite] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size, color }}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center px-8 py-8">
      <Spinner size={40} />
    </div>
  );
}