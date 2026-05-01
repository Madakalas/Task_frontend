import PropertyCard from './property-card'
import PropertySkeleton from './property-skeleton'

interface Property {
  _id: string
  title: string
  location: string
  price: number
  tags: string[]
  status: 'processing' | 'ready'
  coverImage: any
}

interface PropertyGridProps {
  properties: Property[]
  isLoading: boolean
}

export default function PropertyGrid({ properties, isLoading }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertySkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(p => (
        <PropertyCard key={p._id} {...p} />
      ))}
    </div>
  )
}
