export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl" />
      
      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
        <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
        <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
        <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
        <div className="h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
