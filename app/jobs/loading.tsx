export default function JobsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-12 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-4" />
        <div className="h-6 w-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg" />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Skeleton */}
        <aside className="lg:col-span-1 space-y-6 animate-pulse">
          <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
          <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
          <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
        </aside>

        {/* Jobs Grid Skeleton */}
        <div className="lg:col-span-3 space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
