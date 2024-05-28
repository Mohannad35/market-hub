import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { orderQuerySchema } from "@/lib/validation/order-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(request: NextRequest) {
  const { id } = JSON.parse(request.cookies.get("user")!.value!) as User;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(401, "Unauthorized");
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = orderQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { sortBy, direction, search, admin } = data;
  const orders = await prisma.order.findMany({
    where: {
      code: { contains: search, mode: "insensitive" },
      userId: admin ? undefined : id,
    },
    orderBy: { [sortBy!]: direction },
    include: {
      user: true,
      cart: { include: { cartItems: { include: { product: true } } } },
      coupon: true,
    },
  });
  return NextResponse.json(orders);
}

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
