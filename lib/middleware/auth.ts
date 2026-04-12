import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";
import type { AppRouteContext } from "./route-context";

/**
 * Auth middleware to check if the user is authenticated (logged in).
 * @param request NextRequest object
 * @param _context Next.js route context (unused)
 */
export const authMiddleware = async (request: NextRequest, _context: AppRouteContext) => {
  const session = await auth();
  if (!session?.user?.email) throw new ApiError(401, "Unauthorized");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new ApiError(401, "Unauthorized");
  request.cookies.set("user", JSON.stringify(user));
};
