// Cache configuration for Supabase queries
export const cacheConfig = {
  // Revalidate time in seconds
  profiles: 60, // 1 minute
  jobs: 30, // 30 seconds for job listings
  organizations: 300, // 5 minutes
  applications: 10, // 10 seconds for real-time updates
  static: 3600, // 1 hour for static content
};

// Fetch with cache configuration
export const fetchOptions = (revalidate: number = 60) => ({
  next: { revalidate },
  cache: 'force-cache' as RequestCache,
});
