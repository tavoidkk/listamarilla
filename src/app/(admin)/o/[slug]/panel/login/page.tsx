import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { loginAction } from "../auth-actions";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("name, logo_url")
    .eq("slug", slug)
    .single();

  if (!org) redirect(`/`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(`/o/${slug}/panel`);

  return (
    <div className="bg-app-overlay flex min-h-screen w-full items-center justify-center px-4">
      <div className="app-shell w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-2xl font-bold text-[color:var(--color-text-primary)]">
            {org.name ?? "Edificio"}
          </h1>
          <p className="text-sm text-[color:var(--color-text-secondary)]">Panel de administración</p>
        </div>

        <form action={loginAction} className="flex flex-col">
          <input type="hidden" name="slug" value={slug} />

          {error ? (
            <p className="mb-4 rounded bg-[color:var(--color-danger-bg)] px-3 py-2 text-sm text-[color:var(--color-danger)]">
              {error}
            </p>
          ) : null}

          <Field
            id="email"
            name="email"
            type="email"
            label="Correo electrónico"
            autoComplete="email"
            placeholder="admin@edificio.com"
            required
          />
          <Field
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[color:var(--color-text-muted)]">
          El acceso al panel es solo para miembros autorizados de la Junta de Condominio.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}