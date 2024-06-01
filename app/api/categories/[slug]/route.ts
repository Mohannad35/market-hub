import cloudinary from "@/lib/cloudinary";
import { allowedMiddleware } from "@/lib/middleware/permissions";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { CategoryWithProducts } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { categoryQuerySchema, editCategorySchema } from "@/lib/validation/category-schema";
import { logger } from "@/logger";
import prisma from "@/prisma/client";
import { Category, User } from "@prisma/client";
import { startCase, uniq } from "lodash";
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
  if (parent && parent !== "/" && !(await prisma.category.findUnique({ where: { path: parent } })))
    throw new ApiError(400, "Parent doesn't exist");
  if (parent && name) {
    newPath = `${parent}${!parent.endsWith("/") && "/"}${name.toLowerCase()}`;
  } else if (parent && !name) {
    newPath = `${parent}${!parent.endsWith("/") && "/"}${category.name.toLowerCase()}`;
  } else if (!parent && name) {
    newPath = `${category.parent}/${name.toLowerCase()}`;
  }
  // Check if the category already exists
  if (newPath && (await prisma.category.findUnique({ where: { path: newPath } })))
    throw new ApiError(400, "Category already exists");
  // Check if category is dublicate
  if (newPath && uniq(newPath.split("/")).length !== newPath.split("/").length)
    throw new ApiError(400, "The category is a duplicate of one of its parent categories.");
  // Edit the category
  const newCategory = await prisma.category.update({
    where: { path },
    data: { name: name ? startCase(name) : undefined, image, parent, path: newPath },
  });
  return NextResponse.json(newCategory);
};

const DELETE_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<Category>> => {
  const path = decodeURI("/" + slug.replace(/\-/g, "/"));
  // Check if the category exists
  const category = await prisma.category.findUnique({ where: { path } });
  if (!category) throw new ApiError(404, "Category not found");
  // Check if the category has products
  const products = await prisma.product.findMany({ where: { categoryId: category.id } });
  if (products.length) throw new ApiError(400, "Category has products. Move or delete them first");
  // Check if the category has subcategories
  const subcategories = await prisma.category.findMany({ where: { parent: path } });
  if (subcategories.length)
    throw new ApiError(400, "Category has subcategories. Move or delete them first");
  // Delete the category
  const deletedCategory = await prisma.category.delete({ where: { path } });
  if (deletedCategory.image) {
    const { result } = await cloudinary.uploader.destroy(deletedCategory.image.public_id);
    logger.info("Deleting image with publicId:", deletedCategory.image.public_id, result);
  }
  return NextResponse.json(deletedCategory);
};

export const GET = wrapperMiddleware(GET_handler);
export const PATCH = wrapperMiddleware(allowedMiddleware("admin"), PATCH_handler);
export const DELETE = wrapperMiddleware(allowedMiddleware("admin"), DELETE_handler);
