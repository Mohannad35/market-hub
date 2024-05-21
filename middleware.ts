import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  /^\/admin\/?.*/,
  /^\/user\/.*\/dashboard\/?.*/,
  /^\/user\/.*\/security\/?.*/,
  /^\/user\/.*\/settings\/?.*/,
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some(route => pathname.match(route))) {
    const session = await auth();
    if (!session) {
      const callbackUrl = encodeURIComponent(`${pathname}`.replace(/_next.*/g, ""));
      const authUrl = `/auth?callbackUrl=${callbackUrl}`;
      return NextResponse.redirect(new URL(authUrl, request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.svg (SVG files)
     * - *.png (PNG files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*.svg|.*.png).*)",
  ],
};
