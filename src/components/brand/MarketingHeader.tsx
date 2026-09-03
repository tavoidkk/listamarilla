'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

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
    router.replace('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm shadow-amber-500/5">
      <div className="site-container flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="Inicio" className="flex-shrink-0 transition-transform hover:scale-[1.02]">
          <Logo size="sm" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none rounded-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-amber-400 after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {email ? (
            <>
              {isOwner ? (
                <Link
                  href="/superadmin"
                  className="hidden text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700 md:inline focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1"
                >
                  Panel Owner
                </Link>
              ) : null}
              <span className="hidden text-sm text-slate-600 md:inline truncate max-w-[180px]">
                {email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg px-2 py-1"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-slate-700 transition-colors hover:text-amber-600 md:inline focus:ring-2 focus:ring-amber-400 focus:outline-none rounded-lg px-2 py-1"
              >
                Iniciar sesión
              </Link>
              <Link href="/solicitar">
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