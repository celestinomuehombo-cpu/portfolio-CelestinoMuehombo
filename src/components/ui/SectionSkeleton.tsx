export default function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-4 py-8">
      <div className="h-3 w-24 bg-surface-light dark:bg-surface2 rounded-full" />
      <div className="h-8 w-64 bg-surface-light dark:bg-surface2 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-surface-light dark:bg-surface2 p-6 space-y-3">
            <div className="h-3 w-16 bg-white dark:bg-surface-dark rounded-full" />
            <div className="h-5 w-3/4 bg-white dark:bg-surface-dark rounded-lg" />
            <div className="h-3 w-full bg-white dark:bg-surface-dark rounded-lg" />
            <div className="h-3 w-5/6 bg-white dark:bg-surface-dark rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
