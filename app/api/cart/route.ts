import { auth } from "@/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { cartSchemaPartial } from "@/lib/validation/cart-schema";
import prisma from "@/prisma/client";
import { Cart } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function GET_handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject<{ cartId: string }>(searchParams);
  // Get the user
  const session = await auth();
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    console.log("🚀 ~ file: route.ts:17 ~ GET_handler ~ user:", user);
    if (!user || !user.activeCartId) return NextResponse.json(null);
    // Get the cart
    const cart = await prisma.cart.findUnique({
      where: { id: user.activeCartId },
      include: { cartItems: { include: { product: true } } },
    });
    console.log("🚀 ~ file: route.ts:23 ~ GET_handler ~ cart:", cart);
    return NextResponse.json(cart);
  } else if (query.cartId) {
    const cart = await prisma.cart.findUnique({
      where: { id: query.cartId },
      include: { cartItems: { include: { product: true } } },
    });
    return NextResponse.json(cart);
  }
  return NextResponse.json(null);
}

async function POST_handler(request: NextRequest): Promise<NextResponse<Cart>> {
  const session = await auth();
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = cartSchemaPartial.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { userId } = data;
  if (userId) {
    if (!(await prisma.user.findUnique({ where: { id: userId } })))
      throw new ApiError(404, "User not found");
    // Create the cart
    const cart = await prisma.cart.create({ data: { userId } });
    await prisma.user.update({ where: { id: userId }, data: { activeCartId: cart.id } });
    return NextResponse.json(cart, { status: 201 });
  } else if (session?.user?.email) {
    // Get the user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new ApiError(404, "User not found");
    const cart = await prisma.cart.create({ data: { userId: user.id } });
    await prisma.user.update({ where: { id: user.id }, data: { activeCartId: cart.id } });
    return NextResponse.json(cart, { status: 201 });
  } else {
    const cart = await prisma.cart.create({ data: {} });
    return NextResponse.json(cart, { status: 201 });
  }
}

export const POST = wrapperMiddleware(POST_handler);
export const GET = wrapperMiddleware(GET_handler);
