import { auth } from "@/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors } from "@/lib/utils";
import { deleteFromCartSchema } from "@/lib/validation/cart-schema";
import prisma from "@/prisma/client";
import { Cart } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

async function POST_handler(request: NextRequest): Promise<NextResponse<Cart>> {
  const session = await auth();
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = deleteFromCartSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { cartId, productId } = data;
  let cart: Cart | null = null;
  if (cartId) cart = await prisma.cart.findUnique({ where: { id: cartId } });
  else if (session?.user?.email) {
    // Get the user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new ApiError(404, "User not found");
    if (user.activeCartId) {
      cart = await prisma.cart.findUnique({ where: { id: user.activeCartId } });
    } else {
      cart = await prisma.cart.create({ data: { userId: user.id } });
      await prisma.user.update({ where: { id: user.id }, data: { activeCartId: cart.id } });
    }
  }
  if (!cart)
    throw new ApiError(
      404,
      "Cart not found. Please Check cartId is valid or user is authenticated"
    );
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");
  // Add product to cart
  await prisma.cart.update({
    where: { id: cart.id },
    data: { cartItems: { delete: { cartId_productId: { cartId: cart.id, productId } } } },
  });
  return NextResponse.json(cart, { status: 200 });
}

export const POST = wrapperMiddleware(POST_handler);
