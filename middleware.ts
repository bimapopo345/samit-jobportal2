import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/jobs',
    '/companies',
    '/classes',
    '/auth/login',
    '/auth/register',
    '/auth/sign-up',
  ];

  // Check if current path is a public route or starts with a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    (route !== '/' && pathname.startsWith(route + '/'))
  );

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/apply', '/enroll'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Admin-only routes
  const adminRoutes = ['/dashboard/admin'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Organization-only routes
  const orgRoutes = ['/dashboard/org', '/dashboard/legal', '/dashboard/jobs', '/dashboard/applicants'];
  const isOrgRoute = orgRoutes.some(route => pathname.startsWith(route));

  // If no user and trying to access protected route, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // If user exists, get user role
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    // If profile doesn't exist, they might be a new user
    if (!profile && pathname !== '/onboarding') {
      // Skip redirect for these paths to avoid loops
      const skipPaths = ['/auth/', '/api/'];
      const shouldSkip = skipPaths.some(path => pathname.startsWith(path));
      
      if (!shouldSkip) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Check admin access
    if (isAdminRoute && userRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Check organization access
    if (isOrgRoute && userRole !== 'lembaga' && userRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // Redirect to appropriate dashboard based on role
    if (pathname === '/dashboard' && userRole) {
      const url = request.nextUrl.clone();
      if (userRole === 'admin') {
        url.pathname = '/dashboard/admin/overview';
      } else if (userRole === 'lembaga') {
        url.pathname = '/dashboard/org';
      } else {
        url.pathname = '/dashboard/profile';
      }
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api routes (they handle their own auth)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
