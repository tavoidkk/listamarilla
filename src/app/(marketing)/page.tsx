import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedLinesCTA } from "@/components/ui/AnimatedLinesCTA";
import { MarketingHeader } from "@/components/brand/MarketingHeader";
import { MarketingFooter } from "@/components/brand/MarketingFooter";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

export default function MarketingHome() {
  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-amber-300 selection:text-slate-900">
      <MarketingHeader />

      <main className="w-full flex-1 overflow-hidden">
        {/* ============================ HERO ============================ */}
        <section className="relative overflow-hidden bg-white">
          {/* Fondo decorativo con líneas tech animadas */}
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-white to-white" />
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.08]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="techLines"
                  x="0"
                  y="0"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 30 L60 30 M30 0 L30 60"
                    stroke="#f59e0b"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#techLines)" />
            </svg>
            <div className="absolute -right-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] animate-pulse rounded-full bg-amber-400/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="animate-fade-in-up space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 shadow-sm">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 animate-pulse rounded-full bg-slate-900"
                  />
                  Para juntas de condominio
                </span>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                  Tu edificio tiene un{" "}
                  <span className="relative inline-block">
                    <span
                      className="absolute inset-0 -z-0 rounded-md bg-amber-400"
                      aria-hidden="true"
                    />
                    <span className="relative z-10 px-1 font-black italic text-slate-900">
                      directorio.
                    </span>
                  </span>
                  <br />
                  Tus vecinos{" "}
                  <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text font-black italic text-transparent">
                    ya lo están usando.
                  </span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Una PWA simple donde tu condominio publica los prestadores de servicios de
                  confianza. Los vecinos consultan y califican. Sin apps que descargar, sin cuentas
                  que crear.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/solicitar">
                    <Button variant="primary" size="lg">
                      Solicitar mi edificio
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="secondary" size="lg">
                      Ver cómo funciona
                    </Button>
                  </a>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                  <svg
                    className="h-4 w-4 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Instalación en 5 minutos
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <svg
                    className="h-4 w-4 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  $100 al año, todo incluido
                </p>
              </div>

              <div className="relative animate-fade-in-up [animation-delay:200ms]">
                <div className="relative mx-auto w-full max-w-[300px]">
                  {/* Phone frame más ancho, look iPhone grande */}
                  <div className="relative rounded-[42px] border-[3px] border-slate-800 bg-slate-900 p-[3px] shadow-2xl">
                    <div className="relative overflow-hidden rounded-[38px] bg-white">
                      {/* Notch estilo Dynamic Island */}
                      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-900" />
                      {/* Status bar */}
                      <div className="relative flex items-center justify-between bg-white px-6 pb-1 pt-3 text-[11px] font-semibold text-slate-900">
                        <span>9:41</span>
                        <span aria-hidden="true" className="flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-slate-900" />
                          <span className="h-1 w-1 rounded-full bg-slate-900" />
                          <span className="h-1 w-1 rounded-full bg-slate-900" />
                        </span>
                      </div>
                      {/* App content - Header del edificio */}
                      <div className="bg-gradient-to-b from-amber-50 to-white px-5 pb-8 pt-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-sm">
                          <Image
                            src="/icons/icon.png"
                            alt=""
                            width={1000}
                            height={1000}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-lg font-bold text-slate-900">Colina Del Este</p>
                        <p className="text-[11px] text-slate-500">Directorio de servicios</p>
                      </div>
                      {/* Grid categorías - 3x2 más alto */}
                      <div className="grid grid-cols-2 gap-2.5 px-4 pb-8 pt-2">
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">Plomería</span>
                        </div>
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">
                            Electricidad
                          </span>
                        </div>
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3l18 18M9 9l6 6M15 9l-6 6"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">
                            Carpintería
                          </span>
                        </div>
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">Mecánica</span>
                        </div>
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">
                            Albañilería
                          </span>
                        </div>
                        <div className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-center">
                          <svg
                            className="h-5 w-5 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                            />
                          </svg>
                          <span className="text-[11px] font-medium text-slate-800">
                            Refrigeración
                          </span>
                        </div>
                      </div>
                      {/* Bottom home indicator */}
                      <div className="flex justify-center pb-2 pt-1">
                        <div className="h-1 w-28 rounded-full bg-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ TRUST STRIP ============================ */}
        <ScrollReveal direction="up">
          <section className="my-12 overflow-hidden border-y border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <p className="mb-10 text-center text-sm font-semibold uppercase tracking-wider text-slate-600">
                Edificios que ya usan LISTAMARILLA
              </p>
              <div className="relative overflow-hidden">
                <div className="flex animate-marquee gap-6">
                  {[
                    { initials: "CE", name: "Edificio Colina Del Este" },
                    { initials: "TH", name: "Torre Humboldt" },
                    { initials: "EP", name: "Residencias El Parque" },
                    { initials: "LP", name: "Conjunto Los Pinos" },
                    { initials: "MV", name: "Mirador de Valle Arriba" },
                    { initials: "PA", name: "Paseo Altamira" },
                    { initials: "CE", name: "Edificio Colina Del Este" },
                    { initials: "TH", name: "Torre Humboldt" },
                    { initials: "EP", name: "Residencias El Parque" },
                    { initials: "LP", name: "Conjunto Los Pinos" },
                  ].map((b, i) => (
                    <div
                      key={`${b.name}-${i}`}
                      className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-slate-900">
                        {b.initials}
                      </span>
                      <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
                        {b.name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent" />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================ FEATURES ============================ */}
        <section
          id="features"
          className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white py-24"
        >
          {/* Detalles de color: orbes amber sutiles */}
          <div
            className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />
          {/* Franja decorativa amber en el top */}
          <div
            className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <span className="mb-4 inline-block animate-badge-pulse rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-slate-900">
                  Funciones
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-slate-900">
                  Todo lo que tu junta necesita,
                  <br />
                  nada que los vecinos no entiendan.
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Diseñado para juntas de condominio reales, no para ingenieros.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <ScrollReveal direction="up" delay={0}>
                <div className="group h-full space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="h-6 w-6 text-slate-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                    Encuentra al instante
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Vecinos consultan por categoría con un par de toques. Plomería, electricidad,
                    limpieza — todo a un click.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={150}>
                <div className="group h-full space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="h-6 w-6 text-slate-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4zM9 12l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                    Solo residentes
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Un código de seguridad del edificio impide que personas ajenas agreguen
                    contactos. Solo los vecinos pueden votar.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={300}>
                <div className="group h-full space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="h-6 w-6 text-slate-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                    Calidad transparente
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Calificaciones anónimas para saber quién es bueno. Un vecino puede ver antes de
                    llamar.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ============================ HOW IT WORKS (Scroll reveal paso a paso) ============================ */}
        <section
          id="how-it-works"
          className="relative overflow-hidden bg-gradient-to-b from-amber-50/40 via-slate-50 to-amber-50/30 py-24"
        >
          {/* Detalles amber */}
          <div
            className="absolute left-0 top-1/2 h-96 w-32 -translate-y-1/2 bg-gradient-to-r from-amber-100/30 to-transparent blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-1/2 h-96 w-32 -translate-y-1/2 bg-gradient-to-l from-amber-100/30 to-transparent blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <span className="mb-4 inline-block animate-badge-pulse rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-slate-900">
                  Cómo funciona
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-slate-900">
                  De cero a funcionando en una tarde.
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Tres pasos simples para que tu condominio tenga su propio directorio digital.
                </p>
              </div>
            </ScrollReveal>

            <div className="mx-auto max-w-2xl space-y-6">
              <ScrollReveal direction="left" delay={0}>
                <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xl md:p-8">
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-extrabold text-slate-900 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-400/50">
                      01
                    </span>
                    <div className="flex-1 space-y-2">
                      <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        Configuración
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        La Junta crea el edificio
                      </h3>
                      <p className="leading-relaxed text-slate-600">
                        Configuras tu edificio, personalizas el branding (color, logo, imagen) y
                        defines un código de seguridad para los vecinos.
                      </p>
                    </div>
                  </div>
                  {/* Línea conectora vertical hacia el siguiente */}
                  <div className="absolute -bottom-6 left-[2.4rem] h-6 w-0.5 bg-gradient-to-b from-amber-400 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={200}>
                <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xl md:p-8">
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-extrabold text-slate-900 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-400/50">
                      02
                    </span>
                    <div className="flex-1 space-y-2">
                      <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        Impresión
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        Imprimen el QR
                      </h3>
                      <p className="leading-relaxed text-slate-600">
                        Generan un QR único para el edificio. Lo imprimen y lo pegan en el lobby, el
                        ascensor o lo comparten por WhatsApp.
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-[2.4rem] h-6 w-0.5 bg-gradient-to-b from-amber-400 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={400}>
                <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-400 hover:bg-amber-50/20 hover:shadow-xl md:p-8">
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 text-xl font-extrabold text-slate-900 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-400/50">
                      03
                    </span>
                    <div className="flex-1 space-y-2">
                      <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        Activación
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-700">
                        Los vecinos escanean y listo
                      </h3>
                      <p className="leading-relaxed text-slate-600">
                        Aceptan el aviso, ven los contactos por categoría, califican al que usaron.
                        Sin descargar nada — funciona en el navegador del teléfono.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ============================ PRICING ============================ */}
        <section
          id="pricing"
          className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/10 to-white py-24"
        >
          {/* Detalles decorativos */}
          <div
            className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <span className="mb-4 inline-block animate-badge-pulse rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-slate-900">
                  Precio
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-slate-900">
                  Un precio simple. Sin sorpresas.
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Pagas una vez al año. Eso es todo.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="flex justify-center">
                <div className="group relative mx-auto w-full max-w-md rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-8">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-md">
                    Plan anual
                  </div>
                  <div className="mb-3 mt-2 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
                      $100
                    </span>
                    <span className="text-lg text-slate-500">/año</span>
                  </div>
                  <p className="mb-6 text-center text-sm text-slate-500">
                    Equivale a $8.33 al mes. Menos que una cuota de mantenimiento.
                  </p>
                  <ul className="mb-6 space-y-2.5 text-left">
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">
                        Portal PWA para vecinos (sin descarga)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">
                        Panel de administración para la Junta
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">Categorías personalizables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">Calificaciones y reseñas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">QR imprimible para el lobby</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">
                        Branding personalizado (colores, logo)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-slate-800">Soporte por email y backups</span>
                    </li>
                  </ul>
                  <Link href="/solicitar" className="block">
                    <Button variant="primary" size="md" fullWidth>
                      Empezar ahora
                    </Button>
                  </Link>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    Pago anual. Sin contratos. Cancela cuando quieras.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ============================ FAQ ============================ */}
        <section
          id="faq"
          className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-100 py-24"
        >
          {/* Detalles decorativos amber */}
          <div
            className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <span className="mb-4 inline-block animate-badge-pulse rounded-full bg-amber-400 px-4 py-1.5 text-sm font-bold text-slate-900">
                  Preguntas frecuentes
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-slate-900">
                  Lo que suelen preguntar las juntas.
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Respuestas claras a las dudas más comunes antes de empezar.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <FaqAccordion
                items={[
                  {
                    question: "¿Los vecinos tienen que descargar una app?",
                    answer:
                      "No. Funciona directamente en el navegador del teléfono como una PWA. Los vecinos pueden agregarla a su pantalla de inicio con un click, pero no es obligatorio.",
                  },
                  {
                    question: "¿Cómo evitan que externos agreguen contactos falsos?",
                    answer:
                      "La Junta define un código de seguridad que solo se comparte con los residentes verificados. Sin ese código nadie puede agregar ni modificar contactos, pero sí pueden verlos.",
                  },
                  {
                    question: "¿Qué pasa si un vecino se muda?",
                    answer:
                      "El contacto queda en el directorio pero el vecino ya no puede votar ni agregar. La Junta puede suspender o eliminar miembros desde el panel.",
                  },
                  {
                    question: "¿Puedo cambiar los colores y el logo?",
                    answer:
                      "Sí. Desde el panel de administración puedes subir el logo del edificio, cambiar la paleta de colores y la imagen de fondo. Los cambios se ven al instante en el portal de vecinos.",
                  },
                  {
                    question: "¿Y si quiero dejar de usar el servicio?",
                    answer:
                      "Cancelas cuando quieras. Tus datos quedan disponibles para exportar y el portal de vecinos deja de estar accesible. Sin cláusulas de permanencia.",
                  },
                ]}
              />
            </ScrollReveal>
          </div>
        </section>

        {/* ============================ FINAL CTA (Líneas dinámicas con animejs) ============================ */}
        <section className="relative overflow-hidden bg-slate-950">
          <AnimatedLinesCTA />

          <ScrollReveal direction="up">
            <div className="relative mx-auto max-w-7xl px-6 py-32 text-center lg:px-8">
              <div className="mx-auto max-w-3xl space-y-8">
                <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                  Tu edificio en 5 minutos.
                </h2>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                  Una sola decisión para transformar cómo tu edificio encuentra prestadores de
                  servicios.
                </p>
                <div className="pt-2">
                  <Link href="/solicitar" className="inline-block">
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-amber-400 px-10 py-4 text-lg font-bold text-slate-900 shadow-[0_0_40px_-10px_rgba(251,191,36,0.8)] transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 hover:shadow-[0_0_60px_-10px_rgba(251,191,36,1)]"
                    >
                      Solicitar mi edificio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
