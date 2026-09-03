import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { MarketingHeader } from "@/components/brand/MarketingHeader";
import { MarketingFooter } from "@/components/brand/MarketingFooter";

export default function SolicitarPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    console.warn("Solicitud recibida", Object.fromEntries(formData));
  }

  return (
    <div className="bg-app-overlay flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <form
          action={handleSubmit}
          className="w-full max-w-[480px] rounded-3xl border border-border bg-white p-8 shadow-xl md:p-10"
        >
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Solicita tu edificio
          </h1>
          <p className="mb-6 text-muted-foreground">
            Déjanos tus datos y te contactaremos para configurar el directorio en menos de 24 horas.
          </p>
          <Field
            id="edificio"
            name="edificio"
            label="Nombre del edificio"
            placeholder="Ej: Edificio Colina Del Este"
            required
          />
          <Field
            id="admin"
            name="admin"
            label="Tu nombre"
            placeholder="Miembro de la Junta"
            required
          />
          <Field
            id="email"
            name="email"
            type="email"
            label="Email de contacto"
            placeholder="admin@edificio.com"
            required
          />
          <Field
            id="telefono"
            name="telefono"
            type="tel"
            label="Teléfono"
            placeholder="+58 412 123 4567"
            required
          />
          <Button type="submit" variant="primary" size="lg" fullWidth className="mt-2">
            Enviar solicitud
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Al enviar aceptas que te contactemos por los medios indicados.
          </p>
        </form>
      </main>
      <MarketingFooter />
    </div>
  );
}