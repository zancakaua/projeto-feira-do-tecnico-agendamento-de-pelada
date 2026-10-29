import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Racha",
    short_name: "Racha",
    description: "A lista da pelada que se organiza sozinha: vagas, lista de espera, Pix e times.",
    lang: "pt-BR",
    start_url: "/minhas-peladas",
    display: "standalone",
    background_color: "#f3f3ef",
    theme_color: "#141414",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
