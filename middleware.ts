import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(request => {
  if (!request.auth) {
    const { origin, pathname } = request.nextUrl;
    const callbackUrl = encodeURIComponent(`${origin}${pathname}`.replace(/_next.*/g, ''));
    const authUrl = `${origin}/api/auth/signin?callbackUrl=${callbackUrl}`;

    return NextResponse.redirect(authUrl);
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/products/new', '/products/:slug/edit'],
};
