import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ESTATIQ - Luxury Real Estate',
  description: 'Discover exceptional properties curated for discerning buyers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
