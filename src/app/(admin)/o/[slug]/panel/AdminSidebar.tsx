"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Contact, Tags, Settings, KeyRound, Image, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

interface AdminSidebarProps {
  slug: string;
  orgName: string;
}

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "", label: "Resumen", icon: LayoutDashboard },
  { href: "/contactos", label: "Contactos", icon: Contact },
  { href: "/categorias", label: "Categorías", icon: Tags },
  { href: "/configuracion", label: "Configuración", icon: Settings },
  { href: "/codigo-seguridad", label: "Código", icon: KeyRound },
  { href: "/branding", label: "Imagen", icon: Image },
  { href: "/qr", label: "QR vecinos", icon: QrCode },
];

export function AdminSidebar({ slug, orgName }: AdminSidebarProps) {
  const pathname = usePathname();
  const base = `/o/${slug}/panel`;

  function isActive(href: string): boolean {
    const path = base + href;
    if (href === "") return pathname === base;
    return pathname.startsWith(path);
  }

  return (
    <>
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 flex-shrink-0 flex-col md:flex">
        <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5">
          <Logo size="sm" />
          <p className="line-clamp-2 text-sm font-semibold text-foreground">{orgName}</p>
          <p className="text-xs text-muted-foreground">Panel de administración</p>
        </div>
        <nav className="flex-1 space-y-1" aria-label="Navegación panel">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={base + item.href}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary-light text-foreground"
                  : "text-muted-foreground hover:bg-surface",
              ].join(" ")}
            >
              <item.icon className="h-4 w-4 text-amber-500" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-border bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] py-2 backdrop-blur md:hidden"
        aria-label="Navegación mobile"
      >
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={base + item.href}
            className={[
              "flex min-w-[60px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary-light text-foreground"
                : "text-muted-foreground",
            ].join(" ")}
          >
            <item.icon className="h-5 w-5 text-amber-500" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}