import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#facc15",
};

export const metadata: Metadata = {
  title: "LISTAMARILLA — Directorio para juntas de condominio",
  description:
    "Directorio de servicios para juntas de condominio y residentes. Encuentra prestadores de confianza en tu edificio.",
  applicationName: "LISTAMARILLA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LISTAMARILLA",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-app-overlay min-h-screen">
        <Script id="capture-pwa-install" strategy="beforeInteractive">
          {`window.addEventListener("beforeinstallprompt", function (event) {
            event.preventDefault();
            window.__listamarillaInstallPrompt = event;
          });`}
        </Script>
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
        {process.env.NODE_ENV === "production" ? <ServiceWorkerRegister /> : null}
      </body>
    </html>
  );
}
