import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";

export default function MarketingHome() {
  return (
    <div className="bg-app-overlay min-h-screen">
      <ToastContainer />
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-[color:var(--color-primary)]">Páginas Amarillas</span>
        <Link href="/login" className="text-sm font-semibold text-[color:var(--color-primary)]">
          Iniciar sesión
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-12 pt-8 text-center">
        <h1 className="mb-3 text-3xl font-bold leading-tight text-[color:var(--color-text-primary)] sm:text-4xl">
          El directorio de servicios de tu edificio, en el bolsillo de cada vecino
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base text-[color:var(--color-text-secondary)]">
          Una PWA multi-tenant para juntas de condominio. Cada edificio administra su propio directorio
          de prestadores de servicios. Los vecinos lo consultan por QR.
        </p>

        <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/solicitar">
            <Button variant="primary" size="xl">
              Solicitar mi edificio
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="xl">
              Ya soy administrador
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 text-left sm:grid-cols-3">
          <Feature emoji="🔍" title="Encuentra rápido" desc="Vecinos consultan por categoría con un par de toques." />
          <Feature emoji="🛡️" title="Solo vecinos" desc="Código de seguridad del edificio para agregar contactos." />
          <Feature emoji="⭐" title="Confianza" desc="Calificaciones anónimas para saber quién es bueno." />
        </div>
      </main>

      <footer className="border-t border-[color:var(--color-border)] px-6 py-6 text-center text-xs text-[color:var(--color-text-muted)]">
        © {new Date().getFullYear()} Páginas Amarillas
      </footer>
    </div>
  );
}

function Feature({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <span aria-hidden className="mb-2 inline-block text-3xl">
        {emoji}
      </span>
      <h3 className="mb-1 font-bold">{title}</h3>
      <p className="text-sm text-[color:var(--color-text-secondary)]">{desc}</p>
    </div>
  );
}