interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dims = {
    sm: { box: "h-8 w-8", text: "text-base" },
    md: { box: "h-10 w-10", text: "text-lg" },
    lg: { box: "h-12 w-12", text: "text-2xl" },
  }[size];

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden
        className={`flex ${dims.box} items-center justify-center rounded-xl bg-amber-400 text-slate-900 shadow-sm transition-transform hover:scale-105`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3/5 w-3/5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
        </svg>
      </span>
      {showText ? (
        <span className={`font-extrabold tracking-tight text-slate-900 ${dims.text}`}>
          LISTAMARILLA
        </span>
      ) : null}
    </span>
  );
}