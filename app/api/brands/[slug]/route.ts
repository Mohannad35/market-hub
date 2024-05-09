import { authMiddleware } from "@/lib/middleware/auth";
import { wrapperMiddleware } from "@/lib/middleware/wrapper";
import { BrandWithProducts } from "@/lib/types";
import { formatErrors, getQueryObject } from "@/lib/utils";
import { brandQuerySchema, editBrandSchema } from "@/lib/validation-schemas";
import prisma from "@/prisma/client";
import { Brand } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

async function GET_handler(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<BrandWithProducts | Brand | null>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = brandQuerySchema.safeParse(query);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const include = data.populate && data.populate[0] === "products" ? { products: true } : undefined;
  const item = await prisma.brand.findUnique({ where: { slug }, include });
  return NextResponse.json(item);
}

const PATCH_handler = async (
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
): Promise<NextResponse<Brand>> => {
  // const user = JSON.parse(request.cookies.get("user")!.value!) as User;
  // Get the brand from the database and check if it exists
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) throw new ApiError(404, "Brand not found");
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = editBrandSchema.safeParse(body);
  if (!success) throw new ApiError(400, formatErrors(error).message);
  const { name, image } = data;
  // Create a slug for the brand if the name is provided
  let newSlug = slug;
  if (data.name) {
    newSlug = slugify(data.name, { lower: true, strict: true, trim: true });
    if (await prisma.brand.findUnique({ where: { slug: newSlug } }))
      throw new ApiError(400, "Brand already exists");
  }
  // Edit the brand
  const newBrand = await prisma.brand.update({
    where: { slug },
    data: { name: name, image, slug: newSlug },
  });
  return NextResponse.json(newBrand);
};

export const GET = wrapperMiddleware(GET_handler);
export const PATCH = wrapperMiddleware(authMiddleware, PATCH_handler);
