import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { ProductWithBrandAndCategory, ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { editProductSchema, productDetailsQuerySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Prisma, Product, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { nanoid } from "nanoid";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

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
const GET_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<ProductWithBrandAndCategoryAndRates | Product | null>> => {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = productDetailsQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
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
};

const PATCH_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<ProductWithBrandAndCategory | Product | {}>> => {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editProductSchema.safeParse(body);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  // Create a slug for the product if the name is provided
  let newSlug = slug;
  if (data.name) {
    newSlug = slugify(data.name, { lower: true, strict: true, trim: true });
    while (await prisma.product.findUnique({ where: { slug: newSlug } }))
      newSlug = `${newSlug}-${nanoid(8)}`;
  }
  // Edit the product
  const product = await prisma.product.update({
    where: { slug },
    data: { ...data, slug: newSlug, vendorId: user.id },
  });
  return NextResponse.json(product);
};

export const GET = wrapperMiddleware(GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
