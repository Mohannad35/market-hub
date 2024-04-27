import { auth } from "@/auth";
import { brandQuerySchema, newBrandSchema } from "@/lib/validation-schemas";
import { formatErrors, getQueryObject } from "@/lib/utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({}, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({}, { status: 401 });
  // Get the body of the request and validate it
  const body = await req.json();
  const { success, data, error } = newBrandSchema.safeParse(body);
  if (!success) return NextResponse.json({ error: formatErrors(error).messege }, { status: 400 });
  // Create a slug for the brand
  const slug = slugify(data.name, { lower: true, strict: true, trim: true });
  if (await prisma.brand.findUnique({ where: { slug } }))
    return NextResponse.json({ error: "Brand already exists" }, { status: 400 });
  // Create the brand
  const brand = await prisma.brand.create({ data: { ...data, slug } });
  return NextResponse.json(brand, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = getQueryObject(searchParams);
  const { success, data, error } = brandQuerySchema.safeParse(query);
  if (!success) return NextResponse.json(formatErrors(error), { status: 400 });
  const { skip, take } = data;
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" }, take, skip });
  return NextResponse.json(brands);
}
