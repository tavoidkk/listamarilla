import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Páginas Amarillas",
    short_name: "Páginas Amarillas",
    description: "Directorio de servicios para tu edificio",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FACC15",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/pwa-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
