'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { MapPin, ArrowRight } from 'lucide-react'

interface CoverImage {
  _id: string
  url: string
  roomType: string
  features: string[]
  score: number
  isCover: boolean
}

interface PropertyCardProps {
  _id: string
  title: string
  location: string
  price: number
  tags: string[]
  status: 'processing' | 'ready'
  coverImage: CoverImage | null
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`
  return `$${price}`
}

export default function PropertyCard({ _id, title, location, price, tags, status, coverImage }: PropertyCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageUrl = coverImage ? `http://localhost:8000${coverImage.url}` : null

  return (
    <Link href={`/properties/${_id}`} className="block group h-full">
      <div className="h-full bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">

        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-secondary to-background overflow-hidden">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className={`object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/50 to-background animate-pulse" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/50 to-background flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🏠</div>
                <div className="text-xs text-foreground/30">No image yet</div>
              </div>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-60" />

          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur text-primary px-3 py-1.5 rounded-lg text-sm font-bold border border-primary/30">
            {formatPrice(price)}
          </div>

          {/* Processing Badge */}
          {status === 'processing' && (
            <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Analyzing...
            </div>
          )}

          {/* Location overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{location}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-base font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-secondary/70 text-foreground/60 px-2 py-0.5 rounded-full border border-border">
                  {tag.replace('_', ' ')}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-foreground/40">+{tags.length - 3}</span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-foreground/40 font-medium">View Details</span>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}
