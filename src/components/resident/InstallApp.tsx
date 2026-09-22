"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __listamarillaInstallPrompt?: InstallPromptEvent;
  }
}

const keyFor = (slug: string) => `pa:install-offered:${slug}`;
let pendingInstallPrompt: InstallPromptEvent | null = null;

export function InstallApp({
  orgName,
  orgSlug,
  floating = false,
}: {
  orgName: string;
  orgSlug: string;
  floating?: boolean;
}) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    () => pendingInstallPrompt,
  );
  const [installed, setInstalled] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    let active = true;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    queueMicrotask(() => {
      if (!active) return;
      setInstalled(standalone);
      setIsIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
      setIsAndroid(/Android/i.test(navigator.userAgent));
      const capturedPrompt = window.__listamarillaInstallPrompt ?? pendingInstallPrompt;
      if (capturedPrompt) {
        pendingInstallPrompt = capturedPrompt;
        setPromptEvent(capturedPrompt);
      }
      setShowOffer(!floating && !standalone && localStorage.getItem(keyFor(orgSlug)) !== "1");
    });

    const onPrompt = (event: Event) => {
      event.preventDefault();
      pendingInstallPrompt = event as InstallPromptEvent;
      window.__listamarillaInstallPrompt = pendingInstallPrompt;
      setPromptEvent(pendingInstallPrompt);
    };
    const onInstalled = () => {
      setInstalled(true);
      setShowOffer(false);
      setShowHelp(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      active = false;
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [orgSlug, floating]);

  function dismiss() {
    localStorage.setItem(keyFor(orgSlug), "1");
    setShowOffer(false);
    setShowHelp(false);
  }

  async function install() {
    localStorage.setItem(keyFor(orgSlug), "1");
    setShowOffer(false);
    if (!promptEvent) {
      setShowHelp(true);
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    pendingInstallPrompt = null;
    window.__listamarillaInstallPrompt = undefined;
    setPromptEvent(null);
    if (choice.outcome === "dismissed") setShowHelp(true);
  }

  if (installed) return null;

  if (floating) {
    return (
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2">
        {showHelp ? (
          <div
            role="status"
            className="w-[min(21rem,calc(100vw-2.5rem))] rounded-2xl border border-amber-200 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              aria-label="Cerrar instrucciones"
              className="float-right ml-2 rounded-full p-1 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <X size={17} />
            </button>
            <p className="mb-1 font-bold text-slate-900">Agrega {orgName} a tu inicio</p>
            {isIos
              ? "En Safari, toca Compartir y luego ‘Agregar a pantalla de inicio’."
              : isAndroid
                ? "En Chrome, abre el menú ⋮ y toca ‘Instalar aplicación’."
                : "Abre el menú de tu navegador y elige ‘Instalar aplicación’ o ‘Agregar a pantalla de inicio’."}
          </div>
        ) : null}
        <button
          type="button"
          onClick={install}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-amber-500 bg-amber-400 px-5 text-sm font-bold text-slate-900 shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          <Download size={18} aria-hidden /> Instalar directorio
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full max-w-[480px] text-left">
      {showOffer ? (
        <div className="relative rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar invitación para instalar"
            className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            <X size={18} />
          </button>
          <p className="pr-7 text-base font-bold text-slate-900">
            Lleva {orgName} a tu pantalla principal
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Abre el directorio de tu edificio con un toque, sin buscar el enlace cada vez.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={install}>
              <Download size={16} /> Agregar a inicio
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Ahora no
            </Button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={install}
        className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 underline decoration-amber-500 underline-offset-4 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      >
        <Download size={16} /> Agregar este edificio a mi pantalla principal
      </button>

      {showHelp ? (
        <div
          role="status"
          className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700"
        >
          {isIos
            ? "En Safari, toca Compartir y luego ‘Agregar a pantalla de inicio’."
            : isAndroid
              ? "En Chrome, abre el menú ⋮ y toca ‘Instalar aplicación’."
              : "Abre el menú de tu navegador y elige ‘Instalar aplicación’ o ‘Agregar a pantalla de inicio’."}
        </div>
      ) : null}
    </div>
  );
}
