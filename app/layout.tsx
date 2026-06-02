import type { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
