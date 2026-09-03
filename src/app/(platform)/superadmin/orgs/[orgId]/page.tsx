import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, ExternalLink, CalendarClock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { MembersAdminPanel } from "@/app/(platform)/superadmin/MembersAdminPanel";
import { ToastContainer } from "@/components/ui/Toast";
import {
  setOrgPlanAction,
  toggleSubscriptionAction,
  deactivateOrgAction,
  activateOrgAction,
  extendTrialAction,
  suspendMemberAction,
  reactivateMemberAction,
  removeMemberAction,
} from "@/app/(platform)/superadmin/actions";

interface PageProps {
  params: Promise<{ orgId: string }>;
}

interface OrgDetail {
  id: string;
  slug: string;
  name: string;
  plan: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  trial_ends_at: string | null;
  created_at: string;
}

interface MemberWithEmail {
  id: string;
  user_id: string;
  role: string;
  status: string;
  profiles: { full_name: string | null } | null;
  email: string | null;
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

export default async function OrgDetailPage({ params }: PageProps) {
  noStore();
  const { orgId } = await params;
  const svc = createServiceClient();

  const { data: org } = await svc
    .from("organizations")
    .select(
      "id, slug, name, plan, subscription_status, subscription_ends_at, trial_ends_at, created_at",
    )
    .eq("id", orgId)
    .maybeSingle();

  if (!org) notFound();
  const o = org as unknown as OrgDetail;

  const cutOff = o.subscription_status === "active" ? o.subscription_ends_at : o.trial_ends_at;
  const days = daysUntil(cutOff);

  const { data: membersRaw } = await svc
    .from("memberships")
    .select("id, user_id, role, status, profiles:profiles!memberships_user_id_fkey ( full_name )")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  const members = (membersRaw as unknown as Array<Omit<MemberWithEmail, "email">> | null) ?? [];

  const { data: authList } = await svc.auth.admin.listUsers({ page: 1, perPage: 500 });
  const emailByUserId = new Map<string, string>();
  if (authList?.users) {
    for (const u of authList.users) {
      if (u.id && u.email) emailByUserId.set(u.id, u.email);
    }
  }

  const membersWithEmail: MemberWithEmail[] = members.map((m) => ({
    ...m,
    email: emailByUserId.get(m.user_id) ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <ToastContainer />

      <Link
        href="/superadmin"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a Organizaciones
      </Link>

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Building2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{o.name}</h1>
              <StatusBadge status={o.subscription_status} />
              <PlanBadge plan={o.plan} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">/{o.slug}</code>
              {" · creado "}
              {formatDate(o.created_at)}
            </p>
          </div>
        </div>
        <Link
          href={`/o/${o.slug}/panel`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Entrar al panel
        </Link>
      </header>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">Plan y suscripción</h2>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoStat label="Plan" value={o.plan === "pro" ? "Pro" : "Trial"} />
          <InfoStat label="Estado" value={o.subscription_status} />
          <InfoStat label="Corte" value={formatDate(cutOff)} />
          <InfoStat
            label="Tiempo"
            value={
              days === null
                ? "Sin fecha"
                : days < 0
                  ? `Venció hace ${Math.abs(days)}d`
                  : days === 0
                    ? "Vence hoy"
                    : `${days} días`
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Cambiar plan:
          </span>
          <form action={setOrgPlanAction.bind(null, o.id, "pro")}>
            <button
              type="submit"
              disabled={o.plan === "pro" && o.subscription_status === "active"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ⭐ Plan Pro (1 año)
            </button>
          </form>
          <form action={setOrgPlanAction.bind(null, o.id, "trial")}>
            <button
              type="submit"
              disabled={o.plan === "trial" && o.subscription_status === "trial"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🧪 Plan Trial
            </button>
          </form>
          {o.subscription_status === "trial" ? (
            <form action={extendTrialAction.bind(null, o.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100 active:scale-95"
              >
                Extender trial +1 año
              </button>
            </form>
          ) : null}
          <form action={toggleSubscriptionAction.bind(null, o.id, o.subscription_status)}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700 active:scale-95"
            >
              {o.subscription_status === "active" ? "Desactivar" : "Activar"}
            </button>
          </form>
          {o.subscription_status !== "expired" ? (
            <form action={deactivateOrgAction.bind(null, o.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 active:scale-95"
              >
                Expirar ahora
              </button>
            </form>
          ) : (
            <form action={activateOrgAction.bind(null, o.id)}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 active:scale-95"
              >
                Reactivar
              </button>
            </form>
          )}
        </div>
      </section>

      <MembersAdminPanel
        orgId={orgId}
        members={membersWithEmail}
        suspendAction={suspendMemberAction}
        reactivateAction={reactivateMemberAction}
        removeAction={removeMemberAction}
      />
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
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${map[status] ?? "bg-slate-200 text-slate-600"}`}>
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
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold tracking-wider ${map[plan] ?? "bg-slate-200 text-slate-700"}`}>
      {label}
    </span>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-base font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
