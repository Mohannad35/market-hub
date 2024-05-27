import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { deleteCouponSchema, editCouponSchema } from "@/lib/validation/coupon-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(
  request: NextRequest,
  { params: { code } }: { params: { code: string } }
) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  const coupon = await prisma.coupon.findUnique({ where: { code }, include: { user: true } });
  if (!coupon) throw new ApiError(404, "Coupon not found");
  // Check if the user is the owner of the coupon or an admin
  if (user.role !== "admin" && user.id !== coupon.userId) throw new ApiError(401, "Unauthorized");
  return NextResponse.json(coupon);
}

async function PATCH_handler(
  request: NextRequest,
  { params: { code } }: { params: { code: string } }
) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Check if the coupon exists
  if (!(await prisma.coupon.findUnique({ where: { code } })))
    throw new ApiError(404, "Coupon not found");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editCouponSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const {
    code: editedCode,
    value,
    name,
    description,
    endDate,
    startDate,
    maxAmount,
    minAmount,
  } = data;
  // Check if the user is the owner of the coupon or an admin
  if (
    user.role !== "admin" &&
    user.id !== (await prisma.coupon.findUnique({ where: { code } }))?.userId
  )
    throw new ApiError(401, "Unauthorized");
  // Edit the coupon
  const coupon = await prisma.coupon.update({
    where: { code },
    data: {
      code: editedCode,
      value: value ? parseInt(value) : undefined,
      name,
      description,
      endDate,
      startDate,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
    },
  });
  return NextResponse.json(coupon);
}

async function DELETE_handler(
  request: NextRequest,
  { params: { code } }: { params: { code: string } }
) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  // Validate code
  const { success, error } = deleteCouponSchema.safeParse({ code });
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Check if the coupon exists
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new ApiError(404, "Coupon not found");
  // Check if the user is the owner of the coupon or an admin
  if (user.role !== "admin" && user.id !== coupon.userId) throw new ApiError(401, "Unauthorized");
  const deletedCoupon = await prisma.coupon.delete({ where: { code } });
  return NextResponse.json(deletedCoupon);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
export const DELETE = wrapperMiddleware(authMiddleware, DELETE_handler);
