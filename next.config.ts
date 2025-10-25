import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Disable source maps to prevent 404 errors from Supabase dependencies
  productionBrowserSourceMaps: false,
  
  // Images optimization
  images: {
    domains: [
      'localhost',
      'api.dicebear.com', // for placeholder avatars
      'images.unsplash.com', // hero backgrounds
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.com',
      },
    ],
    formats: ['image/webp'],
  },
  
  async headers() {
    return [
      // Fix favicon conflict
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; img-src 'self' data: blob: https://*.supabase.co https://api.dicebear.com https://images.unsplash.com; connect-src 'self' https://*.supabase.co; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-eval' 'unsafe-inline'; frame-src 'self'; media-src 'self' blob:`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
