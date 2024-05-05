import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/products/new", "/products/:slug/edit"];

export async function middleware(request: NextRequest) {
  const { origin, pathname } = request.nextUrl;
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const session = await auth();
    if (!session) {
      const callbackUrl = encodeURIComponent(`${origin}${pathname}`.replace(/_next.*/g, ""));
      const authUrl = `${origin}/api/auth/signin?callbackUrl=${callbackUrl}`;
      return NextResponse.redirect(authUrl);
    }
  }
}
