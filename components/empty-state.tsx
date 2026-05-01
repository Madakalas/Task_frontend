import Link from 'next/link'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 border border-border">
        <span className="text-4xl">🏙️</span>
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">No properties found</h3>
      <p className="text-foreground/50 text-sm max-w-sm mb-8">
        Try adjusting your search filters or be the first to list a property in this area.
      </p>
      <Link
        href="/properties/add"
        className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors"
      >
        List Your Property
      </Link>
    </div>
  )
}
