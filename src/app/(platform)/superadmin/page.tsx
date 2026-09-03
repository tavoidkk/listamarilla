import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Building2, Users, ChevronRight, CalendarClock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { OrgHeader } from "./OrgHeader";
import { ToastContainer } from "@/components/ui/Toast";

interface OrgRow {
  id: string;
  slug: string;
  name: string;
  plan: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default async function SuperAdminPage() {
  noStore();
  const svc = createServiceClient();

  const { data: orgsRaw } = await svc
    .from("organizations")
    .select(
      "id, slug, name, plan, subscription_status, subscription_ends_at, trial_ends_at, created_at",
    )
    .order("created_at", { ascending: false });

  const orgs = (orgsRaw as OrgRow[] | null) ?? [];

  const { data: membersRaw } = await svc
    .from("memberships")
    .select("org_id, status");

  const memberCountByOrg = new Map<string, number>();
  const activeCountByOrg = new Map<string, number>();
  if (membersRaw) {
    for (const m of membersRaw as unknown as Array<{ org_id: string; status: string }>) {
      memberCountByOrg.set(m.org_id, (memberCountByOrg.get(m.org_id) ?? 0) + 1);
      if (m.status === "active") {
        activeCountByOrg.set(m.org_id, (activeCountByOrg.get(m.org_id) ?? 0) + 1);
      }
    }
  }

  const stats = {
    total: orgs.length,
    active: orgs.filter((o) => o.subscription_status === "active").length,
    trial: orgs.filter((o) => o.subscription_status === "trial").length,
    expired: orgs.filter((o) => o.subscription_status === "expired").length,
  };

  return (
    <div>
      <ToastContainer />
      <OrgHeader stats={stats} />

      {orgs.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          <div>
            <Building2 className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
            Aún no hay organizaciones registradas.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {orgs.map((o) => {
            const cutOff = o.subscription_status === "active" ? o.subscription_ends_at : o.trial_ends_at;
            const days = daysUntil(cutOff);
            const total = memberCountByOrg.get(o.id) ?? 0;
            const active = activeCountByOrg.get(o.id) ?? 0;
            return (
              <Link
                key={o.id}
                href={`/superadmin/orgs/${o.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PlanBadge plan={o.plan} />
                    <StatusBadge status={o.subscription_status} />
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 group-hover:text-amber-700">
                  {o.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px]">/{o.slug}</code>
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span>
                      <strong>{active}</strong> activo{active === 1 ? "" : "s"} de {total}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span>
                      Corte: {formatDate(cutOff)}
                      {days !== null ? (
                        <span className="text-slate-400">
                          {" · "}
                          {days < 0 ? `venció hace ${Math.abs(days)}d` : `${days}d`}
                        </span>
                      ) : null}
                    </span>
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end pt-1 text-xs font-bold text-amber-700">
                  Ver detalle
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700",
    trial: "bg-amber-100 text-amber-700",
    expired: "bg-red-100 text-red-700",
    suspended: "bg-slate-200 text-slate-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[status] ?? "bg-slate-200 text-slate-600"}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    pro: "bg-amber-400 text-slate-900",
    trial: "bg-slate-200 text-slate-700",
  };
  const label = plan === "pro" ? "PRO" : "TRIAL";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${map[plan] ?? "bg-slate-200 text-slate-700"}`}>
      {label}
    </span>
  );
}
