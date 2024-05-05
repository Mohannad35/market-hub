import { ProductWithBrandAndCategory, ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { productDetailsQuerySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Prisma, Product } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to get product details
 * @param request NextRequest object
 * @param params params containing product slug
 * @returns { Promise<NextResponse<ProductWithBrandAndCategoryAndRates | Product | { message: string } | null>> }
 * @returns returns a product populated with brand and category if requested in the query
 * @returns returns a product if found by the slug or null if not found
 * @access public
 * @method GET
 * @example /api/products/iphone-12
 * @example /api/products/iphone-12?populate=brand,category
 */
export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<
  NextResponse<ProductWithBrandAndCategoryAndRates | Product | { message: string } | null>
> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = productDetailsQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { populate } = data;
  const include: Prisma.ProductInclude<DefaultArgs> | null | undefined = {};
  if (populate)
    populate.forEach(pop => {
      if (pop === "rates") include[pop as "rates"] = { include: { user: true } };
      else include[pop as "brand" | "category" | "vendor" | "rates"] = true;
    });
  const product = await prisma.product.findUnique({
    where: { slug },
    include,
  });
  return NextResponse.json(product);
}
