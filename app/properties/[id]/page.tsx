'use client'

import { Navbar } from '@/components/navbar'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowLeft, ChevronLeft, ChevronRight, X, Phone } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

interface PropertyImage {
  _id: string
  url: string
  roomType: string
  features: string[]
  improvements: string[]
  score: number
  isCover: boolean
}

interface Property {
  _id: string
  title: string
  price: number
  location: string
  description: string | null
  tags: string[]
  status: 'processing' | 'ready'
  coverImage: PropertyImage | null
  images: PropertyImage[]
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`
  return `$${price.toLocaleString()}`
}

const ROOM_LABELS: Record<string, { label: string; icon: string }> = {
  bedroom:      { label: 'Bedroom',       icon: '🛏️' },
  living_room:  { label: 'Living Room',   icon: '🛋️' },
  kitchen:      { label: 'Kitchen',       icon: '🍳' },
  bathroom:     { label: 'Bathroom',      icon: '🚿' },
  dining_room:  { label: 'Dining Room',   icon: '🍽️' },
  exterior:     { label: 'Exterior',      icon: '🏠' },
  garden:       { label: 'Garden',        icon: '🌿' },
  pool:         { label: 'Pool Area',     icon: '🏊' },
  balcony:      { label: 'Balcony',       icon: '🌅' },
  other:        { label: 'Property View', icon: '📸' },
}

const getRoomInfo = (roomType: string) =>
  ROOM_LABELS[roomType?.toLowerCase()] ?? { label: roomType?.replace(/_/g, ' ') || 'Property View', icon: '📸' }

const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-400' }
  if (score >= 60) return { label: 'Good', color: 'text-primary' }
  if (score >= 40) return { label: 'Average', color: 'text-amber-400' }
  return { label: 'Fair', color: 'text-foreground/50' }
}

function ScoreBar({ score }: { score: number }) {
  const { color } = getScoreLabel(score)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-primary' : score >= 40 ? 'bg-amber-400' : 'bg-foreground/30'}`}
          style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs w-16 font-medium ${color}`}>{getScoreLabel(score).label}</span>
    </div>
  )
}

function Lightbox({ images, index, onClose, onNext, onPrev }: {
  images: PropertyImage[]
  index: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2" onClick={onClose}><X className="h-6 w-6" /></button>
      <button className="absolute left-4 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); onPrev() }}><ChevronLeft className="h-8 w-8" /></button>
      <div className="relative w-full max-w-4xl max-h-[80vh] mx-16" onClick={e => e.stopPropagation()}>
        <Image src={`${API_BASE}${images[index].url}`} alt={images[index].roomType} width={1200} height={800} className="object-contain w-full h-full max-h-[80vh]" />
      </div>
      <button className="absolute right-4 text-white/70 hover:text-white p-2" onClick={e => { e.stopPropagation(); onNext() }}><ChevronRight className="h-8 w-8" /></button>
      <div className="absolute bottom-4 text-white/50 text-sm">{index + 1} / {images.length}</div>
    </div>
  )
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'not-found' | 'error' | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const fetchProperty = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}`)
      if (res.status === 404) { setError('not-found'); setLoading(false); return }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProperty(data.data)
      setError(null)
      setLoading(false)
      if (data.data.status === 'processing') setIsPolling(true)
    } catch {
      setError('error')
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => { fetchProperty() }, [fetchProperty])

  useEffect(() => {
    if (!isPolling || !property) return
    const id = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/properties/${propertyId}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.data.status === 'ready') {
          setProperty(data.data)
          setIsPolling(false)
        }
      } catch {}
    }, 4000)
    return () => clearInterval(id)
  }, [isPolling, property, propertyId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-secondary/50 rounded w-32" />
            <div className="h-96 bg-secondary/50 rounded-xl" />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="h-8 bg-secondary/50 rounded w-2/3" />
                <div className="h-4 bg-secondary/30 rounded w-1/3" />
                <div className="h-24 bg-secondary/20 rounded" />
              </div>
              <div className="h-64 bg-secondary/30 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error === 'not-found') {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">🏚️</div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Property Not Found</h2>
          <p className="text-foreground/50 mb-8">This property doesn't exist or has been removed.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors">Browse Properties</Link>
        </div>
      </main>
    )
  }

  if (error === 'error') {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Something went wrong</h2>
          <p className="text-foreground/50 mb-8">Could not load this property. Make sure the backend is running.</p>
          <button onClick={fetchProperty} className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors">Try Again</button>
        </div>
      </main>
    )
  }

  if (!property) return null

  const allImages = property.images || []
  const allImprovements = allImages.flatMap(img => img.improvements || []).filter(Boolean)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          All Properties
        </button>

        {/* Cover Image */}
        <div className="relative w-full h-80 sm:h-[500px] rounded-2xl overflow-hidden mb-8 bg-secondary/30">
          {property.coverImage ? (
            <Image src={`${API_BASE}${property.coverImage.url}`} alt={property.title} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">🏠</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>
          {property.status === 'processing' && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-amber-500/90 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              AI Analysis in Progress...
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">{property.title}</h2>
                  <div className="flex items-center gap-1.5 text-foreground/50 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-primary">{formatPrice(property.price)}</div>
                  <div className="text-xs text-foreground/40 mt-0.5">Listing Price</div>
                </div>
              </div>

              {/* Tags */}
              {property.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-foreground/40 uppercase tracking-wider font-medium mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {property.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-medium">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">About This Property</h3>
              {property.status === 'processing' ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-secondary/50 rounded w-full" />
                  <div className="h-3 bg-secondary/50 rounded w-5/6" />
                  <div className="h-3 bg-secondary/50 rounded w-4/6" />
                  <p className="text-xs text-amber-500 mt-3">⏳ AI is generating the property description...</p>
                </div>
              ) : property.description ? (
                <p className="text-foreground/70 leading-relaxed italic">{property.description}</p>
              ) : (
                <p className="text-foreground/40 text-sm">No description available yet.</p>
              )}
            </div>

            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Image Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((img, idx) => (
                    <button
                      key={img._id}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform"
                    >
                      <Image src={`${API_BASE}${img.url}`} alt={img.roomType || 'Property'} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity capitalize font-medium">
                          {getRoomInfo(img.roomType).icon} {getRoomInfo(img.roomType).label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
            {/* Insights */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-display text-lg font-semibold text-primary mb-4">Property Insights</h3>
              {property.status === 'processing' ? (
                <div className="space-y-3 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-secondary/40 rounded" />)}
                  <p className="text-xs text-amber-500">⏳ Analyzing images...</p>
                </div>
              ) : allImages.length > 0 ? (
                <div className="space-y-4">
                  {allImages.map((img, idx) => {
                    const room = getRoomInfo(img.roomType)
                    return (
                    <div key={img._id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{room.icon}</span>
                          <span className="text-sm font-medium text-foreground capitalize">
                            {room.label}
                          </span>
                          {img.isCover && (
                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full border border-primary/30">Cover</span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/40">#{idx + 1}</span>
                      </div>
                      <ScoreBar score={img.score} />
                      {img.features?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {img.features.map(f => (
                            <span key={f} className="text-xs bg-secondary/50 text-foreground/60 px-1.5 py-0.5 rounded">
                              {f.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              ) : (
                <p className="text-foreground/40 text-sm">No images analyzed yet.</p>
              )}
            </div>

            {/* Improvements */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Suggested Improvements</h3>
              {allImprovements.length > 0 ? (
                <div className="space-y-2">
                  {[...new Set(allImprovements)].map((imp, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-400 mt-0.5">⚠</span>
                      <span className="text-foreground/60">{imp}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <span>✓</span>
                  <span>Images look great!</span>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">Interested?</h3>
              <p className="text-foreground/50 text-sm mb-4">Contact our agent to schedule a viewing or get more information.</p>
              <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex(i => (i! + 1) % allImages.length)}
          onPrev={() => setLightboxIndex(i => i === 0 ? allImages.length - 1 : i! - 1)}
        />
      )}
    </main>
  )
}
