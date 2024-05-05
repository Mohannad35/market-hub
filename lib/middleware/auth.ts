import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * Auth middleware to check if the user is authenticated (logged in).
 * @param request NextRequest object
 * @param response NextResponse object
 */
export const authMiddleware = async (request: NextRequest, response: NextResponse) => {
  const session = await auth();
  if (!session?.user?.email) throw new ApiError(401, "Unauthorized");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new ApiError(401, "Unauthorized");
  request.cookies.set("user", JSON.stringify(user));
};
