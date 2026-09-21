"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { resolvePostLoginDestination } from "@/app/(marketing)/login/actions";

const NAV_LINKS = [
  { href: "#features", label: "Funciones" },
  { href: "#how-it-works", label: "Cómo funciona" },
  { href: "#pricing", label: "Precio" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingHeader() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [panelHref, setPanelHref] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted || !data?.user) return;
      setEmail(data.user.email ?? null);
      setIsOwner(data.user.app_metadata?.is_platform_owner === true);
    };

    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const u = session?.user;
      setEmail(u?.email ?? null);
      setIsOwner(u?.app_metadata?.is_platform_owner === true);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    setIsOwner(false);
    setPanelHref(null);
    router.replace("/");
    router.refresh();
  };

  // Al estar logueado, resolver la ruta del panel (owner → /superadmin,
  // condo_admin → /o/{slug}/panel) para mostrar un acceso directo.
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    resolvePostLoginDestination()
      .then((dest) => {
        if (!cancelled) setPanelHref(dest !== "/solicitar" && dest !== "/login" ? dest : null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [email]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm shadow-amber-500/5 backdrop-blur-md">
      <div className="site-container flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        <Link
          href="/"
          aria-label="Inicio"
          className="flex-shrink-0 transition-transform hover:scale-[1.02]"
        >
          <Logo size="sm" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all after:duration-300 after:content-[''] hover:text-slate-900 hover:after:w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {email ? (
            <>
              {panelHref && !isOwner ? (
                <Link
                  href={panelHref}
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Mi panel
                </Link>
              ) : null}
              {isOwner ? (
                <Link
                  href="/superadmin"
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Panel Owner
                </Link>
              ) : null}
              <span className="hidden max-w-[180px] truncate text-sm text-slate-600 md:inline">
                {email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:px-4"
              >
                <span className="sm:hidden">Entrar</span>
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
              <Link href="/solicitar" className="hidden sm:block">
                <Button variant="primary" size="md" className="px-5 py-2.5 font-medium">
                  Solicitar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
