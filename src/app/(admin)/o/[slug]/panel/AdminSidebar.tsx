"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

interface AdminSidebarProps {
  slug: string;
  orgName: string;
}

const NAV_ITEMS = [
  { href: "", label: "Resumen", emoji: "📊" },
  { href: "/contactos", label: "Contactos", emoji: "📇" },
  { href: "/categorias", label: "Categorías", emoji: "🏷️" },
  { href: "/configuracion", label: "Configuración", emoji: "⚙️" },
  { href: "/codigo-seguridad", label: "Código", emoji: "🔐" },
  { href: "/branding", label: "Imagen", emoji: "🖼️" },
  { href: "/qr", label: "QR vecinos", emoji: "📱" },
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
              <span aria-hidden className="text-base">
                {item.emoji}
              </span>
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
            <span aria-hidden className="text-lg">
              {item.emoji}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}