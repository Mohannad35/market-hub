import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { productRatesQuerySchema } from "@/lib/validation/product-schema";
import prisma from "@/prisma/client";
import { Product, User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const GET_handler = async (request: NextRequest) => {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  const query = getQueryObject(request.nextUrl.searchParams);
  const { success, data, error } = productRatesQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { productId, productSlug } = data;
  const product = productId
    ? await prisma.product.findUnique({ where: { id: productId } })
    : await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) throw new ApiError(404, "Product not found");
  // Get the rating for the product
  const rate = await prisma.rate.findUnique({
    where: { productId_userId: { productId: product.id, userId: user.id } },
    include: { user: true },
  });
  return NextResponse.json(rate);
};

export const GET = wrapperMiddleware(authMiddleware, GET_handler);
