import { auth } from "@/auth";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { categoryQuerySchema, newCategorySchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to create a new category
 * @param request NextRequest
 * @returns { Promise<NextResponse<Category | { message: string } | {}>> }
 * @access private Admin
 * @method POST
 * @example /api/categories
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<Category | { message: string } | {}>> {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({}, { status: 401 });
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newCategorySchema.safeParse(body);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { path } = data;
  const parent = path.replace(/\/[ \w&-]+$/, "");
  // Check if the category already exists
  if (await prisma.category.findUnique({ where: { path } }))
    return NextResponse.json({ message: "Category already exists" }, { status: 400 });
  // Check if the parent doesn't exists
  if (parent && !(await prisma.category.findUnique({ where: { path: parent } })))
    return NextResponse.json({ message: "Parent doesn't exist" }, { status: 400 });
  // Create the category
  const category = await prisma.category.create({ data: { ...data, parent: parent || "/" } });
  return NextResponse.json(category, { status: 201 });
}

/**
 * API route to get categories
 * @param request NextRequest
 * @returns { Promise<NextResponse<Category[] | { message: string }>> }
 * @access public
 * @method GET
 * @example /api/categories
 * @example /api/categories?path=/electronics
 * @example /api/categories?path=/electronics&populate=products
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<Category[] | { message: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = categoryQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { skip, take, path, populate } = data;
  const popObj: { [key: string]: boolean } = {};
  if (populate) populate.forEach(pop => (popObj[pop] = true));
  const categories = await prisma.category.findMany({
    where: { path: { contains: path, mode: "insensitive" } },
    orderBy: { name: "asc" },
    take,
    skip,
    include: popObj,
  });
  return NextResponse.json(categories);
}
