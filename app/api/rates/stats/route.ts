import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { productRatesQuerySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

// get rating stats for a product
const GET_handler = async (request: NextRequest) => {
  const query = getQueryObject(request.nextUrl.searchParams);
  const { success, data, error } = productRatesQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { productId, productSlug } = data;
  const groupRates = await prisma.rate.groupBy({
    where: { product: { id: productId, slug: productSlug } },
    by: ["rate"],
    _count: true,
  });
  return NextResponse.json(groupRates);
};

export const GET = wrapperMiddleware(GET_handler);
