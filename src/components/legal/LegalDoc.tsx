import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: ReactNode }
  | { type: "list"; items: ReactNode[] }
  | { type: "note"; text: ReactNode };

export interface LegalSection {
  id: string;
  title: string;
  blocks: Block[];
}

interface LegalDocProps {
  badge: string;
  title: string;
  subtitle: string;
  updatedOn: string;
  contactEmail: string;
  sections: LegalSection[];
}

export function LegalDoc({ badge, title, subtitle, updatedOn, contactEmail, sections }: LegalDocProps) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-14 lg:px-8 lg:py-20">
      {/* Encabezado del documento */}
      <header className="mb-12 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-sm md:p-10">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
          {badge}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{subtitle}</p>
        <p className="mt-6 text-sm font-semibold text-slate-500">
          Última actualización: <span className="text-slate-900">{updatedOn}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        {/* Índice */}
        <nav aria-label="Índice" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">En esta página</p>
          <ol className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-amber-50 hover:text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <span className="text-xs font-bold text-amber-500">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Secciones */}
        <div className="min-w-0 space-y-8">
          {sections.map((s, i) => (
            <section
              id={s.id}
              key={s.id}
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-sm font-extrabold text-slate-900">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{s.title}</h2>
              </div>
              <div className="space-y-4">
                {s.blocks.map((block, j) => {
                  if (block.type === "list") {
                    return (
                      <ul key={j} className="space-y-2.5">
                        {block.items.map((item, k) => (
                          <li key={k} className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-600">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "note") {
                    return (
                      <div
                        key={j}
                        className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700"
                      >
                        {block.text}
                      </div>
                    );
                  }
                  return (
                    <p key={j} className="text-[15px] leading-relaxed text-slate-600">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Contacto al final */}
          <div className="flex flex-col items-start gap-3 rounded-2xl bg-slate-900 p-6 text-slate-200 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-base font-bold text-white">¿Tienes preguntas sobre este documento?</p>
              <p className="mt-1 text-sm text-slate-400">
                Escríbenos y nuestro equipo te responderá a la brevedad.
              </p>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:bg-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}