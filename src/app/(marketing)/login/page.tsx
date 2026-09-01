import Link from "next/link";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";

export default function MarketingLoginPage() {
  return (
    <div className="bg-app-overlay flex min-h-screen items-center justify-center px-4 py-8">
      <ToastContainer />
      <form className="app-shell w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-bold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
          Acceso para juntas de condominio registradas.
        </p>
        <Field id="org" name="org" label="Edificio" placeholder="Slug o URL de tu edificio" required />
        <Field id="email" name="email" type="email" label="Email" placeholder="admin@edificio.com" required />
        <Field id="password" name="password" type="password" label="Contraseña" required />
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Entrar
        </Button>
        <p className="mt-4 text-center text-xs text-[color:var(--color-text-muted)]">
          ¿No tienes cuenta? <Link href="/solicitar" className="text-[color:var(--color-primary)] underline">Solicita acceso</Link>
        </p>
      </form>
    </div>
  );
}