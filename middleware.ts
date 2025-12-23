import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing admin routes (except auth page)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/auth')) {
        const adminToken = request.cookies.get('admin_token');

        if (!adminToken) {
            // Redirect to auth page if not authenticated
            return NextResponse.redirect(new URL('/admin/auth', request.url));
        }
    }

    // If authenticated and trying to access auth page, redirect to dashboard
    if (pathname === '/admin/auth') {
        const adminToken = request.cookies.get('admin_token');

        if (adminToken) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
