import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { themeToCssVars } from "@/lib/theme";
import { ToastContainer } from "@/components/ui/Toast";
import { Logo } from "@/components/brand/Logo";
import { AdminSidebar } from "./AdminSidebar";
import { getOrgBySlug } from "@/lib/data/orgs";
import { getCurrentUser, getMembershipForOrg } from "@/lib/data/session";

export default async function AdminPanelLayout(props: LayoutProps<"/o/[slug]/panel">) {
  const { children } = props;
  const params = await props.params;
  const { slug } = params;

  const org = await getOrgBySlug(slug);
  if (!org) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login`);

  const role = await getMembershipForOrg(org.id, user.id);

  if (!user.isPlatformOwner && role !== "condo_admin") {
    redirect(`/login`);
  }

  const cssVars = themeToCssVars(org.theme);

  return (
    <div className="bg-surface min-h-screen" style={cssVars}>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 shadow-sm md:hidden">
        <Link href={`/o/${slug}/panel`}>
          <Logo size="sm" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{org.name}</span>
        <span className="w-7" />
      </header>

      <div className="mx-auto flex max-w-7xl flex-col p-4 pb-24 md:flex-row md:p-6 md:pb-6 md:gap-6">
        <AdminSidebar slug={slug} orgName={org.name} />
        <main className="min-w-0 flex-1 rounded-2xl bg-white p-4 md:border md:border-border md:shadow-sm md:p-8">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}