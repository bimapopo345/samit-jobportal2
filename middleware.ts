import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    // Check if env vars exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.next();
    }

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

  // Simple auth check only - remove complex role checking for now
  if (user) {
    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
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
