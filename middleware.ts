import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // 保護するパスの指定（例: /history や /settings など）
    // 認証が機能するまでの間、一時的にBasic認証で保護する場合はこちらに追加します。
    // 今回はStripeのセキュリティ要件（管理画面へのアクセス制限）のため、
    // /dashboard など管理系ページを想定しています。
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/admin')) {

        const basicAuth = request.headers.get('authorization');
        if (basicAuth) {
            const auth = basicAuth.split(' ')[1];
            const [user, pwd] = atob(auth).split(':');

            // .env.localに設定されたID/PASSと照合
            if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
                return NextResponse.next();
            }
        }

        return new NextResponse('Auth required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
