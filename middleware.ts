import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // /admin: keep existing Basic Auth
    if (pathname.startsWith('/admin')) {
        const basicAuth = request.headers.get('authorization');
        if (basicAuth) {
            const auth = basicAuth.split(' ')[1];
            const [user, pwd] = atob(auth).split(':');
            if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next();
            }
        }
        return new NextResponse('Auth required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        });
    }

    // /dashboard, /app/*, /order: Firebase session cookie check
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/app') || pathname.startsWith('/order')) {
        const session = request.cookies.get('session')?.value;
        if (!session) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/app/:path*', '/order/:path*', '/order'],
};
