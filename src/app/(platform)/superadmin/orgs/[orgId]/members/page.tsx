import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { MembersAdminPanel } from "@/app/(platform)/superadmin/MembersAdminPanel";
import { ToastContainer } from "@/components/ui/Toast";
import {
  suspendMemberAction,
  reactivateMemberAction,
  removeMemberAction,
} from "@/app/(platform)/superadmin/actions";
import { getOrgByIdAdmin } from "@/lib/data/orgs";
import { getOrgMembersWithProfiles, enrichMembersWithEmails } from "@/lib/data/superadmin";

interface PageProps {
  params: Promise<{ orgId: string }>;
}

export default async function OrgMembersPage({ params }: PageProps) {
  const { orgId } = await params;

  const org = await getOrgByIdAdmin(orgId);
  if (!org) notFound();

  const members = await getOrgMembersWithProfiles(orgId);
  const membersWithEmail = await enrichMembersWithEmails(members);

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
          {org.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Slug: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">/{org.slug}</code>
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