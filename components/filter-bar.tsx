'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void
  locations: string[]
}

export interface FilterState {
  search: string
  location: string
  minPrice: string
  maxPrice: string
  tags: string[]
}

const AVAILABLE_TAGS = ['luxury', 'pool', 'sea_view', 'modern', 'garden', 'city_view', 'balcony', 'spacious']

export default function FilterBar({ onFiltersChange, locations }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    tags: [],
  })
  const [showFilters, setShowFilters] = useState(false)

  const update = (patch: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...patch }))
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    update({ tags: newTags })
  }

  const applyFilters = () => {
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    const reset: FilterState = { search: '', location: '', minPrice: '', maxPrice: '', tags: [] }
    setFilters(reset)
    onFiltersChange(reset)
  }

  const hasActiveFilters = filters.search || filters.location || filters.minPrice || filters.maxPrice || filters.tags.length > 0

  return (
    <div id="properties" className="bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* Main search row */}
        <div className="flex gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={filters.search}
              onChange={e => update({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          {/* Location */}
          <select
            value={filters.location}
            onChange={e => update({ location: e.target.value })}
            className="px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors min-w-[160px]"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Toggle advanced */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              showFilters || filters.minPrice || filters.maxPrice || filters.tags.length > 0
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border text-foreground/70 hover:border-primary/50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {filters.tags.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filters.tags.length}
              </span>
            )}
          </button>

          {/* Apply */}
          <button
            onClick={applyFilters}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/80 transition-colors"
          >
            Search
          </button>

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 text-foreground/60 hover:text-foreground text-sm transition-colors"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* Price range */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wider">Min Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={filters.minPrice}
                  onChange={e => update({ minPrice: e.target.value })}
                  min="0"
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-foreground/50 mb-1.5 font-medium uppercase tracking-wider">Max Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={filters.maxPrice}
                  onChange={e => update({ maxPrice: e.target.value })}
                  min="0"
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs text-foreground/50 mb-2.5 font-medium uppercase tracking-wider">Features</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filters.tags.includes(tag)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary/50 text-foreground/70 border-border hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {tag.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
