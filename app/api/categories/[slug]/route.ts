import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { CategoryWithProducts } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import {
  categoryQuerySchema,
  editCategorySchema,
  editProductSchema,
} from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Category } from "@prisma/client";
import { startCase, uniq } from "lodash";
import { nanoid } from "nanoid";
import { User } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to get categories
 * @param request NextRequest
 * @returns { Promise<NextResponse<CategoryWithProducts | Category | null>> }
 * @access public
 * @method GET
 * @example /api/categories
 * @example /api/categories?path=/electronics
 * @example /api/categories?path=/electronics&populate=products
 */
async function GET_handler(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<CategoryWithProducts | Category | null>> {
  const path = decodeURI("/" + slug.replace(/\-/g, "/"));
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = categoryQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const include = data.populate && data.populate[0] === "products" ? { products: true } : undefined;
  const item = await prisma.category.findUnique({
    where: { path },
    include,
  });
  return NextResponse.json(item);
}

const PATCH_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<Category>> => {
  const path = decodeURI("/" + slug.replace(/\-/g, "/"));
  // const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the category from the database and check if it exists
  const category = await prisma.category.findUnique({ where: { path } });
  if (!category) throw new ApiError(404, "Category not found");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editCategorySchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { name, image, parent } = data;
  let newPath: string | undefined = undefined;
  // Check if the parent doesn't exists
  if (parent) {
    if (parent === "/") {
      newPath = `/${category.name}`;
    } else {
      newPath = `${parent}/${category.name}`;
      if (!(await prisma.category.findUnique({ where: { path: parent } })))
        throw new ApiError(400, "Parent doesn't exist");
    }
  }
  if (name) {
    newPath = parent ? `${parent === "/" ? "" : parent}/${name}` : `${category.parent}/${name}`;
    // Check if the category already exists
    if (await prisma.category.findUnique({ where: { path: newPath } }))
      throw new ApiError(400, "Category already exists");
  }
  // Check if category is dublicate
  if (newPath && uniq(newPath.split("/")).length !== newPath.split("/").length)
    throw new ApiError(400, "The category is a duplicate of one of its parent categories.");
  // Edit the category
  const newCategory = await prisma.category.update({
    where: { path },
    data: { name: startCase(name), image, parent, path: newPath },
  });
  return NextResponse.json(newCategory);
};

export const GET = wrapperMiddleware(GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
