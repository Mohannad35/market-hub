import { auth } from "@/auth";
import { brandQuerySchema, newBrandSchema } from "@/lib/validation-schemas";
import { formatErrors, getQueryObject } from "@/lib/utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { Brand } from "@prisma/client";

/**
 * API route handler to create a new brand
 * @param request NextRequest
 * @returns { Promise<NextResponse<Brand | { message: string } | {}>> }
 * @access private Admin
 * @method POST
 * @example /api/brands
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<Brand | { message: string } | {}>> {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({}, { status: 401 });
  // Get the body of the request and validate it
  const body = await request.json();
  const { success, data, error } = newBrandSchema.safeParse(body);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  // Create a slug for the brand
  const slug = slugify(data.name, { lower: true, strict: true, trim: true });
  if (await prisma.brand.findUnique({ where: { slug } }))
    return NextResponse.json({ message: "Brand already exists" }, { status: 400 });
  // Create the brand
  const brand = await prisma.brand.create({ data: { ...data, slug } });
  return NextResponse.json(brand, { status: 201 });
}

/**
 * API route to get brands
 * @param request NextRequest
 * @returns { Promise<NextResponse<Brand[] | { message: string }>> }
 * @access public
 * @method GET
 * @example /api/brands
 * @example /api/brands?path=/electronics
 * @example /api/brands?path=/electronics&populate=products
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<Brand[] | { message: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = brandQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { skip, take } = data;
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" }, take, skip });
  return NextResponse.json(brands);
}
