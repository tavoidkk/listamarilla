interface SkeletonProps {
  variant?: "text" | "title" | "circle" | "rect" | "card";
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  title?: boolean;
}

const BASE =
  "animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-700/50";

export function Skeleton({
  variant = "text",
  className = "",
  count = 1,
  height,
  width,
  title = false,
}: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const variantClasses: Record<NonNullable<SkeletonProps["variant"]>, string> = {
    text: title ? "h-6 w-2/3" : "h-4 w-full",
    title: "h-8 w-1/2",
    circle: "rounded-full",
    rect: "",
    card: "h-[100px] w-full rounded-2xl",
  };

  return (
    <div className={title ? "space-y-3" : "space-y-2"}>
      {items.map((i) => (
        <div
          key={i}
          aria-hidden
          className={`${BASE} ${variantClasses[variant]} ${className}`}
          style={{
            ...(height ? { height } : {}),
            ...(width ? { width } : {}),
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonLine({ className = "", height = "h-4" }: { className?: string; height?: string }) {
  return <div aria-hidden className={`${BASE} ${height} ${className}`} />;
}

export function SkeletonBlock({
  className = "",
  height,
  width,
}: {
  className?: string;
  height?: string;
  width?: string;
}) {
  return (
    <div
      aria-hidden
      className={`${BASE} ${className}`}
      style={{
        ...(height ? { height } : {}),
        ...(width ? { width } : {}),
      }}
    />
  );
}