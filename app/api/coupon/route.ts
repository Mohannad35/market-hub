import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import {
  couponQuerySchema,
  createCouponSchema,
  deleteCouponSchema,
} from "@/lib/validation/coupon-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = couponQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { sortBy, direction, search } = data;
  const coupons = await prisma.coupon.findMany({
    where: {
      code: { contains: search, mode: "insensitive" },
      userId: user?.role === "admin" ? undefined : id,
    },
    orderBy: { [sortBy!]: direction },
    include: { user: true },
  });
  return NextResponse.json(coupons);
}

async function POST_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = createCouponSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { code, value, name, description, endDate, startDate, maxAmount, minAmount } = data;
  // Check if the coupon already exists
  if (await prisma.coupon.findUnique({ where: { code } }))
    throw new ApiError(400, "Coupon already exists");
  // Create the coupon
  const coupon = await prisma.coupon.create({
    data: {
      code,
      value: parseInt(value),
      name,
      description,
      endDate,
      startDate,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      type: user.role === "admin" ? "admin" : "vendor",
      userId: user.id,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}

async function DELETE_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = deleteCouponSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { code } = data;
  // Check if the coupon exists
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new ApiError(404, "Coupon not found");
  // Check if the user is the owner of the coupon or an admin
  if (user.role !== "admin" && user.id !== coupon.userId) throw new ApiError(401, "Unauthorized");
  const deletedCoupon = await prisma.coupon.delete({ where: { code } });
  return NextResponse.json(deletedCoupon);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
export const POST = wrapperMiddleware(authMiddleware, POST_handler);
export const DELETE = wrapperMiddleware(authMiddleware, DELETE_handler);
