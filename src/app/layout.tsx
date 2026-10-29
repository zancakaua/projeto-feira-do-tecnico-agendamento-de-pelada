import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Narrow, Courier_Prime } from "next/font/google"
import "./globals.css"

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" })
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
})
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Racha", template: "%s · Racha" },
  description: "A lista da pelada que se organiza sozinha: vagas, lista de espera, Pix e times.",
  applicationName: "Racha",
  icons: { icon: "/icons/192", apple: "/icons/180" },
  appleWebApp: { capable: true, title: "Racha", statusBarStyle: "black" },
}

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${archivoNarrow.variable} ${courierPrime.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  )
}
