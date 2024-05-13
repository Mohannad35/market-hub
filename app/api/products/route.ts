import { allowedMiddleware } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { newProductSchema, productQuerySchema } from "@/lib/validation/product-schema";
import prisma from "@/prisma/client";
import { Prisma, Product, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { nanoid } from "nanoid";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

/**
 * API route to create a new product
 * @param request NextRequest object
 * @returns { Promise<NextResponse<Product>> }
 * @returns returns the created product if successfully created
 * @returns returns an empty response if the user is not authenticated with status 401
 * @returns returns an empty response if the user is not found with status 401
 * @returns returns an error message if the request body is invalid with status 400
 * @access private Admin or Vendor
 * @method POST
 * @example /api/products
 */
async function POST_handler(request: NextRequest): Promise<NextResponse<Product>> {
  const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newProductSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  // Create a slug for the product
  let slug = slugify(data.name, { lower: true, strict: true, trim: true });
  while (await prisma.product.findUnique({ where: { slug } })) slug = `${slug}-${nanoid(8)}`;
  // Create the product
  const product = await prisma.product.create({ data: { ...data, slug, vendorId: user.id } });
  return NextResponse.json(product, { status: 201 });
}

/**
 * API route to get a list of products
 * @param request NextRequest object
 * @returns { Promise<NextResponse<{ items: Product[]; count: number }>> }
 * @returns returns a list of products and the total count of products
 * @returns returns an error message if the query is invalid with status 400
 * @access public
 * @method GET
 * @example /api/products
 * @example /api/products?page=1&pageSize=20&sortBy=name&direction=asc
 * @example /api/products?search=iphone&category=phones&brands=apple
 * @example /api/products?minPrice=1000&maxPrice=2000
 * @example /api/products?populate=brand,category
 */
async function GET_handler(
  request: NextRequest
): Promise<NextResponse<{ items: Product[]; count: number }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = productQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const {
    page,
    pageSize,
    sortBy,
    search,
    direction,
    category,
    brands,
    minPrice,
    maxPrice,
    populate,
    popular,
  } = data;
  sortBy.replace("name", "slug");
  const popObj: Prisma.ProductInclude<DefaultArgs> | null | undefined = {};
  if (populate) populate.forEach(pop => (popObj[pop as "brand" | "category" | "vendor"] = true));
  const prismaQuery: Prisma.ProductFindManyArgs = {
    where: {
      category: category ? { path: { contains: category, mode: "insensitive" } } : undefined,
      brand: brands ? { slug: { in: brands } } : undefined,
      name: { contains: search || undefined, mode: "insensitive" },
      price: { gte: minPrice, lte: maxPrice },
    },
    orderBy: popular
      ? [{ rating: "desc" }, { ratingCount: "desc" }, { sold: "desc" }, { createdAt: "desc" }]
      : { [sortBy]: direction },
    take: pageSize || 20,
    skip: ((page || 1) - 1) * (pageSize || 20),
    include: popObj,
  };
  const [items, count] = await prisma.$transaction([
    prisma.product.findMany(prismaQuery),
    prisma.product.count({ where: prismaQuery.where }),
  ]);
  return NextResponse.json({ items, count });
}

export const GET = wrapperMiddleware(GET_handler);
export const POST = wrapperMiddleware(
  allowedMiddleware({ isAdmin: true, isVendor: true }),
  POST_handler
);
