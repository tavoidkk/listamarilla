import { SecurityCodeManager } from "./SecurityCodeManager";
import { PageHeader } from "@/components/admin/PageBits";

export default async function SecurityCodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <PageHeader
        title="Código de seguridad"
        subtitle="Compártelo solo con residentes verificados del edificio."
      />
      <SecurityCodeManager slug={slug} />
    </div>
  );
}