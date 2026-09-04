import { SecurityCodeManager } from "./SecurityCodeManager";
import { PageHeader } from "@/components/admin/PageBits";
import { createClient } from "@/lib/supabase/server";
import { getOrgBySlug } from "@/lib/data/orgs";
import { getCurrentUser } from "@/lib/data/session";

export default async function SecurityCodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();
  let currentCode: string | null = null;

  if (user) {
    const org = await getOrgBySlug(slug);
    if (org) {
      const { data: code } = await supabase.rpc("get_org_security_code", {
        p_org_id: org.id,
      });
      if (code) currentCode = code as string;
    }
  }

  return (
    <div>
      <PageHeader
        title="Código de seguridad"
        subtitle="Compártelo solo con residentes verificados del edificio."
        backHref={`/o/${slug}/panel`}
      />
      <SecurityCodeManager slug={slug} currentCode={currentCode} />
    </div>
  );
}
