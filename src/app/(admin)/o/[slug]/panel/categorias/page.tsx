import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./CategoryManager";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoriesAdminPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase.from("organizations").select("id").eq("slug", slug).single();
  if (!org) return null;

  type OrgRow = { id: string };
  type CatRow = { id: string; key: string; label: string; emoji: string };

  const o = org as OrgRow;

  const { data: categories } = await supabase
    .from("categories")
    .select("id, key, label, emoji, sort_order")
    .eq("org_id", o.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="p-6">
      <Link href={`/o/${slug}/panel`} className="mb-4 inline-block text-sm text-[color:var(--color-primary)]">
        ← Volver al panel
      </Link>
      <h2 className="mb-6 text-2xl font-bold">Categorías ({categories?.length ?? 0})</h2>
      <CategoryManager
        slug={slug}
        categories={(categories as CatRow[] | null) ?? []}
      />
    </div>
  );
}