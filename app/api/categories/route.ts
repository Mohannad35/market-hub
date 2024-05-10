import { auth } from "@/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { categoryQuerySchema, newCategorySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Category, Prisma, User } from "@prisma/client";
import { difference, startCase, uniq } from "lodash";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to create a new category
 * @param request NextRequest
 * @returns { Promise<NextResponse<Category>> }
 * @access private Admin
 * @method POST
 * @example /api/categories
 */
async function POST_handler(request: NextRequest): Promise<NextResponse<Category>> {
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newCategorySchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { name, image, parent } = data;
  // Check if the parent doesn't exists
  if (parent && parent !== "/" && !(await prisma.category.findUnique({ where: { path: parent } })))
    throw new ApiError(400, "Parent doesn't exist");
  const path = parent && parent !== "/" ? `${parent}/${name}` : `/${name}`;
  // Check if the category already exists
  if (await prisma.category.findUnique({ where: { path } }))
    throw new ApiError(400, "Category already exists");
  // Check if category is dublicate
  if (uniq(path.split("/")).length !== path.split("/").length)
    throw new ApiError(400, "The category is a duplicate of one of its parent categories.");
  // Create the category
  const category = await prisma.category.create({
    data: { name: startCase(name), image, path, parent: parent || "/" },
  });
  return NextResponse.json(category, { status: 201 });
}

/**
 * API route to get categories
 * @param request NextRequest
 * @returns { Promise<NextResponse<{ items: Category[]; count: number }>> }
 * @access public
 * @method GET
 * @example /api/categories
 * @example /api/categories?path=/electronics
 * @example /api/categories?path=/electronics&populate=products
 */
async function GET_handler(
  request: NextRequest
): Promise<NextResponse<{ items: Category[]; count: number }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = categoryQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { direction, sortBy, page, pageSize, search } = data;
  const prismaQuery: Prisma.CategoryFindManyArgs = {
    where: { name: { contains: search || undefined, mode: "insensitive" } },
    orderBy: { [sortBy]: direction },
    take: pageSize || 20,
    skip: ((page || 1) - 1) * (pageSize || 20),
  };
  const [items, count] = await prisma.$transaction([
    prisma.category.findMany(prismaQuery),
    prisma.category.count({ where: prismaQuery.where }),
  ]);
  return NextResponse.json({ items, count });
}

export const POST = wrapperMiddleware(POST_handler);
export const GET = wrapperMiddleware(GET_handler);
