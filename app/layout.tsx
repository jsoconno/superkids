"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import { KidsProvider } from "@/providers/kids-provider"
import { Header } from "@/components/header"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KidsProvider>
          <Suspense>
            <Header />
            {children}
          </Suspense>
        </KidsProvider>
      </body>
    </html>
  )
}
