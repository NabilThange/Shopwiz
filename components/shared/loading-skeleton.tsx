export function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="neubrutalism-card p-4 bg-white">
          <div className="loading-shimmer h-48 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="loading-shimmer h-4 rounded w-3/4"></div>
            <div className="loading-shimmer h-4 rounded w-1/2"></div>
            <div className="flex justify-between">
              <div className="loading-shimmer h-6 rounded w-20"></div>
              <div className="loading-shimmer h-4 rounded w-16"></div>
            </div>
            <div className="loading-shimmer h-10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
