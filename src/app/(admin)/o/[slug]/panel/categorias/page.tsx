import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./CategoryManager";
import { PageHeader, EmptyState } from "@/components/admin/PageBits";
import { getOrgBySlug } from "@/lib/data/orgs";

export default async function CategoriesAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const org = await getOrgBySlug(slug);
  if (!org) return null;

  const o = org;

  const { data: categories } = await supabase
    .from("categories")
    .select("id, key, label, emoji, sort_order")
    .eq("org_id", o.id)
    .order("sort_order", { ascending: true });

  const list = (categories as { id: string; key: string; label: string; emoji: string }[] | null) ?? [];

  return (
    <div>
      <PageHeader title="Categorías" subtitle={`${list.length} en tu edificio`} backHref={`/o/${slug}/panel`} />

      {list.length > 0 ? (
        <CategoryManager slug={slug} categories={list} />
      ) : (
        <EmptyState
          emoji="🏷️"
          title="Sin categorías"
          desc="Crea la primera categoría para empezar."
        />
      )}
    </div>
  );
}