import { authMiddleware } from "@/lib/middleware/auth";
import { isAllowed } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
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
  const order = await prisma.order.findUnique({
    where: { code },
    include: {
      user: true,
      cart: { include: { cartItems: { include: { product: true } } } },
      coupon: true,
    },
  });
  if (!order) throw new ApiError(404, "Order not found");
  // Check if the order belongs to the user or the user is an admin
  if (order.userId !== id && isAllowed("support", user)) throw new ApiError(401, "Unauthorized");
  return NextResponse.json(order);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
