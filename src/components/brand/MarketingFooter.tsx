import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const PRODUCT = [
  { label: "Funciones", href: "/#features" },
  { label: "Cómo funciona", href: "/#how-it-works" },
  { label: "Precio", href: "/#pricing" },
  { label: "Solicitar demo", href: "/solicitar" },
];

const COMPANY = [
  { label: "Acerca de", href: "#" },
  { label: "Contacto", href: "#" },
  { label: "Términos", href: "/terminos" },
  { label: "Privacidad", href: "/privacidad" },
];

export function MarketingFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <div className="site-container py-16 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Logo size="md" />
          <p className="max-w-xs text-sm text-slate-600 leading-relaxed">
            El directorio de servicios de tu edificio, en el bolsillo de cada vecino.
          </p>
        </div>
        <FooterColumn title="Producto" links={PRODUCT} />
        <FooterColumn title="Empresa" links={COMPANY} />
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>info@paginas-amarillas.app</li>
            <li>Soporte 9am-6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="site-container py-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LISTAMARILLA. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Hecho para juntas de condominio
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-slate-600 transition-colors hover:text-amber-600 focus:ring-2 focus:ring-amber-400 focus:outline-none rounded-lg px-1 py-0.5"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
