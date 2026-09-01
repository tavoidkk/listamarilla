import { createClient } from "@/lib/supabase/server";
import { ResidentPortal } from "./ResidentPortal";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResidentHomePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, slug, name")
    .eq("slug", slug)
    .single();

  if (!org) return null;

  return <ResidentPortal orgId={org.id} orgSlug={org.slug} orgName={org.name} />;
}