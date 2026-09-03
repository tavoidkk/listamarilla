import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/service";
import { MembersAdminPanel } from "@/app/(platform)/superadmin/MembersAdminPanel";
import { ToastContainer } from "@/components/ui/Toast";
import {
  suspendMemberAction,
  reactivateMemberAction,
  removeMemberAction,
} from "@/app/(platform)/superadmin/actions";

interface PageProps {
  params: Promise<{ orgId: string }>;
}

interface MemberWithEmail {
  id: string;
  user_id: string;
  role: string;
  status: string;
  profiles: { full_name: string | null } | null;
  email: string | null;
}

export default async function OrgMembersPage({ params }: PageProps) {
  const { orgId } = await params;
  const svc = createServiceClient();

  const { data: org } = await svc
    .from("organizations")
    .select("id, name, slug")
    .eq("id", orgId)
    .maybeSingle();

  if (!org) notFound();

  const { data: membersRaw } = await svc
    .from("memberships")
    .select("id, user_id, role, status, profiles:profiles!memberships_user_id_fkey ( full_name )")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  const members = (membersRaw as unknown as Array<Omit<MemberWithEmail, "email">> | null) ?? [];

  // Sacar emails desde auth.users
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
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a Organizaciones
      </Link>

      <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Administradores de condominio
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-slate-900">
          <Users className="h-6 w-6 text-amber-500" aria-hidden="true" />
          {(org as { name: string }).name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">/{(org as { slug: string }).slug}</code>
        </p>
      </header>

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