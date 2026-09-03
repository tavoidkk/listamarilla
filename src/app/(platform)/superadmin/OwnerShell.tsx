"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, ShieldCheck, ArrowLeft } from "lucide-react";

const NAV_ITEMS = [
  { href: "/superadmin", label: "Organizaciones", Icon: Building2 },
  { href: "/superadmin/owners", label: "Platform Owners", Icon: ShieldCheck },
];

interface Props {
  email: string;
  children: React.ReactNode;
}

export function OwnerShell({ email, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col bg-slate-900 text-slate-200 lg:flex">
        <div className="border-b border-slate-800 p-5">
          <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-slate-900"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="text-sm font-extrabold text-white">LISTAMARILLA</span>
          </Link>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Owner Console</p>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Owner">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/superadmin"
                ? pathname === "/superadmin" || pathname.startsWith("/superadmin/orgs")
                : pathname.startsWith(item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-400 text-slate-900"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="truncate text-xs font-semibold text-white">{email}</p>
          <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">platform_owner</p>
          <form action="/api/auth/signout" method="post" className="mt-3">
            <Link
              href="/login"
              className="block w-full rounded-lg bg-slate-800 px-3 py-1.5 text-center text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            >
              Cerrar sesión
            </Link>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-slate-900"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="text-sm font-extrabold text-slate-900">LISTAMARILLA</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Owner</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}