"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface OptimizedLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  prefetch?: boolean;
}

export function OptimizedLink({ 
  children, 
  prefetch = true,
  ...props 
}: OptimizedLinkProps) {
  const router = useRouter();

  // Prefetch on hover for better performance
  const handleMouseEnter = () => {
    if (typeof props.href === 'string') {
      router.prefetch(props.href);
    }
  };

  return (
    <Link 
      {...props} 
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Link>
  );
}
