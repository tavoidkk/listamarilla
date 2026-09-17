import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-6 border-b border-border pb-5">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface"
        >
          ← Volver al panel
        </Link>
      ) : null}
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-dark">Panel</p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-white p-12 text-center">
      <div aria-hidden className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
        <Icon className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="mb-1 font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}