import type { NextConfig } from "next"

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co").hostname

const nextConfig: NextConfig = {
  // cacheComponents fica desligado: quase toda tela depende da sessão do Supabase (cookie),
  // então renderização dinâmica por request é o modelo certo aqui.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/avatars/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
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
