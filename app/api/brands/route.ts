import { auth } from "@/auth";
import { brandQuerySchema, newBrandSchema } from "@/lib/validation-schemas";
import { formatErrors, getQueryObject } from "@/lib/utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { Brand, Prisma, User } from "@prisma/client";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { ApiError } from "next/dist/server/api-utils";
import { authMiddleware } from "@/lib/middleware/auth";

/**
 * API route handler to create a new brand
 * @param request NextRequest
 * @returns { Promise<NextResponse<Brand>> }
 * @access private Admin
 * @method POST
 * @example /api/brands
 */
async function POST_handler(request: NextRequest): Promise<NextResponse<Brand>> {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newBrandSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Create a slug for the brand
  const slug = slugify(data.name, { lower: true, strict: true, trim: true });
  if (await prisma.brand.findUnique({ where: { slug } }))
    throw new ApiError(400, "Brand already exists");
  // Create the brand
  const brand = await prisma.brand.create({ data: { ...data, slug } });
  return NextResponse.json(brand, { status: 201 });
}

/**
 * API route to get brands
 * @param request NextRequest
 * @returns { Promise<NextResponse<{ items: Brand[]; count: number }>> }
 * @access public
 * @method GET
 * @example /api/brands
 * @example /api/brands?path=/electronics
 * @example /api/brands?path=/electronics&populate=products
 */
async function GET_handler(
  request: NextRequest
): Promise<NextResponse<{ items: Brand[]; count: number }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = brandQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { direction, sortBy, page, pageSize, search } = data;
  const prismaQuery: Prisma.BrandFindManyArgs = {
    where: { name: { contains: search || undefined, mode: "insensitive" } },
    orderBy: { [sortBy]: direction },
    take: pageSize || 20,
    skip: ((page || 1) - 1) * (pageSize || 20),
  };
  const [items, count] = await prisma.$transaction([
    prisma.brand.findMany(prismaQuery),
    prisma.brand.count({ where: prismaQuery.where }),
  ]);
  return NextResponse.json({ items, count });
}

export const POST = wrapperMiddleware(authMiddleware, POST_handler);
export const GET = wrapperMiddleware(GET_handler);
