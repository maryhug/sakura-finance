import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Sakura Finance",
    template: "%s — Sakura Finance",
  },
  description: "Tu app de finanzas personales: bonita, simple y poderosa.",
  icons: {
    icon: "/favicon.ico",
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f472b6",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={nunito.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
