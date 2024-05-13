import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { productRatesQuerySchema } from "@/lib/validation/product-schema";
import { newRateSchema } from "@/lib/validation/rate-schema";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

const POST_handler = async (request: NextRequest) => {
  // Get the user from the cookies and it must be valid because of the authMiddleware
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newRateSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { productId, rate, comment } = data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, "Product not found");
  if (await prisma.rate.findFirst({ where: { productId, userId: user.id } }))
    throw new ApiError(400, "Rate already exists");
  const newRating = (product.rating * product.ratingCount + rate) / (product.ratingCount + 1);
  const [rating] = await prisma.$transaction([
    prisma.rate.create({
      data: {
        rate,
        comment,
        product: { connect: { id: productId } },
        user: { connect: { id: user.id } },
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: {
        rating: newRating,
        ratingCount: { increment: 1 },
      },
    }),
  ]);
  return NextResponse.json(rating, { status: 201 });
};

const GET_handler = async (request: NextRequest) => {
  const query = getQueryObject(request.nextUrl.searchParams);
  const { success, data, error } = productRatesQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { productId, page, pageSize, direction, sortBy } = data;
  // Get the rating for the product
  const rates = await prisma.rate.findMany({
    where: { productId },
    orderBy: { [sortBy]: direction },
    take: pageSize || 20,
    skip: ((page || 1) - 1) * (pageSize || 20),
    include: { user: true },
  });
  return NextResponse.json(rates, { status: 201 });
};

export const GET = wrapperMiddleware(GET_handler);
export const POST = wrapperMiddleware(authMiddleware, POST_handler);
