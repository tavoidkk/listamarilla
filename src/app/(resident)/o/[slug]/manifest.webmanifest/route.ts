import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, slug, subscription_status")
    .eq("slug", slug)
    .single();
  if (!org || !["trial", "active"].includes(org.subscription_status as string)) notFound();

  const startUrl = `/o/${encodeURIComponent(org.slug)}`;
  return Response.json(
    {
      id: startUrl,
      name: `${org.name} — LISTAMARILLA`,
      short_name: org.name,
      description: `Directorio de servicios de ${org.name}`,
      start_url: startUrl,
      scope: `${startUrl}/`,
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#facc15",
      icons: [
        { src: "/icons/icon.png", sizes: "1000x1000", type: "image/png", purpose: "any" },
        { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, max-age=300" } },
  );
}
