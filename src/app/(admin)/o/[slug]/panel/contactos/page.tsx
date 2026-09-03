import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteContactAction } from "../actions";
import { PageHeader, EmptyState } from "@/components/admin/PageBits";

export default async function ContactsAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) return null;

  const o = org as { id: string };

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, name, phone, category_label, avg_rating, rating_count")
    .eq("org_id", o.id)
    .order("created_at", { ascending: false });

  const list = (contacts as { id: string; name: string; phone: string; category_label: string; avg_rating: number; rating_count: number }[] | null) ?? [];

  return (
    <div>
      <PageHeader title="Contactos" subtitle={`${list.length} en tu directorio`} />

      {list.length > 0 ? (
        <div className="space-y-2">
          {list.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 transition-colors hover:border-primary"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{c.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {c.phone} · {c.category_label ?? "Sin categoría"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  ⭐ {Number(c.avg_rating).toFixed(1)} ({c.rating_count} voto{c.rating_count === 1 ? "" : "s"})
                </p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await deleteContactAction(slug, c.id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-xl bg-danger-bg px-3 py-2 text-xs font-bold text-danger transition-colors hover:brightness-95"
                >
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="📭"
          title="Aún no hay contactos"
          desc="Los vecinos pueden agregarlos desde el portal escaneando el QR."
        />
      )}

      <Link
        href={`/o/${slug}/panel`}
        className="mt-6 inline-block text-sm font-semibold text-primary-dark hover:underline"
      >
        ← Volver al panel
      </Link>
    </div>
  );
}