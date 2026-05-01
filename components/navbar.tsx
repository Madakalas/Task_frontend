'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 border-b border-border backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-display font-bold text-primary tracking-widest">ESTATIQ</h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              Browse
            </Link>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              About
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              Contact
            </a>
            <Link
              href="/properties/add"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors"
            >
              List Property
            </Link>
          </div>

          <button
            className="md:hidden p-2 hover:bg-secondary/20 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link href="/" className="block text-foreground/80 hover:text-primary py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Browse</Link>
          <a href="#about" className="block text-foreground/80 hover:text-primary py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</a>
          <a href="#contact" className="block text-foreground/80 hover:text-primary py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</a>
          <Link href="/properties/add" className="block w-full text-center px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg" onClick={() => setMobileOpen(false)}>List Property</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
