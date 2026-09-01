import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { toggleSubscriptionAction } from "./actions";

export default async function SuperAdminPage() {
  const svc = createServiceClient();
  const { data: orgs } = await svc
    .from("organizations")
    .select("id, slug, name, plan, subscription_status, created_at, trial_ends_at")
    .order("created_at", { ascending: false });

  type OrgRow = {
    id: string;
    slug: string;
    name: string;
    plan: string;
    subscription_status: string;
    created_at: string;
  };

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Panel Owner</h1>
      <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
        {orgs?.length ?? 0} organizaciones registradas
      </p>

      <div className="space-y-3">
        {(orgs as OrgRow[] | null)?.map((o) => (
          <div
            key={o.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{o.name}</p>
              <p className="truncate text-xs text-[color:var(--color-text-muted)]">
                /{o.slug} · creado {new Date(o.created_at).toLocaleDateString()}
              </p>
              <p className="mt-1 text-xs">
                <span
                  className={[
                    "inline-block rounded-full px-2 py-0.5 text-[11px] font-bold",
                    o.subscription_status === "active"
                      ? "bg-[color:var(--color-success-bg)] text-[color:var(--color-success)]"
                      : o.subscription_status === "trial"
                        ? "bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning)]"
                        : "bg-[color:var(--color-danger-bg)] text-[color:var(--color-danger)]",
                  ].join(" ")}
                >
                  {o.subscription_status}
                </span>{" "}
                · plan {o.plan}
              </p>
            </div>
            <form action={toggleSubscriptionAction.bind(null, o.id, o.subscription_status)}>
              <button
                type="submit"
                className="rounded-full bg-[color:var(--color-primary)] px-3 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                {o.subscription_status === "active" ? "Desactivar" : "Activar"}
              </button>
            </form>
            <Link
              href={`/o/${o.slug}/panel`}
              target="_blank"
              className="rounded-full bg-[color:var(--color-surface-2)] px-3 py-2 text-xs font-semibold text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-primary-light)]"
            >
              Ver panel
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}