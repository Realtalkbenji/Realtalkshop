import type { Metadata, Viewport } from "next"
import { Anton, Space_Grotesk } from "next/font/google"
import "./globals.css"

const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
})

const sans = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "REAL TALK SHOP",
  description: "REAL TALK SHOP — say it plain, wear it loud.",
}

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-svh bg-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  )
}
