"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading when route changes
    setLoading(true);
    
    // Stop loading after a short delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" 
           style={{
             animation: "progress 1s ease-in-out infinite",
           }}>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
