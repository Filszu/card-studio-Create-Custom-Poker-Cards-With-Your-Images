import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Card Studio - Custom Poker Cards Generator",
  description:
    "Create and customize your own poker cards with your images. Perfect for gifts, events, or personal collections.",
  keywords: ["custom poker cards", "card generator", "playing cards", "custom deck", "card design", "poker cards"],
  authors: [{ name: "Filszu", url: "https://github.com/filszu" }],
  creator: "Filszu",
  publisher: "Card Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://card-studio.vercel.app/",
    title: "Card Studio - Custom Poker Cards Generator",
    description: "Create and customize your own poker cards with your images",
    siteName: "Card Studio",
    images: [
      {
        url: "/images/card-studio-og.png",
        width: 1200,
        height: 630,
        alt: "Card Studio - Custom Poker Cards Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Studio - Custom Poker Cards Generator",
    description: "Create and customize your own poker cards with your images",
    images: ["/images/card-studio-og.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <footer className="border-t border-white/10 py-6">
            <div className="container text-center text-sm text-white/60">
              © {new Date().getFullYear()} Card Studio. All rights reserved.
              <div className="mt-2">
                Created by{" "}
                <a
                  href="https://github.com/filszu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF7E67] hover:underline"
                >
                  Filszu
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
