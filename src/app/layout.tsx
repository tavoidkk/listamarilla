import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Páginas Amarillas",
  description:
    "Directorio de servicios para juntas de condominio y residentes. Encuentra prestadores de confianza en tu edificio.",
  applicationName: "Páginas Amarillas",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Páginas Amarillas",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-app-overlay min-h-full">
        {children}
        {process.env.NODE_ENV === "production" ? <ServiceWorkerRegister /> : null}
      </body>
    </html>
  );
}