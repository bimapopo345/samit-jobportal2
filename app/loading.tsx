export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated Logo */}
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-spin" />
          <div className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-ping opacity-30" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 animate-pulse">Loading...</h2>
      </div>
    </div>
  );
}
