import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteContactAction } from "../actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type OrgRow = { id: string };
type ContactRow = {
  id: string;
  name: string;
  phone: string;
  category_label: string;
  avg_rating: number;
  rating_count: number;
};

export default async function ContactsAdminPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) return null;

  const o = org as OrgRow;

  const [{ data: contacts }] = await Promise.all([
    supabase
      .from("contacts")
      .select("id, name, phone, category_label, avg_rating, rating_count, added_by_name")
      .eq("org_id", o.id)
      .order("created_at", { ascending: false }),
  ]);

  const list = (contacts as ContactRow[] | null) ?? [];

  return (
    <div className="p-6">
      <Link href={`/o/${slug}/panel`} className="mb-4 inline-block text-sm text-[color:var(--color-primary)]">
        ← Volver al panel
      </Link>
      <h2 className="mb-6 text-2xl font-bold">Contactos ({list.length})</h2>

      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="truncate text-sm text-[color:var(--color-text-secondary)]">
                  {c.phone} · {c.category_label}
                </p>
                <p className="text-xs text-[color:var(--color-text-muted)]">
                  ⭐ {Number(c.avg_rating).toFixed(1)} ({c.rating_count} votos)
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
                  className="rounded-full bg-[color:var(--color-danger-bg)] px-3 py-2 text-xs font-semibold text-[color:var(--color-danger)] hover:brightness-95"
                >
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-[color:var(--color-surface-2)] p-6 text-center text-sm text-[color:var(--color-text-secondary)]">
          Aún no hay contactos. Los vecinos pueden agregarlos desde el portal.
        </p>
      )}
    </div>
  );
}