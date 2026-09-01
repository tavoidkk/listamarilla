import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Páginas Amarillas",
    short_name: "Páginas Amarillas",
    description: "Directorio de servicios para tu edificio",
    start_url: "/",
    display: "standalone",
    background_color: "#dfd3c2",
    theme_color: "#6355b8",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}