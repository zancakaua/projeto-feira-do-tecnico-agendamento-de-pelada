import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // cacheComponents fica desligado: quase toda tela depende da sessão do Supabase (cookie),
  // então renderização dinâmica por request é o modelo certo aqui.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
