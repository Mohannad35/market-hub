import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { applyCouponSchema } from "@/lib/validation/coupon-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function POST_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = applyCouponSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { code } = data;
  // Get the coupon
  const coupon = await prisma.coupon.findUnique({ where: { code }, include: { user: true } });
  if (!coupon) throw new ApiError(404, "Invalid coupon code");
  return NextResponse.json(coupon);
}

export const POST = wrapperMiddleware(authMiddleware, POST_handler);
