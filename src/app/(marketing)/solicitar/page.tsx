import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ToastContainer } from "@/components/ui/Toast";

export default function SolicitarPage() {
  async function handleSubmit(formData: FormData) {
    "use server";
    // En Fase 6 implementamos el formulario completo con persistencia.
    // Por ahora es placeholder.
    console.warn("TODO: persistir solicitud", Object.fromEntries(formData));
  }

  return (
    <div className="bg-app-overlay flex min-h-screen items-center justify-center px-4 py-8">
      <ToastContainer />
      <form
        action={handleSubmit}
        className="app-shell w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-1 text-2xl font-bold">Solicitar mi edificio</h1>
        <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
          Déjanos tus datos y te contactaremos para configurar el directorio de tu condominio.
        </p>
        <Field id="edificio" name="edificio" label="Nombre del edificio" placeholder="Ej: Edificio Colina Del Este" required />
        <Field id="admin" name="admin" label="Tu nombre" placeholder="Nombre del miembro de la Junta" required />
        <Field id="email" name="email" type="email" label="Email de contacto" placeholder="admin@edificio.com" required />
        <Field
          id="telefono"
          name="telefono"
          type="tel"
          label="Teléfono"
          placeholder="+58 412 123 4567"
          required
        />
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Enviar solicitud
        </Button>
      </form>
    </div>
  );
}