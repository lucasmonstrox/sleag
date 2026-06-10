import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, TikTok_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import "./web.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const tiktokSans = TikTok_Sans({
  subsets: ["latin"],
  variable: "--font-display",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "TIKSPY — Console",
    template: "%s · TIKSPY",
  },
  description:
    "Inteligência de mercado para o TikTok Shop Brasil: descoberta de produtos, concorrência, score de viabilidade e alertas.",
}

export const viewport: Viewport = {
  themeColor: "#010101",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        geist.variable,
        tiktokSans.variable,
        fontMono.variable,
      )}
    >
      <body>
        <ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
