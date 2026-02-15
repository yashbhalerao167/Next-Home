import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected routes
    const isProtectedRoute =
        path.startsWith('/profile') ||
        path.startsWith('/create-listing') ||
        path.startsWith('/update-listing');

    // Check for the access token in cookies
    const token = request.cookies.get('access_token')?.value;

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect authenticated users away from auth pages
    if ((path === '/sign-in' || path === '/sign-up') && token) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/profile/:path*',
        '/create-listing',
        '/update-listing/:path*',
        '/sign-in',
        '/sign-up',
    ],
};
