import cloudinary from "@/lib/cloudinary";
import { allowedMiddleware } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { ProductWithBrandAndCategory, ProductWithBrandAndCategoryAndRates } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { editProductSchema, productDetailsQuerySchema } from "@/lib/validation/product-schema";
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
  // Check if the product exists
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) throw new ApiError(404, "Product not found");
  // Check if the user is the vendor of the product or an admin
  if (!user.isAdmin && !(product.vendorId === user.id)) throw new ApiError(403, "Unauthorized");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editProductSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Create a slug for the product if the name is provided
  let newSlug = slug;
  if (data.name) {
    newSlug = slugify(data.name, { lower: true, strict: true, trim: true });
    while (await prisma.product.findUnique({ where: { slug: newSlug } }))
      newSlug = `${newSlug}-${nanoid(8)}`;
  }
  // Edit the product
  const updatedProduct = await prisma.product.update({
    where: { slug },
    data: { ...data, slug: newSlug, vendorId: user.id },
  });
  return NextResponse.json(updatedProduct);
};

const DELETE_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<ProductWithBrandAndCategoryAndRates | Product>> => {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Check if the product exists
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) throw new ApiError(404, "Product not found");
  // Check if the user is the vendor of the product or an admin
  if (!user.isAdmin && !(product.vendorId === user.id)) throw new ApiError(403, "Unauthorized");
  for (const { public_id } of product.image) {
    console.log("Deleting image:", public_id);
    const { result } = await cloudinary.uploader.destroy(public_id, { invalidate: true });
    console.log(public_id, result);
  }
  // Delete the product
  const deletedProduct = await prisma.product.delete({ where: { slug } });
  return NextResponse.json(deletedProduct);
};

export const GET = wrapperMiddleware(GET_handler);
export const PATCH = wrapperMiddleware(
  allowedMiddleware({ isAdmin: true, isVendor: true }),
  PATCH_handler
);
export const DELETE = wrapperMiddleware(
  allowedMiddleware({ isAdmin: true, isVendor: true }),
  DELETE_handler
);
