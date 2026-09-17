import Link from "next/link";
import { Contact, Tags, Settings, KeyRound, Image, QrCode, Users, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(admin)/o/[slug]/panel/actions";
import { getOrgBySlug } from "@/lib/data/orgs";
import { getCurrentUser } from "@/lib/data/session";

export default async function AdminDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const org = await getOrgBySlug(slug);
  const user = await getCurrentUser();
  if (!org || !user) return null;

  const o = org;

  const [contactRes, categoryRes, memberRes, voteRes] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("org_id", o.id),
    supabase.from("categories").select("id", { count: "exact", head: true }).eq("org_id", o.id),
    supabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("org_id", o.id)
      .eq("status", "active"),
    supabase.from("contacts").select("rating_count").eq("org_id", o.id),
  ]);

  const totalVotes =
    ((voteRes.data as { rating_count: number }[] | null) ?? []).reduce(
      (acc, c) => acc + (c.rating_count ?? 0),
      0,
    );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-dark">Panel</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{o.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Resumen general del directorio de tu edificio.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/o/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-amber-400 bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-amber-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            👁 Ver portal vecinos
          </Link>
          <form action={logoutAction.bind(null, slug)}>
            <button
              type="submit"
              className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Contactos" value={contactRes.count ?? 0} icon={Contact} />
        <Stat label="Categorías" value={categoryRes.count ?? 0} icon={Tags} />
        <Stat label="Miembros" value={memberRes.count ?? 0} icon={Users} />
        <Stat label="Votos totales" value={totalVotes} icon={Star} />
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Acciones rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <NavLink href={`/o/${slug}/panel/contactos`} icon={Contact} title="Gestionar contactos" desc="Ver, editar y eliminar" />
          <NavLink href={`/o/${slug}/panel/categorias`} icon={Tags} title="Gestionar categorías" desc="Agregar o quitar" />
          <NavLink href={`/o/${slug}/panel/configuracion`} icon={Settings} title="Configuración del edificio" desc="Pisos y apartamentos" />
          <NavLink href={`/o/${slug}/panel/codigo-seguridad`} icon={KeyRound} title="Código de seguridad" desc="Para vecinos" />
          <NavLink href={`/o/${slug}/panel/branding`} icon={Image} title="Cambiar imagen" desc="Foto de fondo y nombre" />
          <NavLink href={`/o/${slug}/panel/qr`} icon={QrCode} title="Generar QR imprimible" desc="Para el lobby" />
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
          <Icon className="h-5 w-5 text-amber-500" />
        </span>
        <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function NavLink({ href, title, desc, icon: Icon }: { href: string; title: string; desc: string; icon: LucideIcon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light transition-transform duration-200 group-hover:scale-105"
      >
        <Icon className="h-6 w-6 text-amber-500" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <span aria-hidden className="text-muted-foreground transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
