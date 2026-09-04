import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { OwnersAdminPanel } from "@/app/(platform)/superadmin/OwnersAdminPanel";
import { ToastContainer } from "@/components/ui/Toast";
import { listAuthUsers } from "@/lib/data/superadmin";

export default async function OwnersPage() {
  const svc = createServiceClient();

  const authList = await listAuthUsers();

  type OwnerRow = {
    id: string;
    email: string;
    full_name: string | null;
    isPlatformOwner: boolean;
    created_at: string;
    last_sign_in_at: string | null;
  };

  const owners: OwnerRow[] = authList.map(
    (u: {
      id: string;
      email?: string;
      user_metadata?: Record<string, unknown>;
      app_metadata?: Record<string, unknown>;
      created_at: string;
      last_sign_in_at?: string | null;
    }) => ({
      id: u.id,
      email: u.email ?? "",
      full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
      isPlatformOwner: (u.app_metadata?.is_platform_owner as boolean | undefined) === true,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    }),
  );

  // Rellenar full_name desde profiles (si existe)
  const { data: profiles } = await svc.from("profiles").select("id, full_name");
  const profileById = new Map<string, { full_name: string | null }>();
  for (const p of (profiles ?? []) as Array<{ id: string; full_name: string | null }>) {
    profileById.set(p.id, p);
  }

  const enriched = owners.map((o) => {
    const profile = profileById.get(o.id);
    return {
      ...o,
      full_name: o.full_name ?? profile?.full_name ?? null,
    };
  });

  return (
    <div>
      <ToastContainer />
      <Link
        href="/superadmin"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a Organizaciones
      </Link>

      <header className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Owner Console</p>
        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
          <ShieldCheck className="h-7 w-7 text-amber-500" aria-hidden="true" />
          Platform Owners
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Crea, edita o elimina owners. Al crear uno nuevo, se asigna automáticamente la flag{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-xs">is_platform_owner = true</code>.
        </p>
      </header>

      <OwnersAdminPanel owners={enriched} />
    </div>
  );
}