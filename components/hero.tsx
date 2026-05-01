import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-background/80 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto text-center">
        <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-6">Premium Real Estate</p>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
          Discover <span className="text-primary italic">Exceptional</span><br />Properties
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore our curated collection of luxury real estate. Each property is carefully selected and AI-analyzed for the most discerning clients.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#properties"
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 transition-colors"
          >
            Explore Properties
          </Link>
          <Link
            href="/properties/add"
            className="px-8 py-3 border border-primary/40 text-foreground font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            List Your Property
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: 'AI', label: 'Powered Analysis' },
            { value: '5★', label: 'Premium Listings' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-foreground/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
