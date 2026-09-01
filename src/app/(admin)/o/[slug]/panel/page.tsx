import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./auth-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: org } = await supabase.from("organizations").select("id, name").eq("slug", slug).single();
  if (!org) return null;

  const { count: contactCount } = await supabase
    .from("contacts")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org.id as string);

  const { count: categoryCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org.id as string);

  const { count: voteCount } = await supabase
    .from("contacts")
    .select("rating_count", { count: "exact", head: false })
    .eq("org_id", org.id as string);

  const totalVotes = (voteCount as unknown as { rating_count: number }[] | null)?.reduce(
    (acc, c) => acc + (c.rating_count ?? 0),
    0,
  ) ?? 0;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-white px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">Panel</p>
          <h1 className="text-xl font-bold">{org.name}</h1>
        </div>
        <form action={logoutAction.bind(null, slug)}>
          <button
            type="submit"
            className="rounded-full bg-[color:var(--color-surface-2)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-primary-light)]"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="space-y-4 p-6">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Contactos" value={contactCount ?? 0} />
          <Stat label="Categorías" value={categoryCount ?? 0} />
          <Stat label="Votos totales" value={totalVotes} />
        </div>

        <nav className="grid gap-2">
          <NavLink href={`/o/${slug}/panel/contactos`}>📇 Gestionar contactos</NavLink>
          <NavLink href={`/o/${slug}/panel/categorias`}>🏷️ Gestionar categorías</NavLink>
          <NavLink href={`/o/${slug}/panel/codigo-seguridad`}>🔐 Código de seguridad</NavLink>
          <NavLink href={`/o/${slug}/panel/branding`}>🎨 Branding del edificio</NavLink>
          <NavLink href={`/o/${slug}/panel/qr`}>📱 Generar QR para vecinos</NavLink>
          <NavLink href={`/o/${slug}`} external>
            👁 Ver portal de vecinos
          </NavLink>
        </nav>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[color:var(--color-surface-2)] p-4 text-center">
      <p className="text-2xl font-bold text-[color:var(--color-primary)]">{value}</p>
      <p className="text-xs text-[color:var(--color-text-secondary)]">{label}</p>
    </div>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <Link
        href={href}
        target="_blank"
        className="block rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-semibold transition-colors hover:bg-[color:var(--color-primary-light)]"
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="block rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm font-semibold transition-colors hover:bg-[color:var(--color-primary-light)]"
    >
      {children}
    </Link>
  );
}