export default function PropertySkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="w-full aspect-[4/3] bg-secondary/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary/50 rounded w-3/4" />
        <div className="h-3 bg-secondary/30 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-secondary/40 rounded-full w-16" />
          <div className="h-5 bg-secondary/40 rounded-full w-12" />
        </div>
        <div className="h-px bg-border mt-2" />
        <div className="h-3 bg-secondary/30 rounded w-1/4" />
      </div>
    </div>
  )
}
