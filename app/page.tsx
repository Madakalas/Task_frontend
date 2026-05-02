'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import FilterBar, { FilterState } from '@/components/filter-bar'
import PropertyGrid from '@/components/property-grid'
import EmptyState from '@/components/empty-state'
import Pagination from '@/components/pagination'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

interface CoverImage {
  _id: string
  url: string
  roomType: string
  features: string[]
  score: number
  isCover: boolean
}

interface Property {
  _id: string
  title: string
  location: string
  price: number
  tags: string[]
  status: 'processing' | 'ready'
  coverImage: CoverImage | null
}

interface ApiResponse {
  success: boolean
  data: Property[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [locations, setLocations] = useState<string[]>([])
  const [allLocations, setAllLocations] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    tags: [],
  })

  const LIMIT = 9

  // Fetch all locations once for dropdown
  const fetchAllLocations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/properties?limit=200`)
      if (!res.ok) return
      const data: ApiResponse = await res.json()
      if (data.success) {
        const locs = Array.from(
          new Set(data.data.map((p: Property) => p.location).filter(Boolean))
        ).sort() as string[]
        setAllLocations(locs)
      }
    } catch {}
  }, [])

  const fetchProperties = useCallback(async (page: number, currentFilters: FilterState) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
      })
      if (currentFilters.search) params.append('search', currentFilters.search)
      if (currentFilters.location) params.append('location', currentFilters.location)
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice)
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice)
      if (currentFilters.tags.length > 0) params.append('tags', currentFilters.tags.join(','))

      const res = await fetch(`${API_BASE}/api/properties?${params}`)
      if (!res.ok) throw new Error('Failed to fetch properties')

      const data: ApiResponse = await res.json()
      if (data.success) {
        setProperties(data.data)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(data.pagination.page)
        setTotal(data.pagination.total)
        // locations are fetched separately via fetchAllLocations
      }
    } catch {
      setError('Could not connect to the server. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllLocations()
  }, [fetchAllLocations])

  useEffect(() => {
    setCurrentPage(1)
    fetchProperties(1, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProperties(page, filters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Merge locations from all fetches
  const mergedLocations = Array.from(new Set([...allLocations, ...locations]))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FilterBar onFiltersChange={(f) => { setCurrentPage(1); setFilters(f); }} locations={mergedLocations} />

      {/* Results bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-foreground/50 text-sm">
              {total > 0 ? `${total} propert${total === 1 ? 'y' : 'ies'} found` : ''}
            </p>
            <Link
              href="/properties/add"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              + List a Property
            </Link>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-5 rounded-xl mb-8 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm mt-1 opacity-80">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <>
            {loading ? (
              <PropertyGrid properties={[]} isLoading={true} />
            ) : properties.length > 0 ? (
              <>
                <PropertyGrid properties={properties} isLoading={false} />
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>

      {/* About Section */}
      <section id="about" className="bg-card/50 border-t border-border py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">About ESTATIQ</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
            AI-Powered Real Estate Intelligence
          </h2>
          <p className="text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            ESTATIQ combines cutting-edge AI technology with premium real estate expertise.
            Every property listing is analyzed by GPT-4 Vision to detect room types, features,
            and quality insights — giving buyers and agents unprecedented transparency.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏠', title: 'Smart Listings', desc: 'AI analyzes every image for room types and features' },
              { icon: '✨', title: 'Auto Descriptions', desc: 'Luxury property descriptions generated automatically' },
              { icon: '📊', title: 'Quality Scores', desc: 'Each image scored and ranked for best presentation' },
            ].map(item => (
              <div key={item.title} className="bg-card rounded-xl p-6 border border-border">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">Get In Touch</p>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-foreground/60 mb-8">Interested in listing your property or have questions? We'd love to hear from you.</p>
          <div className="bg-card rounded-xl p-8 border border-border space-y-4 text-left">
            <div>
              <label className="block text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wider">Your Name</label>
              <input type="text" placeholder="John Smith" className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wider">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wider">Message</label>
              <textarea rows={4} placeholder="Tell us about your property or inquiry..." className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors resize-none" />
            </div>
            <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-foreground/30 text-sm">© 2026 ESTATIQ. Premium Real Estate Platform.</p>
      </footer>
    </div>
  )
}
